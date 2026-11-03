---
n: 81
slug: test-asoslari
title: "Testlar: table-driven, subtest, fixture va testing paketi"
summary: "testing paketining haqiqiy imkoniyatlari: table-driven testlar, subtest va t.Parallel, t.Helper, t.Cleanup, t.TempDir, t.Setenv, t.Context, go test bayroqlari va yomon test xabarlari tuzog'i."
duration: 40
sources:
  - id: pkg-testing
    note: "T tipi metodlari (Run, Parallel, Helper, Cleanup, TempDir, Setenv, Context, Chdir), TestMain va testing paketining umumiy tavsifi"
  - id: 100go
    note: "Testing mavzusidagi umumiy tavsiyalar: test rejimlari (-race, -shuffle, -parallel), table-driven testlar, vaqtga bog'liq testlar. Aniq band raqamlari tekshirilmagan"
  - id: code-review-comments
    note: "Useful Test Failures bo'limi: test xabarida nima chaqirilgani, nima olingani va nima kutilgani yozilishi kerak"
quiz:
  - q: "Table-driven testda har bir qator uchun `t.Run(tt.name, ...)` chaqirilmadi, o'rniga bitta `for` siklida `t.Fatalf` ishlatildi. Uchinchi qator xato berdi. Nima bo'ladi?"
    options:
      - "Test to'xtaydi va keyingi qatorlar umuman tekshirilmaydi; qaysi qator xato bergani faqat xabardan bilinadi"
      - "Qolgan qatorlar ham tekshiriladi, chunki t.Fatalf faqat joriy qatorni to'xtatadi"
      - "Go avtomatik subtest yaratadi va hamma qatorlarni alohida bajaradi"
      - "Kompilyatsiya xatosi: t.Fatalf siklda ishlatilmaydi"
    answer: 0
    explain: "t.Fatalf butun test funksiyasini to'xtatadi (runtime.Goexit orqali). Subtest bo'lmasa, sikl uchinchi qatorda uziladi va oxirgi qatorlar tekshirilmay qoladi. t.Run har qatorni mustaqil test qiladi: biri yiqilsa ham qolganlari ishlaydi, -run bilan esa bitta qatorni alohida chaqirish mumkin."
  - q: "Go 1.22 va undan yangi go.mod versiyasi bilan quyidagi kod nima qiladi: `for _, tt := range tests { t.Run(tt.name, func(t *testing.T) { t.Parallel(); check(tt) }) }`?"
    options:
      - "Hamma parallel subtestlar oxirgi tt qiymatini ko'radi, shuning uchun `tt := tt` yozish shart"
      - "Panic beradi: t.Parallel range sikli ichida chaqirilmaydi"
      - "Subtestlar ketma-ket bajariladi, t.Parallel e'tiborsiz qoladi"
      - "Har bir subtest o'z tt nusxasini ko'radi, chunki sikl o'zgaruvchisi har iteratsiyada yangidan yaratiladi"
    answer: 3
    explain: "Go 1.22 dan boshlab for siklining o'zgaruvchilari har iteratsiyada alohida. Eski versiyada (go.mod'da go 1.21 va undan past) parallel subtest closure'i bitta o'zgaruvchini ko'rardi va `tt := tt` nusxasi kerak bo'lardi. Bu sozlama go.mod'dagi go qatoriga bog'liq, toolchain versiyasiga emas."
  - q: "Test ichida `t.Setenv(\"FUEL_ALERT_FILE\", path)` chaqirilgan va shu test `t.Parallel()` ham chaqirsa, nima bo'ladi?"
    options:
      - "Environment o'zgaruvchisi faqat shu goroutine uchun o'rnatiladi"
      - "Test panic bilan yiqiladi: t.Setenv ishlatadigan test parallel bo'la olmaydi"
      - "Sozlama ishlaydi, lekin test oxirida tiklanmaydi"
      - "go vet kompilyatsiyadan oldin xato beradi"
    answer: 1
    explain: "Process environment umumiy, shuning uchun t.Setenv parallel testlar bilan mos kelmaydi va testing paketi buni panic bilan bildiradi. Bu cheklov t.Chdir uchun ham amal qiladi. Sozlama tiklanishi esa to'g'ri ishlaydi (Cleanup orqali), muammo faqat parallellikda."
  - q: "Yordamchi funksiya `func mustLoad(t *testing.T, name string)` ichida t.Fatalf chaqiriladi, lekin xato xabaridagi fayl:qator yordamchining o'zini ko'rsatyapti. Nima yetishmayapti?"
    options:
      - "Yordamchi funksiya `t.Parallel()` chaqirishi kerak"
      - "Yordamchi `*testing.T` o'rniga `testing.TB` olishi kerak"
      - "Yordamchining birinchi qatorida `t.Helper()` chaqirilishi kerak"
      - "Xabarda `t.Logf` ishlatish kerak, t.Fatalf emas"
    answer: 2
    explain: "t.Helper() funksiyani yordamchi deb belgilaydi va xato joyi chaqiruvchi qatori sifatida ko'rsatiladi. testing.TB ham to'g'ri, lekin qatorni to'g'rilamaydi: u test va benchmark uchun umumiy imzo berish uchun kerak."
  - q: "Bir testda ketma-ket uchta `t.Cleanup` va `defer` ro'yxatdan o'tkazilgan: Cleanup(A), Cleanup(B), Cleanup(C). Ular qaysi tartibda ishlaydi?"
    options:
      - "C, B, A: oxirgi qo'shilgani birinchi ishlaydi (defer kabi), va barchasi test hamda uning subtestlari tugagandan keyin"
      - "Tartib kafolatlanmagan, parallel ishlaydi"
      - "A, B, C: ro'yxatdan o'tgan tartibda"
      - "Faqat oxirgisi (C) ishlaydi"
    answer: 0
    explain: "Cleanup funksiyalari LIFO tartibida chaqiriladi, defer'ga o'xshab. Farqi: Cleanup test va uning barcha subtestlari (parallel bo'lganlari ham) tugagandan keyin ishlaydi, defer esa faqat o'z funksiyasi qaytganda. Shuning uchun parallel subtestlar ishlatadigan resursni defer bilan yopish xato."
  - q: "`go test -count=1 -race -shuffle=on ./...` buyrug'idagi `-count=1` nima uchun yozilgan?"
    options:
      - "Testlarni faqat bir marta chaqirish uchun; boshqa hech narsa o'zgarmaydi"
      - "Race detector'ni bitta goroutine bilan cheklash uchun"
      - "Parallellikni 1 ga tushirish uchun"
      - "Test natijalari keshini (test cache) chetlab o'tib, testni haqiqatan qayta ishga tushirish uchun"
    answer: 3
    explain: "Go o'zgarmagan paket va bir xil bayroqlar uchun muvaffaqiyatli test natijasini keshlaydi. -count=1 keshni o'chiradi (hujjatda keshni chetlab o'tishning idiomatik yo'li sifatida tavsiflangan). Parallellikni -parallel yoki GOMAXPROCS boshqaradi, -count emas."
