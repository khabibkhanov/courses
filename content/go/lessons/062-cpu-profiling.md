---
n: 62
slug: cpu-profiling
title: "CPU profiling: pprof"
summary: "CPU profil qanday ishlaydi (sampling), uni testdan, kod ichidan va net/http/pprof orqali qanday olish kerak, flat va cum ustunlarini, top, list, peek va focus buyruqlarini qanday o'qish, profil nimani ko'rsatmasligi va pprof endpoint'ini xavfsiz ochish."
duration: 40
sources:
  - id: blog-pprof
    note: "Profiling Go Programs: CPU profil olish, go tool pprof buyruqlari (top, list, web) va optimizatsiya jarayoni misoli"
  - id: diagnostics
    note: "Profiling bo'limi: cpu profil ta'rifi, production'da profillash va profillar bir-biriga xalaqit berishi haqida eslatma"
  - id: pkg-http-pprof
    note: "Paket hujjati: import qilishning yon ta'siri, /debug/pprof/ yo'llari, seconds va debug parametrlari, Go 1.22 dan GET talabi"
  - id: go126
    note: "Pprof bo'limi: web UI (-http) endi flame graph ko'rinishini standart ochadi"
  - id: go127
    note: "Runtime bo'limi: go 1.27 va undan yuqori modullarda traceback sarlavhasiga pprof goroutine label'lari qo'shiladi (tracebacklabels GODEBUG)"