task:
  title: "Yashirin chegara xatosini table-driven test bilan toping"
  prompt: |
    Quyida `Level` funksiyasi va uning uchta testi bor. Testlar o'tadi, lekin funksiya spetsifikatsiyaga to'liq mos emas: hujjat "20% dan kam - low" deydi, kod esa chegarada boshqacha ishlaydi.

    Vazifa: fayl nomini `level_test.go` qiling (alohida modulda, `go 1.24`). Uchta testni bitta table-driven `TestLevel`ga aylantiring: har qator uchun `t.Run`, parallel subtest, va xabar "nima chaqirildi, nima olindi, nima kutilgan" shaklida bo'lsin. Jadvalga chegara qiymatlarni (5% va 20%, to'la bak) hamda xato holatlarini (sig'im nol, manfiy litr, sig'imdan ko'p) qo'shing. Test topgan xatoni funksiyada tuzating.
  lang: go
  starter: |
    package level

    import (
        "errors"
        "testing"
    )

    // Level bak sig'imi va hozirgi litrga qarab holatni qaytaradi:
    // 5% dan kam - "empty", 20% dan kam - "low", aks holda "ok".
    func Level(liters, capacity float64) (string, error) {
        if capacity <= 0 || liters < 0 || liters > capacity {
            return "", errors.New("level: noto'g'ri qiymat")
        }
        pct := liters / capacity * 100
        switch {
        case pct < 5:
            return "empty", nil
        case pct <= 20:
            return "low", nil
        default:
            return "ok", nil
        }
    }

    func TestLevelEmpty(t *testing.T) {
        got, _ := Level(1, 100)
        if got != "empty" {
            t.Fatal("xato")
        }
    }

    func TestLevelLow(t *testing.T) {
        got, _ := Level(10, 100)
        if got != "low" {
            t.Fatal("xato")
        }
    }

    func TestLevelOK(t *testing.T) {
        got, _ := Level(50, 100)
        if got != "ok" {
            t.Fatal("xato")
        }
    }
  solution: |
    package level

    import (
        "errors"
        "testing"
    )

    // Level bak sig'imi va hozirgi litrga qarab holatni qaytaradi:
    // 5% dan kam - "empty", 20% dan kam - "low", aks holda "ok".
    func Level(liters, capacity float64) (string, error) {
        if capacity <= 0 || liters < 0 || liters > capacity {
            return "", errors.New("level: noto'g'ri qiymat")
        }
        pct := liters / capacity * 100
        switch {
        case pct < 5:
            return "empty", nil
        case pct < 20:
            return "low", nil
        default:
            return "ok", nil
        }
    }

    func TestLevel(t *testing.T) {
        tests := []struct {
            name     string
            liters   float64
            capacity float64
            want     string
            wantErr  bool
        }{
            {name: "bo'sh", liters: 1, capacity: 100, want: "empty"},
            {name: "5 foiz chegarasi", liters: 5, capacity: 100, want: "low"},
            {name: "past", liters: 10, capacity: 100, want: "low"},
            {name: "20 foiz chegarasi", liters: 20, capacity: 100, want: "ok"},
            {name: "yetarli", liters: 50, capacity: 100, want: "ok"},
            {name: "to'la bak", liters: 100, capacity: 100, want: "ok"},
            {name: "sig'im nol", liters: 1, capacity: 0, wantErr: true},
            {name: "manfiy litr", liters: -1, capacity: 100, wantErr: true},
            {name: "sig'imdan ko'p", liters: 101, capacity: 100, wantErr: true},
        }
        for _, tt := range tests {
            t.Run(tt.name, func(t *testing.T) {
                t.Parallel()
                got, err := Level(tt.liters, tt.capacity)
                if (err != nil) != tt.wantErr {
                    t.Fatalf("Level(%v, %v) xatosi = %v, xato kutilganmi: %v", tt.liters, tt.capacity, err, tt.wantErr)
                }
                if got != tt.want {
                    t.Errorf("Level(%v, %v) = %q, kutilgan %q", tt.liters, tt.capacity, got, tt.want)
                }
            })
        }
    }
  solutionNotes: |
    - Starter'dagi testlar faqat "o'rtadagi" qiymatlarni tekshiradi (1, 10, 50 litr), shuning uchun `pct <= 20` xatosi ko'rinmaydi. Chegara qiymatlar (5 va 20 foiz) shu xatolarni tutadi.
    - `Level(20, 100)` eski kodda `low` qaytaradi, spetsifikatsiya bo'yicha `ok` kerak. Testni funksiyani tuzatishdan oldin ishga tushirib, aniq `kutilgan "ok"` xabarini ko'rish kerak.
    - `t.Fatalf` xato holati noto'g'ri aniqlansa (keyingi tekshiruv ma'nosiz), `t.Errorf` esa qiymat farqi uchun ishlatilgan: shunda bitta qatorda ikkala muammo ham ko'rinadi.
    - Go 1.22 dan boshlab `tt := tt` shart emas; go.mod'dagi `go` qatori 1.22 yoki yuqori bo'lishi kerak.
    - `-race` bilan ishga tushirish parallel subtestlarda umumiy holat yo'qligini tasdiqlaydi.
  checklist:
    - "Uchta alohida test o'rniga bitta `TestLevel` va `t.Run` bilan subtestlar bor"
    - "Subtestlar `t.Parallel()` chaqiradi va `tt := tt` nusxasiz to'g'ri ishlaydi"
    - "Jadvalda 5% va 20% chegara qiymatlari hamda uchta xato holati bor"
    - "Xato xabari chaqirilgan argumentlarni, olingan va kutilgan qiymatni ko'rsatadi"
    - "`pct < 20` tuzatilgan va `go test -race` hamda `go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Testlar ko'pincha ikki xil sabab bilan foyda bermaydi. Birinchisi: ular yozilgan, lekin o'tkazib yuboradigan joyni tekshiradi. Kod qismi o'tadi, chegara qiymatlar, xato yo'llari va vaqt bilan bog'liq holatlar esa tekshirilmaydi. Ikkinchisi: test yiqilganda xabar nima bo'lganini aytmaydi, dasturchi 20 daqiqani testning o'zini tushunishga sarflaydi. Tajribali Node.js dasturchisi buni Jest'da ko'rgan: `describe`/`it`, `beforeEach`, `jest.mock`. Go'da bularning hech biri yo'q. Faqat standart `testing` paketi, oddiy funksiyalar va `go test` buyrug'i bor.

Bu soddalik kamchilik emas, lekin undan unumli foydalanish uchun paketning nimalarni berishini bilish kerak. Ko'p jamoalar `t.Run`, `t.Parallel` va `t.Cleanup` ning aniq semantikasini bilmaydi, shu sabab ular fixture'larni qo'lda yozadi, parallel testlarda umumiy holatdan race oladi va CI'da faqat ba'zan yiqiladigan (flaky) testlarga duch keladi. Bu dars `testing` paketining kundalik ishlatiladigan qismini aniq xatti-harakatlari bilan ko'rib chiqadi. Keyingi ikki dars (82 va 83) ustiga quriladi: fake'lar, `httptest` va fuzzing.

## Asosiy g'oya

### Test - oddiy funksiya

`go test` `_test.go` bilan tugaydigan fayllarni topadi va `func TestXxx(t *testing.T)` imzosiga mos funksiyalarni ishga tushiradi. Test `*testing.T` orqali natijani bildiradi: `t.Error`/`t.Errorf` testni yiqilgan deb belgilaydi va davom ettiradi, `t.Fatal`/`t.Fatalf` esa yiqilgan deb belgilab, funksiyani darhol to'xtatadi. Assertion kutubxonasi yo'q: shart oddiy `if`, xabar oddiy `Errorf`.

Code Review Comments "Useful Test Failures" bo'limida qoidani shunday beradi: test yiqilganda xabar nima chaqirilganini, nima olinganini va nima kutilganini aytishi kerak, odatda `YourFunc(%v) = %v, want %v` shaklida (biz kursda "kutilgan" deb yozamiz). Sababi amaliy: CI logida faqat shu bitta qator ko'rinadi.

### Table-driven test

Bir xil mantiqni turli kiritishlar bilan tekshirish uchun jadval ishlatiladi: anonim struct'lar slice'i, har qatorda nom, kirish va kutilgan natija. Siklda har qator `t.Run(name, func(t *testing.T) {...})` bilan subtest sifatida bajariladi. Subtest uchta narsa beradi:

- Mustaqil yiqilish: bitta qator `Fatalf` bilan to'xtasa, qolganlari ishlaydi.
- Nomlash: `go test -run 'TestParse/vergul'` bitta qatorni ajratib ishga tushiradi (`/` ierarxiyani bildiradi, nomdagi bo'shliqlar `_` ga almashtiriladi).
- Mustaqil hayot sikli: `t.Cleanup`, `t.TempDir`, `t.Setenv` har subtest uchun alohida.

Jadvalga yangi holat qo'shish bitta qator, shuning uchun jamoa regressiya topganda avval jadvalga qator qo'shadi, keyin kodni tuzatadi.

## Chuqurroq: testing paketining nozik joylari

### Fatal va Error: kim kimni to'xtatadi

`t.Fatalf` `runtime.Goexit` chaqiradi, ya'ni faqat test goroutine'ini to'xtatadi. Shu sababli uni testdan ochilgan boshqa goroutine ichida chaqirish noto'g'ri: Fatalf boshqa goroutine'ni to'xtatadi, testni emas. Bunday joyda `t.Errorf` ishlating va natijani kanal orqali asosiy testga qaytaring. Qoida: keyingi tekshiruv oldingisining muvaffaqiyatiga bog'liq bo'lsa (masalan, xato `nil` bo'lmasa, natijani tekshirish ma'nosiz) `Fatalf`; mustaqil tekshiruvlar uchun `Errorf`, shunda bir yurishda hamma muammo ko'rinadi.

### Parallellik va sikl o'zgaruvchisi

`t.Parallel()` subtestni to'xtatib turadi, ota test funksiyasi (sikl) tugagandan keyin parallel subtestlar birga davom etadi. Eski Go'da (go.mod'da `go 1.21` va past) closure bitta sikl o'zgaruvchisini ko'rar va hammasi oxirgi qatorni tekshirardi, shuning uchun `tt := tt` yozilardi. Go 1.22 dan sikl o'zgaruvchilari har iteratsiyada yangi, shuning uchun nusxa kerak emas. Bu xatti-harakat go.mod'dagi `go` qatoriga bog'liq (1-darsdagi compatibility mexanizmi), shuning uchun eski modulni yangi toolchain bilan qursangiz ham eski semantika saqlanadi.

Parallellikning narxi: parallel test umumiy holatga tegmasligi kerak. Global o'zgaruvchi, process environment, joriy katalog umumiy. Shu sababli `t.Setenv` va `t.Chdir` (Go 1.24 da qo'shilgan) parallel testlarda taqiqlangan va panic beradi (quyidagi misolda aniq xabar bor).

### Fixture'lar: Helper, Cleanup, TempDir, Setenv, Context

Go'da `beforeEach` o'rniga oddiy yordamchi funksiya va `t.Cleanup` bor.

- `t.Helper()` yordamchi funksiyaning birinchi qatorida chaqiriladi; xato joyi yordamchining ichi emas, uni chaqirgan qator deb ko'rsatiladi.
- `t.Cleanup(f)` testdan keyin chaqiriladigan funksiyani ro'yxatga oladi. Tartib LIFO, va `defer`dan farqli ravishda test hamda uning barcha subtestlari (parallel bo'lganlar ham) tugagandan keyin ishlaydi. Yordamchi funksiya resursni ochib, yopishni o'zi ro'yxatga olishi mumkin: chaqiruvchi hech narsani esdan chiqarmaydi.
- `t.TempDir()` testga tegishli vaqtinchalik katalog yaratadi va test tugagach o'chiradi. Har chaqiruv yangi katalog beradi.
- `t.Setenv(k, v)` o'zgaruvchini o'rnatadi va test tugagach oldingi qiymatni tiklaydi.
- `t.Context()` (Go 1.24 dan) test tugashidan sal oldin, Cleanup funksiyalari chaqirilishidan avval bekor qilinadigan context beradi. Testdan goroutine ishga tushirsangiz, uni shu context bilan to'xtatish mumkin; bu goroutine sizib ketishining oldini oladi.

### TestMain va testning global holati

Paket darajasida bitta sozlash kerak bo'lsa (masalan, test ma'lumotlar bazasini ko'tarish), `func TestMain(m *testing.M)` yoziladi: u `m.Run()` ni chaqiradi va natija kodi bilan `os.Exit` qiladi. Bu og'ir vosita: TestMain'dagi holat hamma testlar uchun umumiy, shuning uchun testlarni bir-biriga bog'laydi. Avval `t.Cleanup` bilan yordamchi yozing, TestMain'ni faqat yagona qimmat resurs uchun qoldiring.

### go test bayroqlari

100 Go Mistakes testing rejimlariga e'tibor beradi: ko'p jamoa `-race` va `-shuffle` ni umuman ishlatmaydi. Amaliy to'plam:

| Bayroq | Nima qiladi |
|---|---|
| `-race` | Data race detector'ni yoqadi (dastur sezilarli sekinlashadi, lekin CI uchun mos) |
| `-shuffle=on` | Testlar tartibini aralashtiradi, ishlatilgan seed'ni chiqaradi; bir-biriga yashirin bog'liq testlarni topadi |
| `-count=1` | Test keshini chetlab o'tadi; `-count=N` testni N marta takrorlaydi (flaky testni qidirishda foydali) |
| `-run`, `-skip` | Test nomi bo'yicha regex bilan tanlash yoki o'tkazib yuborish; `/` subtestlar ierarxiyasini ajratadi |
| `-cover` | Qamrov foizi |
| `-failfast` | Birinchi yiqilishdan keyin to'xtash |
| `-short` | `testing.Short()` true bo'ladi: uzun testlarni `if testing.Short() { t.Skip() }` bilan o'tkazib yuborish uchun |

Qamrov foizi sifat o'lchovi emas: 100% qamrov chegara qiymatlarni tekshirganini bildirmaydi. Bu darsning topshirig'i aynan shuni ko'rsatadi.

## Misol: yoqilg'i datchigi qatorlarini tahlil qilish

Avtopark monitoring platformasida datchik "T-104,42.5" ko'rinishidagi qator yuboradi (qurilma, litr). `fuel` paketi:

```go
// Package fuel - yoqilg'i datchigi o'qishlarini tahlil qiladi.
package fuel

import (
	"errors"
	"fmt"
	"os"
	"strconv"
	"strings"
)

// Reading - bitta datchik o'qishi.
type Reading struct {
	Device string
	Liters float64
}

// ErrFormat - qator "qurilma,litr" ko'rinishida emas.
var ErrFormat = errors.New("fuel: noto'g'ri format")

// Parse "T-104,42.5" ko'rinishidagi qatorni Reading'ga aylantiradi.
func Parse(line string) (Reading, error) {
	dev, val, ok := strings.Cut(line, ",")
	if !ok || strings.TrimSpace(dev) == "" {
		return Reading{}, fmt.Errorf("%w: %q", ErrFormat, line)
	}
	l, err := strconv.ParseFloat(strings.TrimSpace(val), 64)
	if err != nil || l < 0 {
		return Reading{}, fmt.Errorf("%w: litr %q", ErrFormat, val)
	}
	return Reading{Device: strings.TrimSpace(dev), Liters: l}, nil
}

// LoadThreshold FUEL_ALERT_FILE faylidan ogohlantirish chegarasini (litr) o'qiydi.
func LoadThreshold() (float64, error) {
	path := os.Getenv("FUEL_ALERT_FILE")
	if path == "" {
		return 10, nil
	}
	b, err := os.ReadFile(path)
	if err != nil {
		return 0, err
	}
	return strconv.ParseFloat(strings.TrimSpace(string(b)), 64)
}
```

Endi testlar. `TestParse` jadvalli, parallel subtestlar bilan; `TestLoadThreshold` `t.Setenv`, `t.TempDir` va `t.Helper` ishlatadi; oxirgi test `t.Cleanup` va `t.Context` ni ko'rsatadi:

```go
package fuel

import (
	"errors"
	"os"
	"path/filepath"
	"testing"
)

func TestParse(t *testing.T) {
	tests := []struct {
		name    string
		line    string
		want    Reading
		wantErr error
	}{
		{name: "oddiy", line: "T-104,42.5", want: Reading{"T-104", 42.5}},
		{name: "bo'shliqlar", line: " T-104 , 7 ", want: Reading{"T-104", 7}},
		{name: "nol litr", line: "T-104,0", want: Reading{"T-104", 0}},
		{name: "vergul yo'q", line: "T-104", wantErr: ErrFormat},
		{name: "qurilma bo'sh", line: ",12", wantErr: ErrFormat},
		{name: "manfiy", line: "T-104,-1", wantErr: ErrFormat},
		{name: "son emas", line: "T-104,abc", wantErr: ErrFormat},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()
			got, err := Parse(tt.line)
			if !errors.Is(err, tt.wantErr) {
				t.Fatalf("Parse(%q) xatosi = %v, kutilgan %v", tt.line, err, tt.wantErr)
			}
			if got != tt.want {
				t.Errorf("Parse(%q) = %+v, kutilgan %+v", tt.line, got, tt.want)
			}
		})
	}
}

// writeFile - yordamchi: xato t.Helper tufayli chaqiruvchi qatorida ko'rsatiladi.
func writeFile(t *testing.T, content string) string {
	t.Helper()
	path := filepath.Join(t.TempDir(), "threshold.txt")
	if err := os.WriteFile(path, []byte(content), 0o600); err != nil {
		t.Fatal(err)
	}
	return path
}

func TestLoadThreshold(t *testing.T) {
	t.Run("default", func(t *testing.T) {
		t.Setenv("FUEL_ALERT_FILE", "")
		got, err := LoadThreshold()
		if err != nil || got != 10 {
			t.Fatalf("LoadThreshold() = %v, %v; kutilgan 10, nil", got, err)
		}
	})
	t.Run("fayldan", func(t *testing.T) {
		t.Setenv("FUEL_ALERT_FILE", writeFile(t, "25.5\n"))
		got, err := LoadThreshold()
		if err != nil || got != 25.5 {
			t.Fatalf("LoadThreshold() = %v, %v; kutilgan 25.5, nil", got, err)
		}
	})
	t.Run("fayl yo'q", func(t *testing.T) {
		t.Setenv("FUEL_ALERT_FILE", filepath.Join(t.TempDir(), "yoq.txt"))
		if _, err := LoadThreshold(); !errors.Is(err, os.ErrNotExist) {
			t.Fatalf("xato = %v, kutilgan os.ErrNotExist", err)
		}
	})
}

func TestCleanupVaContext(t *testing.T) {
	t.Cleanup(func() { t.Log("cleanup: oxirgi bo'lib ishlaydi") })
	go func() {
		<-t.Context().Done()
	}()
	t.Log("context test tugagach bekor qilinadi")
}
```

Natija (`go test -race -cover`, Go 1.24.7, linux/amd64):

```text
ok  	lesson81/fuel	1.020s	coverage: 100.0% of statements
```

Nima uchun shunday qaror qilindi:

- `wantErr` maydoni `error` tipida va `errors.Is` bilan solishtiriladi. Xato matni emas, sentinel xato tekshiriladi: xabar o'zgarsa test sinmaydi.
- `writeFile` yordamchisi `t.Helper()` chaqiradi va yaratilgan faylni `t.TempDir()` ichiga qo'yadi. Tozalash haqida o'ylash shart emas.
- "fayl yo'q" holati uchun `TempDir` ichidagi mavjud bo'lmagan yo'l olingan: bu platformaga bog'liq bo'lmagan ishonchli usul.
- `t.Setenv` chaqirilgani uchun `TestLoadThreshold` va uning subtestlarida `t.Parallel()` yo'q. Bu ongli tanlov.

Test yiqilganda xabar shunday ko'rinadi (kutilgan qiymatni qasddan `42` ga o'zgartirib sinab ko'rdik):

```text
--- FAIL: TestParse (0.00s)
    --- FAIL: TestParse/oddiy (0.00s)
        fuel_test.go:33: Parse("T-104,42.5") = {Device:T-104 Liters:42.5}, kutilgan {Device:T-104 Liters:42}
FAIL
```

Qatorda chaqirilgan argument, olingan va kutilgan qiymat bor: logdan boshqa hech narsa ochmay muammo tushunarli. Va yuqorida aytilgan cheklov, `t.Setenv` ni `t.Parallel` bilan birga ishlatganda:

```text
--- FAIL: TestPanic (0.00s)
panic: testing: test using t.Setenv or t.Chdir can not use t.Parallel [recovered]
```

Test yiqiladi va shu paketdagi qolgan testlar ham to'xtaydi, chunki bu panic.

## Qachon qo'llamaslik kerak

- Table-driven shakl hamma narsa uchun emas. Qatorlar orasida ketma-ket bog'liqlik bo'lsa (bir qadamning natijasi keyingisiga kirish bo'ladi), jadval sun'iy bo'ladi. Oddiy ketma-ket test o'qishga qulayroq.
- Jadvalda shartli mantiq (`if tt.mode == ...`) paydo bo'lsa, jadval ortiqcha murakkab: testni ikkiga bo'ling.
- `t.Parallel()` har testga qo'yilmaydi. Tez testlarni parallel qilish goroutine boshqaruv narxini tejashdan ko'proq sarflashi mumkin, umumiy holat bilan ishlaydigan testlarda esa race hosil qiladi. Parallelni sekin, mustaqil testlarga qo'ying.
- `TestMain` ga ortiqcha yuk ortmang: undagi global holat testlarni bir-biriga bog'laydi va `-shuffle` bilan topiladigan yashirin bog'liqliklarni yaratadi.
- Qamrov foizini maqsadga aylantirmang. Muhim chegaralarni tekshiradigan 70% qamrov, hamma qatorga tegib hech narsani tasdiqlamaydigan 100% dan foydali.
- `reflect.DeepEqual` murakkab struct'larni solishtirishda yiqilish sababini ko'rsatmaydi va bo'sh slice bilan `nil` slice'ni farqlaydi. Standart kutubxonada farqni chiroyli ko'rsatadigan vosita yo'q; bu holatda maydonlarni alohida solishtiring yoki tashqi kutubxona (masalan go-cmp) ishlatiladi. Biz uni bu kursda ishlatmaymiz.

## Stack'da: Jest bilan farq

Jest'da `describe`/`it` ierarxiyasi, `beforeEach`/`afterEach` va `expect(...).toEqual(...)` bor. Go'dagi muqobil: subtest ierarxiyasi `t.Run` bilan, fixture `t.Cleanup` bilan, assertion `if` va `Errorf` bilan. Jest testlarni fayl darajasida parallel ishga tushiradi (worker process'lar bilan), Go esa bitta paketdagi testlarni ketma-ket ishlatadi va faqat `t.Parallel()` chaqirganlarini birga bajaradi; turli paketlar esa alohida process'larda parallel ishlaydi. `jest.mock` modulni almashtiradi, Go'da bunday mexanizm yo'q: bog'liqliklar interface orqali beriladi (82-dars). TypeScript'dagi snapshot testlarga eng yaqini - `testdata/` katalogidagi golden fayllar: `go test` `testdata` nomli katalogni paket ro'yxatidan chiqarib tashlaydi va test ma'lumotlarini saqlash uchun ishlatiladi (fuzzing korpusi ham shu yerda, 83-dars).

Servis jamoasi uchun minimal CI buyrug'i: `go vet ./... && go test -race -shuffle=on -count=1 ./...`. Uzoq integratsiya testlari `-short` bilan ajratiladi yoki build tag orqali alohida ishga tushiriladi.

## Xulosa

- Test - oddiy funksiya; xabar chaqirilgan argumentni, olingan va kutilgan qiymatni ko'rsatishi kerak.
- Table-driven test + `t.Run`: mustaqil yiqilish, nom bo'yicha tanlash, yangi holat qo'shish bitta qator.
- `t.Parallel()` faqat umumiy holatsiz testlarga; `t.Setenv` va `t.Chdir` parallel testda panic beradi. Go 1.22 dan `tt := tt` kerak emas.
- Fixture'lar: `t.Helper`, `t.Cleanup` (LIFO, subtestlar tugagandan keyin), `t.TempDir`, `t.Context` (Go 1.24).
- CI'da `-race`, `-shuffle=on` va `-count=1` ishlating; qamrov foizi sifat kafolati emas, chegara qiymatlarni jadvalga yozing.