quiz:
  - q: "Profilda `main.report` uchun flat 0.01s, cum 1.09s ko'rsatilgan, `runtime.memmove` uchun flat 0.75s. Bu nimani anglatadi?"
    options:
      - "report ichidagi tsiklning o'zi sekin, uni qayta yozish kerak"
      - "memmove xato ishlayapti va uni Go'ning o'zi tuzatishi kerak"
      - "report va memmove bir xil funksiya, ustunlar faqat formatda farq qiladi"
      - "report deyarli o'zi hisoblamaydi, vaqt u chaqirgan funksiyalarda ketadi; memmove esa bevosita ko'p CPU yeydi, sabab uni chaqirayotganlarda (peek/list bilan) qidiriladi"
    answer: 3
    explain: "flat - funksiyaning o'z kodida, cum - u chaqirgan funksiyalar bilan birga sarflangan vaqt. Katta cum va kichik flat funksiya vaqtni boshqalarga 'uzatadi'. Haqiqiy sabab flat yuqori turgan joyda emas, uni chaqirgan zanjirda: bu yerda `out += ...` har safar satrni qayta nusxalaydi."
  - q: "Handler 200 ms davomida PostgreSQL javobini kutdi, CPU'ni deyarli ishlatmadi. CPU profil bu kutishni qanday ko'rsatadi?"
    options:
      - "Kutish qismi ham namunalarga kiradi, chunki goroutine tirik"
      - "Ko'rsatmaydi: CPU profil faqat CPU faol sarflangan vaqtni namuna qiladi, kutish uchun trace yoki block/mutex profil kerak"
      - "Faqat network poller stack'larida ko'rinadi"
      - "Faqat -seconds 30 dan katta qiymat berilganda ko'rinadi"
    answer: 1
    explain: "Diagnostika hujjati CPU profilni 'dastur CPU tsikllarini faol sarflayotgan vaqt, uyqu yoki I/O kutishdan farqli o'laroq' deb ta'riflaydi. Kutishni ko'rish uchun execution trace (64-dars) yoki block/mutex profillari (63-dars) kerak."
  - q: "Servis `import _ \"net/http/pprof\"` qiladi va tashqi portda `http.ListenAndServe(\":8080\", nil)` ishga tushiradi. Nima bo'ladi?"
    options:
      - "pprof faqat localhost'dan javob beradi"
      - "Hech narsa, chunki `nil` handler pprof yo'llarini o'z ichiga olmaydi"
      - "/debug/pprof/ yo'llari DefaultServeMux'da ro'yxatdan o'tadi va tashqi portda ochiq bo'ladi"
      - "Servis kompilyatsiya bo'lmaydi: bo'sh import faqat testlarda ruxsat etilgan"
    answer: 2
    explain: "Paket faqat yon ta'siri uchun import qilinadi: u o'z handler'larini DefaultServeMux'ga qo'shadi. nil handler bilan ListenAndServe aynan DefaultServeMux'dan foydalanadi, demak profil endpoint'i hammaga ochiladi. Yechim: alohida mux va faqat ichki interfeysdagi port."
  - q: "30 soniyalik CPU profilni ochdingiz: `Duration: 30s, Total samples = 90ms`. Eng to'g'ri harakat qaysi?"
    options:
      - "Eng ko'p flat'li funksiyani darhol optimallashtirish"
      - "Bu profil xulosa uchun yetarli emas: dastur deyarli bo'sh turgan. Yuklama ostida yoki yuklama testi bilan qayta olish kerak"
      - "Profilni 10 marta bir-biriga ulash, shunda namunalar ko'payadi"
      - "-nodecount ni oshirish"
    answer: 1
    explain: "CPU profil standart 100 Hz chastotada namuna oladi, ya'ni 30 soniyada bitta to'liq band yadro 3000 ga yaqin namuna beradi. 90 ms bu atigi bir necha namuna: dastur o'sha vaqtda deyarli ish qilmagan. Bunday profildagi tartib shovqin. Dastur ish bilan band paytda olingan profil kerak."
  - q: "`go tool pprof -base eski.pprof yangi.pprof` nima beradi?"
    options:
      - "Yangi profil ostiga eski profilning stack'larini qo'shadi"
      - "Ikki profilni bitta fayl qilib birlashtiradi"
      - "Profillarni solishtirmaydi, faqat ikkinchisini ochadi"
      - "Yangi profildan eski profilni ayiradi: manfiy qiymatlar yo'qolgan sarf, musbatlar yangi sarf"
    answer: 3
    explain: "-base ko'rsatilgan profilni ayirish uchun asos qiladi. Lokal tajribada memmove -750ms ko'rsatdi, ya'ni o'zgarishdan keyin shuncha CPU vaqti kamaygan. Birlashtirish uchun profillar bir nechta fayl sifatida beriladi va -proto bilan saqlanadi (PGO, 67-dars)."
  - q: "Handler'lar `pprof.Do(ctx, pprof.Labels(\"endpoint\", ep), fn)` ichida ishlaydi. Bu qanday foyda beradi?"
    options:
      - "CPU namunalari endpoint yorlig'i bilan belgilanadi va `-tagfocus` yoki `-tags` bilan endpoint bo'yicha ajratib ko'riladi"
      - "Handler tezroq ishlaydi, chunki scheduler unga ustuvorlik beradi"
      - "Goroutine'lar ro'yxati avtomatik log'ga yoziladi"
      - "Profil endpoint'ga tegishli bo'lmagan namunalarni o'chirib tashlaydi"
    answer: 0
    explain: "Label'lar profil namunalariga biriktiriladi. Lokal tajribada `-tags` ikki endpoint orasida CPU taqsimotini (85% va 15%) ko'rsatdi, `-tagfocus=endpoint=/health` esa faqat shu endpoint stack'larini qoldirdi. Scheduler'ga ta'sir qilmaydi."
  - q: "Profil `runtime.mallocgc`, `runtime.gcBgMarkWorker` va `runtime.memmove` ni yuqorida ko'rsatmoqda. Birinchi gumon qayerga tushadi?"
    options:
      - "Compiler xatosi"
      - "Tarmoq kutubxonasi"
      - "Allocation va nusxalash: kodda ko'p vaqtinchalik obyekt yoki katta ma'lumotni qayta nusxalash bor"
      - "Scheduler sozlamasi"
    answer: 2
    explain: "mallocgc va GC worker allocation intensivligini, memmove ko'p nusxalashni ko'rsatadi. Kod darajasidagi sababni peek/list bilan chaqiruvchi funksiyalarda topasiz, so'ng heap/allocs profili (63-dars) bilan tasdiqlaysiz. Boshqa variantlar bunday stack'dan kelib chiqmaydi."
task:
  title: "pprof endpoint'ini alohida admin mux'ga ko'chirish"
  prompt: |
    Servis `net/http/pprof` ni bo'sh import bilan ulaydi va `publicMux()` `http.DefaultServeMux` ni qaytaradi, natijada `/debug/pprof/` tashqi portda ham ochiq (starter'ni ishga tushirib, `public /debug/pprof/: 200` qatorini ko'ring).

    `publicMux()` va `adminMux()` ni qayta yozing: public mux faqat `/health` ni xizmat qilsin va `DefaultServeMux`dan foydalanmasin; admin mux esa pprof handler'larini (`Index`, `Cmdline`, `Profile`, `Symbol`, `Trace`) aniq ro'yxatdan o'tkazsin. Kutilgan natija: public mux `/debug/pprof/` uchun 404, admin mux esa 200 qaytaradi. `status` va `main` o'zgarmasin.
  lang: go
  starter: |
    package main

    import (
        "fmt"
        "net/http"
        "net/http/httptest"
        _ "net/http/pprof"
    )

    // publicMux tashqi mijozlarga xizmat qiladi.
    func publicMux() http.Handler {
        http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
            fmt.Fprint(w, "ok")
        })
        return http.DefaultServeMux
    }

    // adminMux faqat ichki (localhost) portda ishlaydi.
    func adminMux() http.Handler {
        return http.NewServeMux()
    }

    func status(h http.Handler, path string) int {
        rec := httptest.NewRecorder()
        h.ServeHTTP(rec, httptest.NewRequest(http.MethodGet, path, nil))
        return rec.Code
    }

    func main() {
        pub, adm := publicMux(), adminMux()
        fmt.Println("public /health:", status(pub, "/health"))
        fmt.Println("public /debug/pprof/:", status(pub, "/debug/pprof/"))
        fmt.Println("admin  /debug/pprof/:", status(adm, "/debug/pprof/"))
        fmt.Println("admin  /debug/pprof/heap:", status(adm, "/debug/pprof/heap"))
    }
  solution: |
    package main

    import (
        "fmt"
        "net/http"
        "net/http/httptest"
        "net/http/pprof"
    )

    // publicMux tashqi mijozlarga xizmat qiladi. DefaultServeMux ishlatilmaydi.
    func publicMux() http.Handler {
        mux := http.NewServeMux()
        mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
            fmt.Fprint(w, "ok")
        })
        return mux
    }

    // adminMux faqat ichki (localhost) portda ishlaydi.
    func adminMux() http.Handler {
        mux := http.NewServeMux()
        mux.HandleFunc("/debug/pprof/", pprof.Index)
        mux.HandleFunc("/debug/pprof/cmdline", pprof.Cmdline)
        mux.HandleFunc("/debug/pprof/profile", pprof.Profile)
        mux.HandleFunc("/debug/pprof/symbol", pprof.Symbol)
        mux.HandleFunc("/debug/pprof/trace", pprof.Trace)
        return mux
    }

    func status(h http.Handler, path string) int {
        rec := httptest.NewRecorder()
        h.ServeHTTP(rec, httptest.NewRequest(http.MethodGet, path, nil))
        return rec.Code
    }

    func main() {
        pub, adm := publicMux(), adminMux()
        fmt.Println("public /health:", status(pub, "/health"))
        fmt.Println("public /debug/pprof/:", status(pub, "/debug/pprof/"))
        fmt.Println("admin  /debug/pprof/:", status(adm, "/debug/pprof/"))
        fmt.Println("admin  /debug/pprof/heap:", status(adm, "/debug/pprof/heap"))
    }
  solutionNotes: |
    - `_ "net/http/pprof"` importi handler'larni `DefaultServeMux`ga qo'shadi. `DefaultServeMux`ni tashqi portda ishlatsangiz, profil ham ochiq bo'ladi. Yechim `http.NewServeMux()` va aniq import (`"net/http/pprof"`).
    - `pprof.Index` `/debug/pprof/` va nomli profillar (`/debug/pprof/heap`, `goroutine` va boshqalar) uchun ishlaydi, `Profile`, `Symbol`, `Trace`, `Cmdline` alohida yo'llar talab qiladi.
    - Production'da admin mux alohida `http.Server` bilan faqat `127.0.0.1` yoki ichki tarmoq interfeysida tinglanadi; kerak bo'lsa, autentifikatsiya qo'shiladi.
    - Go 1.22 dan boshlab pprof yo'llari faqat GET bilan so'raladi (paket hujjati).
  checklist:
    - "Public mux `/health` uchun 200, `/debug/pprof/` uchun 404 qaytaradi"
    - "Admin mux `/debug/pprof/` va `/debug/pprof/heap` uchun 200 qaytaradi"
    - "`http.DefaultServeMux` public yo'lda ishlatilmaydi"
    - "pprof handler'lari admin mux'ga aniq ro'yxatdan o'tkazilgan"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Servis CPU'ning 80% ini yeydi, lekin sabab noma'lum. Jamoa taxminlar qiladi: "JSON sekin", "regex ayb", "GC ko'p". Har bir taxmin kodni qayta yozishga olib keladi, natija esa o'zgarmaydi. Chunki dasturning vaqti ko'pincha bizning tasavvurimizdagi joyda ketmaydi. Odatiy hol: eng "qimmat ko'ringan" funksiya yuklamaning 2% ini tashkil qiladi, haqiqiy sabab esa log qatori yasaydigan zerikarli yordamchi funksiyada yashirin.

CPU profil bu savolga o'lchov bilan javob beradi: dastur vaqtining qaysi ulushi qaysi stack'da o'tgan. Go'da bu vosita runtime ichiga o'rnatilgan, formati standartlashgan (pprof), ko'rish vositasi toolchain bilan birga keladi (`go tool pprof`). Node.js'da `--cpu-prof` yoki DevTools profiler tanish bo'lsa, g'oya bir xil. Farq shundaki, Go profili production'da xavfsiz va arzon yig'ish uchun mo'ljallangan: bitta HTTP so'rov bilan jonli servisdan olinadi.

Bu dars profilni olish, o'qish va talqin qilishni ko'radi. Xotira va bloklanish profillari 63-darsda, execution trace 64-darsda.

## Asosiy g'oya

### Profil nima

CPU profil - sampling profiler. Dastur ishlayotganda runtime davriy ravishda (standart 100 Hz, ya'ni sekundiga 100 marta; bu qiymat `runtime/pprof` manba kodida konstanta sifatida belgilangan) ishlayotgan goroutine'larning stack'ini yozib oladi. Har bir yozuv "shu stack'da shu lahzada CPU sarflanayotgan edi" degan bitta namuna. Namunalar yig'ilgach, funksiyalar bo'yicha sanaladi. Ko'p namuna chiqqan funksiya ko'p CPU sarflagan.

Bundan uch muhim xulosa kelib chiqadi. Birinchisi, bu statistik baho, aniq o'lchov emas: kam namunada tartib shovqin bo'ladi. Ikkinchisi, profil faqat CPU'da bajarilayotgan kodni ko'rsatadi. Diagnostics hujjati CPU profilni "dastur CPU tsikllarini faol sarflayotgan vaqt, uyqu yoki I/O kutishdan farqli o'laroq" deb ta'riflaydi. Goroutine PostgreSQL javobini kutayotgan 200 ms CPU profilda ko'rinmaydi. Uchinchisi, profilning o'zi ham xarajat qo'shadi: hujjat production'da profillash xavfsiz ekanini, lekin CPU profilni yoqish xarajat qo'shishini va uni oldindan o'lchash kerakligini aytadi.

### Profilni qanday olish

Uch yo'l bor:

1. Testdan: `go test -bench X -cpuprofile cpu.out`. Fayl bilan birga test binary'si (`pkg.test`) qoladi, `go tool pprof` ikkalasini ham so'raydi. Bu eng aniq yo'l, chunki benchmark takrorlanadi va namunalar ko'p bo'ladi (61-dars).
2. Kod ichidan: `pprof.StartCPUProfile(f)` va `defer pprof.StopCPUProfile()`. Qisqa umrli dasturlar (CLI, migratsiya) uchun.
3. Jonli servisdan: `net/http/pprof` paketini import qilib, `/debug/pprof/profile?seconds=30` yo'liga GET so'rov yuborish. Paket hujjatiga ko'ra `go tool pprof http://localhost:6060/debug/pprof/profile?seconds=30` buyrug'i profilni yuklab, darhol ochadi. Hujjat shuningdek `/debug/pprof/` sahifasida barcha mavjud profillar ro'yxatini ko'rsatishini yozadi.

Blog'dagi "Profiling Go Programs" maqolasi ham shu oqimni tasvirlaydi: profil yig', `top` bilan eng ko'p sarflovchilarni ko'r, `list` bilan qatorlarga tush, o'zgartir, qayta o'lcha.

### Profilni o'qish: flat va cum

`go tool pprof -top` jadvali ikki asosiy ustunga ega:

- **flat** - funksiyaning o'z kodida (u chaqirgan funksiyalarsiz) sarflangan vaqt.
- **cum** (cumulative) - funksiya va u chaqirgan hamma narsa uchun jami vaqt.

Yuqori flat: bevosita CPU yeyayotgan joy. Yuqori cum, past flat: funksiya o'zi hisoblamaydi, vaqt uning ostida ketayapti. `main.main` har doim cum bo'yicha tepada turadi va bu ma'lumot bermaydi. Qiziq joylar: flat yuqori yaprak funksiyalar va cum yuqori, lekin "o'zimizniki" bo'lgan zanjirning o'rta qismi.

Asosiy buyruqlar: `top` (flat bo'yicha), `top -cum`, `list <regexp>` (manba qatorlari bo'yicha taqsimot), `peek <regexp>` (kim chaqirgan va kimni chaqirgan), `-focus`/`-ignore` (stack'ni filtrlash), `-http=:8080` (brauzerdagi UI; Go 1.26 release notes'ga ko'ra pprof web UI endi standart holatda flame graph ko'rinishini ochadi, eski graph ko'rinishi View menyusida qoladi).

## Chuqurroq: talqin qilish tuzoqlari

### Runtime funksiyalari nimani bildiradi

Profilda `runtime.mallocgc`, `runtime.gcBgMarkWorker`, `runtime.memmove`, `runtime.futex`, `runtime.madvise` ko'rinsa, bu "runtime sekin" degani emas, bu sizning kodingiz runtime'ni qattiq ishlatayotganini bildiradi. `mallocgc` va GC worker'lari allocation intensivligini, `memmove` ko'p nusxalashni ko'rsatadi. Sabab runtime funksiyasida emas, uni chaqirgan zanjirda: `peek runtime.memmove` chaqiruvchini ko'rsatadi, `list` esa aniq qatorni.

### Inlining va "(inline)" belgisi

Compiler kichik funksiyalarni chaqiruvchi ichiga qo'shib yuboradi (58-dars). pprof inline qilingan kadrlarni baribir alohida ko'rsatadi va ularni `(inline)` bilan belgilaydi (masalan `math.xatan (inline)`). Shuning uchun kod strukturasi va profil chiziqlari mos tushadi, lekin binary'da bunday chaqiruv yo'q.

### Namuna soni va davomiylik

Profil sarlavhasida `Duration` va `Total samples` ko'rsatiladi. Bir nechta yadroda bajarilsa, `Total samples` davomiylikdan oshishi mumkin (lokal tajribada 107% va 165% chiqdi). Namunalar kam bo'lsa (bir necha o'n millisekund), tartib shovqin, shuning uchun profilni yuklama ostida oling. Servisni profil uchun sun'iy "isitish" kerak bo'lsa, yuklama testidan foydalaning, lekin real so'rovlar aralashmasi bilan.

### Label'lar

`pprof.Do(ctx, pprof.Labels("endpoint", ep), fn)` fn ichida ishlaydigan goroutine'larning namunalariga yorliq yopishtiradi. Keyin `go tool pprof -tags` yorliqlar bo'yicha taqsimotni, `-tagfocus=endpoint=/health` esa bitta qiymat bo'yicha filtrni beradi. Bu bitta jarayondagi turli endpoint'larni ajratishning eng sodda yo'li. Go 1.27 release notes'ga ko'ra, go.mod'da `go 1.27` yoki undan yuqori bo'lgan modullarda traceback sarlavhasiga ham shu goroutine label'lari qo'shiladi (`tracebacklabels=0` GODEBUG bilan o'chiriladi). Label'larga maxfiy ma'lumot yozmang.

### Ikki profilni solishtirish

`go tool pprof -base eski.pprof yangi.pprof` ikkinchi profildan birinchisini ayiradi. Manfiy qiymat: o'zgarishdan keyin yo'qolgan sarf; musbat: yangi sarf. Bu "tuzatish ishladimi?" degan savolga eng aniq javob. Ikki profilni bir xil davomiylikda va o'xshash yuklamada olish shart, aks holda ayirma ma'nosiz.

## Misol: satr yig'ish va haversine

Dastur 40 ta trek yaratadi (har biri 100 000 GPS nuqtasi), umumiy masofani haversine formulasi bilan hisoblaydi va har trekning dastlabki 3000 nuqtasi uchun matnli hisobot yasaydi. Hisobot ataylab sodda yozilgan:

```go
// report har nuqta uchun satr yasaydi (ataylab samarasiz).
func report(pts []Point) string {
	var out string
	for i, p := range pts {
		out += fmt.Sprintf("%d:%.5f,%.5f;", i, p.Lat, p.Lon)
	}
	return out
}
```

Dastur `pprof.StartCPUProfile` bilan `cpu.pprof` faylini yozadi. Go 1.24.7, linux/amd64, 2 vCPU (shared VM). Profil `go tool pprof -top -cum` bilan:

```text
Duration: 2.24s, Total samples = 2.15s (96.18%)
      flat  flat%   sum%        cum   cum%
         0     0%     0%      1.47s 68.37%  main.main
         0     0%     0%      1.47s 68.37%  runtime.main
         0     0%     0%      1.09s 50.70%  main.report
         0     0%     0%      0.90s 41.86%  runtime.concatstring2
         0     0%     0%      0.90s 41.86%  runtime.concatstrings
     0.75s 34.88% 34.88%      0.75s 34.88%  runtime.memmove
         0     0% 34.88%      0.42s 19.53%  runtime.systemstack
         0     0% 34.88%      0.41s 19.07%  runtime.bgsweep
     0.01s  0.47% 35.35%      0.32s 14.88%  main.haversine
```

Haversine hisoblash (`main.haversine`) atigi 14.9% cum, `main.report` esa 50.7%. Flat bo'yicha birinchi o'rinda `runtime.memmove` (34.9%): kimdir juda ko'p nusxalayapti. `list main.report` (yo'l qisqartirilgan) aniq qatorni ko'rsatadi:

```text
      .      1.09s (flat, cum) 50.70% of Total
      .          .     52:func report(pts []Point) string {
      .          .     53:	var out string
      .          .     54:	for i, p := range pts {
      .      1.09s     55:		out += fmt.Sprintf("%d:%.5f,%.5f;", i, p.Lat, p.Lon)
      .          .     56:	}
```

Sabab: `out += ...` har iteratsiyada butun satrni yangi xotiraga ko'chiradi, ya'ni umumiy ish kvadratik o'sadi. Kuchli taxmin "haversine'dagi trigonometriya" bo'lardi, lekin profil boshqa joyni ko'rsatdi. Tuzatish: `strings.Builder` va `fmt.Fprintf(&sb, ...)`. Bir xil natija (hisobot uzunligi `67890`) bilan qayta o'lchash:

```text
Duration: 939.56ms, Total samples = 510ms (54.28%)
      flat  flat%   sum%        cum   cum%
     120ms 23.53% 23.53%      120ms 23.53%  runtime.asyncPreempt
      60ms 11.76% 35.29%      170ms 33.33%  math.Asin (inline)
      60ms 11.76% 47.06%      110ms 21.57%  math.sin
      60ms 11.76% 58.82%       80ms 15.69%  math.xatan (inline)
      40ms  7.84% 66.67%       80ms 15.69%  fmt.(*pp).doPrintf
      20ms  3.92% 70.59%      350ms 68.63%  main.haversine
```

`Duration` 2.24 s dan 0.94 s ga tushdi, `Total samples` 2150 ms dan 510 ms ga. Endi `main.haversine` eng katta ulush (68.6% cum), `memmove` ro'yxatdan chiqib ketdi. Bu bitta ishga tushirishning natijasi, shared VM'da shovqin bor; to'g'ri solishtirish uchun 61-darsdagi `-count` yondashuvini qo'llang. Ikki profilni `-base` bilan ayirsak, `runtime.memmove` uchun `-750ms` chiqadi: tuzatish aynan shu sarfni olib tashlagan.

Label'lar misoli. Sakkizta goroutine `/tracks` (og'ir) va sakkiztasi `/health` (yengil) ishini bajaradi, har biri `pprof.Do` ichida:

```go
pprof.Do(ctx, pprof.Labels("endpoint", endpoint), func(ctx context.Context) {
	v := burn(n)
	mu.Lock()
	*res += v
	mu.Unlock()
})
```

`go tool pprof -tags prog cpu.pprof`:

```text
 endpoint: Total 4.1s
              3.5s (85.02%): /tracks
           620.0ms (14.98%): /health
```

`-tagfocus=endpoint=/health` esa faqat `/health` stack'larini qoldirdi (`main.burn` cum 0.62 s).

### Jonli servisda xavfsiz ulash

`net/http/pprof` bo'sh import qilinganda handler'larini `http.DefaultServeMux`ga qo'shadi. Agar tashqi port ham `DefaultServeMux` ishlatsa, profil hammaga ochiladi: stack'lar, buyruq qatori, xotira tarkibi oshkor bo'ladi va uzun `seconds` so'rovlari servisni sekinlashtiradi. To'g'ri sxema: alohida mux, alohida `http.Server`, faqat ichki interfeysda. Topshiriqda aynan shu qilinadi.

## Qachon qo'llamaslik kerak

- Kutish muammosini CPU profil ko'rsatmaydi. Latency yuqori, CPU esa past bo'lsa, vaqt I/O, lock yoki channel kutishda ketayotgan bo'lishi mumkin. Bu holda block/mutex profili (63-dars) va execution trace (64-dars) kerak.
- Qisqa umrli yoki juda kam yuklama ostidagi dasturda profil statistik jihatdan ma'nosiz. Birinchi navbatda namunalar sonini tekshiring.
- Profilni optimizatsiya maqsadi sifatida ko'rmang. Eng katta ulush har doim bitta funksiyada bo'lishi shart emas: ko'p holda vaqt "tekis" taqsimlanadi va kichik tuzatish katta effekt bermaydi. Bu holda arxitektura (kamroq ish qilish) yoki PGO (67-dars) haqida o'ylang.
- Bir vaqtda bir nechta profilni yoqmang. Diagnostics hujjati profillar bir-biriga xalaqit berishini va bir vaqtda bitta profil yig'ish tavsiya etilishini yozadi.
- Public interfeysda pprof qoldirmang.

## Stack'da: Node.js/TypeScript bilan solishtirish

Node.js'da `node --cpu-prof` `.cpuprofile` fayl yozadi va DevTools'da ochiladi; production'da odatda APM agenti yoki alohida ulanish kerak bo'ladi. Go'da profil formati bitta (pprof), vosita toolchain'da, servisga ulash esa bitta import va admin port. Event loop'dagi bitta og'ir funksiya Node'da hamma so'rovni to'xtatadi va profilda yaqqol ko'rinadi. Go'da goroutine'lar bir necha yadroga tarqaladi, shuning uchun `Total samples` davomiylikdan oshishi mumkin va yuk "tekis" ko'rinadi.

Amaliy tavsiyalar:

- Har servisda admin mux'ga pprof ulang va uni faqat ichki tarmoqdan oching. `curl` yoki `go tool pprof` bilan profilni oldindan sinab ko'ring.
- Alert paytida `seconds=30` profilini saqlang: keyin `-base` bilan sog'lom vaqt profiliga solishtirasiz.
- Endpoint yoki tenant bo'yicha ajratish uchun `pprof.Do` label'laridan foydalaning; label qiymatlari kam xilma-xil bo'lsin.
- Tuzatishdan oldin va keyin profilni va benchmark'ni birga saqlang: profil sababni topadi, benchmark yaxshilanishni isbotlaydi (61-dars).

## Xulosa

- CPU profil sampling'ga asoslangan: standart 100 Hz, statistik baho; faqat CPU'da bajarilgan kodni ko'rsatadi, kutishni emas.
- Profil testdan (`-cpuprofile`), kod ichidan (`StartCPUProfile`) yoki `net/http/pprof` orqali olinadi.
- flat - funksiyaning o'z vaqti, cum - chaqirilganlar bilan birga. Sababni `peek` va `list` bilan chaqiruv zanjirida qidiring, runtime funksiyalarini ayblamang.
- `pprof.Do` label'lari va `-base` solishtirish sababni ajratish va tuzatishni isbotlashga yordam beradi.
- `net/http/pprof` bo'sh importi `DefaultServeMux`ni ochadi: uni faqat ichki admin mux'da ishlating.
