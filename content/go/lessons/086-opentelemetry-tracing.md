---
n: 86
slug: opentelemetry-tracing
title: "Distributed tracing: OpenTelemetry"
summary: "Trace, span va context propagation mexanikasi: W3C traceparent sarlavhasi, inject/extract, log bilan bog'lash (trace_id), OpenTelemetry SDK tuzilishi, sampling va span hayot sikli tuzoqlari."
duration: 45
sources:
  - id: otel-go
    note: "Go API paketi: Tracer, global provider/propagator funksiyalari (SetTracerProvider, SetTextMapPropagator); SDK paketlari imzolari pkg.go.dev da alohida tekshirildi"
  - id: otel-go-docs
    note: "Go uchun OpenTelemetry qo'llanmasi: instrumentatsiya, SDK sozlash va exporter tushunchalari. Sahifa bu sessiyada qayta tekshirilmagan"
  - id: pkg-context
    note: "Context qiymatlari va bekor qilish: span aynan context orqali uzatiladi"
quiz:
  - q: "Servis A servis B ni HTTP orqali chaqiradi, lekin Jaeger'da ikki alohida trace ko'rinyapti. Eng ehtimoliy sabab?"
    options:
      - "Sampling ikkala servisda 100% qo'yilgan"
      - "Trace id juda uzun"
      - "B servisi boshqa tilda yozilgan"
      - "A chiquvchi so'rovga traceparent sarlavhasini qo'shmayapti (yoki B uni o'qimayapti): propagation uzilgan"
    answer: 3
    explain: "Trace shu sarlavha orqali ulanadi: A inject qiladi, B extract qiladi. Birining yo'qligi trace'ni ikkiga bo'ladi. Til muhim emas: W3C Trace Context standart. Odatiy sabab: so'rov context'siz yaratilgan (http.NewRequest o'rniga NewRequestWithContext kerak) yoki client instrumentatsiyalanmagan."
  - q: "`ctx, span := tracer.Start(ctx, \"store.Save\")` yozildi, lekin `span.End()` chaqirilmadi. Nima bo'ladi?"
    options:
      - "Hech narsa, span GC tomonidan avtomatik tugatiladi"
      - "Span ham, uning davomiyligi ham tugamagan hisoblanadi: odatda exporter'ga yuborilmaydi va trace'da yo'qoladi"
      - "Dastur panic bilan to'xtaydi"
      - "Span avtomatik ravishda funksiya qaytganda tugatiladi"
    answer: 1
    explain: "End span'ni tugatilgan deb belgilaydi va uni yuborishga tayyorlaydi. Tugatilmagan span yuborilmaydi, shuning uchun uning qismi trace'da tushib qoladi. Odatiy naqsh: Start dan keyingi qatorda `defer span.End()`."
  - q: "Mini-misolda mijoz `traceparent` yubormadi. A servisi nima qildi?"
    options:
      - "So'rovni rad etdi"
      - "Hech qanday span ochmadi"
      - "Yangi trace_id yaratib, trace'ni o'zi boshladi; B ga uzatilgan sarlavhada shu trace_id bor"
      - "Faqat span_id yaratdi, trace_id bo'sh qoldi"
    answer: 2
    explain: "Chiqishda A va B yozuvlari bir xil trace_id, lekin turli span_id bilan chiqdi. Kiruvchi sarlavha bo'lmasa, birinchi servis (root) yangi trace yaratadi. Sarlavha bo'lsa (ikkinchi so'rov) shu trace_id davom ettiriladi."
  - q: "`sdktrace.ParentBased(sdktrace.TraceIDRatioBased(0.1))` sampler nimani anglatadi?"
    options:
      - "Root span'larning 10% i ehtimol bilan tanlanadi; ota-span qaror qilgan bo'lsa, bola shu qarorga ergashadi"
      - "Har so'rovning 10% i xatoga olib keladi"
      - "Hamma span'lar 10 baravar sekinroq yoziladi"
      - "Faqat xatolar sampling qilinadi"
    answer: 0
    explain: "ParentBased: ota span bor bo'lsa uning qarori (sampled/yo'q) bola tomonidan qabul qilinadi, shu tufayli trace bo'laklari butun qoladi. TraceIDRatioBased esa root uchun trace id bo'yicha deterministik nisbat tanlaydi. Bu 'head sampling': qaror trace boshida qabul qilinadi, shuning uchun xato trace'ni keyin qaytarib bo'lmaydi."
  - q: "Log yozuvlariga trace_id qo'shishdan asosiy maqsad nima?"
    options:
      - "Log hajmini kamaytirish"
      - "slog'ni tezlashtirish"
      - "Loglarni shifrlash"
      - "Trace'dagi yomon span'dan shu so'rovga tegishli log qatorlariga (va aksincha) o'tish imkonini berish"
    answer: 3
    explain: "Trace so'rov qayerda va qancha vaqt sarflaganini, log esa nima bo'lganini ko'rsatadi. Umumiy trace_id ikkalasini bog'laydi. Buning uchun log context bilan chaqirilishi (InfoContext) va handler context'dan id o'qishi kerak (84-dars)."
  - q: "Span atributiga `device.id` (cheksiz qiymatli) yozish metrika label'iga yozishdan qanday farq qiladi?"
    options:
      - "Farqi yo'q: ikkalasi ham kardinallik portlashi beradi"
      - "Trace'larda bunday atributlar normal va foydali, chunki har span alohida saqlanadi; metrikalarda esa har qiymat yangi seriya"
      - "Span atributlari faqat son qabul qiladi"
      - "Trace tizimlari atributlarni umuman saqlamaydi"
    answer: 1
    explain: "Metrika agregat bo'lib, har label kombinatsiyasi seriya (85-dars). Trace esa alohida so'rovlarni saqlaydi, shuning uchun yuqori kardinalli atribut (device id, order id) qidiruv uchun aynan kerak. Chegara: maxfiy ma'lumotni atributga yozmang va span hajmini cheklang."
task:
  title: "traceparent sarlavhasini xavfsiz o'qish"
  prompt: |
    `Parse` W3C `traceparent` sarlavhasini o'qiydi, lekin hech narsani tekshirmaydi: qismlar soni kam bo'lsa panic beradi, nol trace id ni qabul qiladi.

    Vazifa: faylni `trace_test.go` deb saqlang. `Parse` ni shunday yozingki, sarlavha faqat quyidagi shartlarda qabul qilinsin: aniq 4 qism; versiya 2 ta kichik harfli hex belgi va `ff` emas; trace id 32 ta hex va hammasi nol emas; span id 16 ta hex va hammasi nol emas; flags 2 ta hex. Yaroqsiz kirishda `ok=false` qaytsin (bunda servis yangi trace boshlaydi). Table-driven test yozing: bo'sh qator, kam va ko'p qismlar, qisqa trace id, nol id'lar, hex bo'lmagan belgilar, katta harflar va `ff` versiyasi kiritilsin.
  lang: go
  starter: |
    package trace

    import (
        "strings"
        "testing"
    )

    // Parent - W3C traceparent sarlavhasidan olingan ma'lumot.
    type Parent struct {
        TraceID string
        SpanID  string
        Sampled bool
    }

    // Parse "00-<32 hex>-<16 hex>-<2 hex>" ko'rinishidagi sarlavhani o'qiydi.
    func Parse(h string) (Parent, bool) {
        p := strings.Split(h, "-")
        return Parent{TraceID: p[1], SpanID: p[2], Sampled: p[3] == "01"}, true
    }

    func TestParse(t *testing.T) {
        p, ok := Parse("00-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-01")
        if !ok || p.TraceID != "0af7651916cd43dd8448eb211c80319c" || p.SpanID != "b7ad6b7169203331" || !p.Sampled {
            t.Fatalf("Parse = %+v, %v", p, ok)
        }
    }
  solution: |
    package trace

    import (
        "strings"
        "testing"
    )

    // Parent - W3C traceparent sarlavhasidan olingan ma'lumot.
    type Parent struct {
        TraceID string
        SpanID  string
        Sampled bool
    }

    func isLowerHex(s string, n int) bool {
        if len(s) != n {
            return false
        }
        for _, c := range s {
            if !(c >= '0' && c <= '9' || c >= 'a' && c <= 'f') {
                return false
            }
        }
        return true
    }

    func allZero(s string) bool { return strings.Trim(s, "0") == "" }

    // Parse "00-<32 hex>-<16 hex>-<2 hex>" ko'rinishidagi sarlavhani o'qiydi.
    // Yaroqsiz sarlavha uchun ok=false: bunda yangi trace boshlanadi.
    func Parse(h string) (Parent, bool) {
        p := strings.Split(h, "-")
        if len(p) != 4 || !isLowerHex(p[0], 2) || p[0] == "ff" ||
            !isLowerHex(p[1], 32) || allZero(p[1]) ||
            !isLowerHex(p[2], 16) || allZero(p[2]) ||
            !isLowerHex(p[3], 2) {
            return Parent{}, false
        }
        return Parent{TraceID: p[1], SpanID: p[2], Sampled: p[3] == "01"}, true
    }

    func TestParse(t *testing.T) {
        const tid, sid = "0af7651916cd43dd8448eb211c80319c", "b7ad6b7169203331"
        tests := []struct {
            name   string
            header string
            want   Parent
            wantOK bool
        }{
            {"to'g'ri, sampled", "00-" + tid + "-" + sid + "-01", Parent{tid, sid, true}, true},
            {"to'g'ri, sampled emas", "00-" + tid + "-" + sid + "-00", Parent{tid, sid, false}, true},
            {"bo'sh", "", Parent{}, false},
            {"qismlar kam", "00-" + tid, Parent{}, false},
            {"qismlar ko'p", "00-" + tid + "-" + sid + "-01-x", Parent{}, false},
            {"trace id qisqa", "00-abc-" + sid + "-01", Parent{}, false},
            {"trace id nol", "00-00000000000000000000000000000000-" + sid + "-01", Parent{}, false},
            {"span id nol", "00-" + tid + "-0000000000000000-01", Parent{}, false},
            {"hex emas", "00-" + strings.Repeat("g", 32) + "-" + sid + "-01", Parent{}, false},
            {"katta harf", "00-" + strings.ToUpper(tid) + "-" + sid + "-01", Parent{}, false},
            {"versiya ff", "ff-" + tid + "-" + sid + "-01", Parent{}, false},
        }
        for _, tt := range tests {
            t.Run(tt.name, func(t *testing.T) {
                t.Parallel()
                got, ok := Parse(tt.header)
                if ok != tt.wantOK || got != tt.want {
                    t.Errorf("Parse(%q) = %+v, %v; kutilgan %+v, %v", tt.header, got, ok, tt.want, tt.wantOK)
                }
            })
        }
    }
  solutionNotes: |
    - Kirish sarlavhasi tashqaridan keladi (ishonchsiz). Starter `p[1]` ga indeks bilan kirib, qismlar kam bo'lsa panic beradi: bitta buzuq sarlavha butun so'rovni yiqitadi.
    - W3C talabi: trace id va span id hammasi nol bo'lishi mumkin emas; versiya `ff` taqiqlangan; hex kichik harflarda. Sarlavha yaroqsiz bo'lsa, qabul qilib bo'lmaydi va yangi trace boshlanadi (xato qaytarilmaydi, so'rov ishlayveradi).
    - `ok=false` bilan nol `Parent{}` qaytariladi: chaqiruvchi yarim to'ldirilgan qiymatga tayanib qolmaydi.
    - Katta harfli trace id rad etiladi (spetsifikatsiyada kichik harfli hex). Bu qat'iy tanlov; ba'zi tizimlar yumshoqroq o'qiydi.
    - `go test -race` bilan parallel subtestlar tekshirilgan.
  checklist:
    - "Qismlar soni 4 ga teng emas bo'lsa panic yo'q, `ok=false`"
    - "Trace id 32 hex va nol emas, span id 16 hex va nol emas"
    - "Versiya `ff`, katta harflar va hex bo'lmagan belgilar rad etiladi"
    - "Table-driven test yaroqli va kamida 8 ta yaroqsiz kirishni qamraydi"
    - "`go vet` va `go test -race` o'tadi"
---

## Muammo

Monolitda xato topish uchun log va stack trace yetarli. Mikroservisda esa bitta foydalanuvchi so'rovi API gateway, ingest servisi, navbat, ma'lumotlar bazasi va uchinchi tomon API'si orqali o'tadi. Sekin javob berilganda savol: vaqt qayerda ketdi? Har servisning logi o'z soatida va o'z id'si bilan yozilgan; ularni qo'lda bog'lash soatlab davom etadi. Metrika "p99 oshdi" deydi, lekin qaysi so'rovda va qaysi qadamda ekanini aytmaydi.

Distributed tracing bu savolga bitta so'rovning butun yo'lini daraxt sifatida ko'rsatish bilan javob beradi: har qadam (span) o'z boshlanish vaqti, davomiyligi va atributlariga ega, hammasi bitta trace id ostida. Trace ulanishi uchun id'larni servislar orasida o'zimiz uzatishimiz kerak: bu context propagation. Bu dars mexanizmni avval standart kutubxonada (tashqi kutubxonasiz ishlaydigan mini-propagator, haqiqiy chiqish bilan) ko'rsatadi, so'ng OpenTelemetry SDK'ning shu mexanizmni qanday qoplashini beradi. OpenTelemetry kodi tashqi modullarga tayanadi, sandbox'da yuklanmaydi va shu sababli kompilyatsiya qilinmagan, bu ochiq belgilangan.

## Asosiy g'oya

### Terminlar

- **Trace**: bitta so'rovning butun yo'li, 16 baytlik (32 hex) trace id bilan.
- **Span**: trace ichidagi bitta ish birligi (HTTP handler, DB so'rovi, tashqi chaqiruv): 8 baytlik (16 hex) span id, ota span id, nom, vaqt, atributlar, holat.
- **Context propagation**: trace id va joriy span id'ni jarayon ichida (`context.Context`) va jarayonlar orasida (HTTP sarlavhasi, xabar atributi) uzatish.
- **Exporter**: tugagan span'larni backend'ga (Jaeger, Tempo, vendor) yuboradi, odatda OTLP protokoli bilan.
- **Sampler**: qaysi trace'lar saqlanishini hal qiladi.

### W3C Trace Context

Jarayonlar orasida standart `traceparent` sarlavhasi ishlatiladi: `versiya-traceid-spanid-flags`, masalan `00-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-01`. Versiya `00`, trace id 32 hex, parent span id 16 hex, flags'ning eng quyi biti (`01`, sampled) chaqiruvchi trace ma'lumotini yozgan bo'lishi mumkinligini bildiradi. Hammasi nol bo'lgan trace id yoki span id yaroqsiz, versiya `ff` taqiqlangan. Qabul qiluvchi servis sarlavhani o'qiydi (extract), yangi bola span ochadi va chiquvchi chaqiruvlarga o'z span id'si bilan yozadi (inject). OpenTelemetry'da buni propagator bajaradi (`propagation.TraceContext{}`), tillar orasida mos kelishining sababi shu standart.

### Go'da span context orqali yashaydi

Go'da goroutine-local o'zgaruvchi yo'q (Node.js'dagi `AsyncLocalStorage` kabi yashirin kontekst bo'lmaydi). Span aniq `context.Context` ichida uzatiladi: `ctx, span := tracer.Start(ctx, "nom")` yangi ctx qaytaradi, bola funksiyalarga shu ctx beriladi. Shuning uchun bu kursning qoidasi: har I/O qiladigan funksiya birinchi parametri `ctx`. Context uzilgan joyda (masalan `context.Background()` bilan fon goroutine boshlash, yoki `http.NewRequest` ni `NewRequestWithContext` o'rniga ishlatish) trace ham uziladi.

## Chuqurroq: SDK tuzilishi va qarorlar

### SDK komponentlari

OpenTelemetry Go'da API va SDK ajratilgan. Kutubxonalar faqat API ni (`otel.Tracer(...)`) chaqiradi, SDK ni esa `main` bir marta sozlaydi. Agar SDK sozlanmasa, API chaqiruvlari hech narsa qilmaydi (no-op). Bu kutubxona yozuvchilariga trace'ni majburlamasdan instrumentatsiya qo'shish imkonini beradi. SDK tarkibi:

1. **Resource**: servisni tavsiflaydi (`service.name`, versiya). Resource'siz span'lar backend'da "noma'lum servis" bo'ladi.
2. **TracerProvider**: span'larni yaratadi va processor'ga beradi.
3. **Span processor / exporter**: odatda batch processor: span'larni buferlab, davriy yuboradi. Dastur to'xtashida buferni flush qilish uchun `tp.Shutdown(ctx)` chaqirilishi shart (88-dars: graceful shutdown), aks holda oxirgi span'lar yo'qoladi.
4. **Propagator**: `otel.SetTextMapPropagator(...)`; standart holda propagator o'rnatilmagan bo'lishi mumkin, shuning uchun uni aniq o'rnatish kerak.

### Sampling

Barcha trace'larni saqlash qimmat. `TraceIDRatioBased(0.1)` root span'larning 10% ini (ehtimol bilan) trace id bo'yicha tanlaydi, `ParentBased` esa ota-span qaroriga ergashtiradi, shu tufayli bitta trace servislar bo'ylab butun yoki umuman saqlanmaydi. Bu head sampling: qaror trace boshida qabul qilinadi, shuning uchun keyin xato chiqsa ham trace saqlanmagan bo'lishi mumkin. Xato va sekin so'rovlarni tanlab saqlash uchun tail sampling kerak, u odatda OpenTelemetry Collector tomonida amalga oshiriladi va qo'shimcha infratuzilma talab qiladi.

### Span hayot sikli

- `defer span.End()` har doim `Start` dan keyingi qatorda. End chaqirilmagan span yuborilmaydi.
- Xatoni `span.RecordError(err)` bilan yozing va holatni `span.SetStatus(codes.Error, "...")` bilan belgilang; faqat RecordError holatni o'zgartirmaydi.
- Atributlar: yuqori kardinallik trace'da mumkin (`device.id`), metrikada emas (85-dars). Maxfiy ma'lumotni (parol, token, to'liq karta) atributga yozmang.
- Span nomi past kardinalli bo'lsin: `GET /devices/{id}` yoki `store.SavePoint`, xom URL emas.

### Log bilan bog'lash

Trace va log bir xil trace_id bilan bog'lanadi. 84-darsdagi `ctxHandler` g'oyasi shu yerda: handler `Handle(ctx, r)` ichida context'dan span context'ni o'qib, `trace_id` va `span_id` atributlarini qo'shadi. OpenTelemetry'da `trace.SpanContextFromContext(ctx)` shu vazifani bajaradi; quyidagi mini-misolda xuddi shuni o'zimiz yozdik.

### traceparent validatsiyasi: spetsifikatsiya nimani talab qiladi

W3C Trace Context matni (w3.org/TR/trace-context) bir nechta nozik joyni aniq yozadi. Header nomi: qabul qiluvchi uni istalgan registrda kutishi shart (MUST), yuboruvchi esa kichik harfda yozishi tavsiya etiladi. Go'ning `net/http` paketi nomni kanonik ko'rinishga keltiradi, shuning uchun `r.Header.Get("traceparent")` har ikki holatda ishlaydi. Qiymatdagi hex raqamlar esa faqat kichik harfli bo'lishi kerak (ABNF'dagi `HEXDIGLC`): `0AF7...` yaroqsiz qiymat. Versiya `ff` yaroqsiz, hammasi nol trace id yoki parent id ham yaroqsiz.

Versiya `00` dan yuqori bo'lsa, spetsifikatsiya trace id va parent id'ni baribir `00` formatida o'qishni, o'zi tushunadigan flags bitlarini olib, qolganini tashlab yuborishni buyuradi. O'qib bo'lmasa, yangi `traceparent` yaratiladi va kelgan `tracestate` o'chiriladi. Ikkinchi sarlavha, `tracestate`, vendorga xos key-value juftliklarini tashiydi: kamida 512 belgini uzatish tavsiya etiladi, qisqartirish kerak bo'lsa butun yozuvlar olib tashlanadi, 128 belgidan uzun yozuvlar birinchi navbatda. Pastdagi kichik tekshiruv shu qoidalarni ko'rsatadi (Go 1.24.7, tashqi modulsiz):

```go
package main

import (
	"fmt"
	"strings"
)

// isLowerHex W3C HEXDIGLC: faqat 0-9 va kichik a-f.
func isLowerHex(s string) bool {
	for i := 0; i < len(s); i++ {
		c := s[i]
		if !(c >= '0' && c <= '9' || c >= 'a' && c <= 'f') {
			return false
		}
	}
	return true
}

func allZero(s string) bool { return strings.Trim(s, "0") == "" }

// check traceparent qiymatini tekshiradi va natijani matn bilan qaytaradi.
func check(h string) string {
	parts := strings.Split(h, "-")
	if len(parts) < 4 {
		return "maydonlar yetarli emas"
	}
	ver, tid, sid, flags := parts[0], parts[1], parts[2], parts[3]
	switch {
	case len(ver) != 2 || !isLowerHex(ver):
		return "versiya yaroqsiz"
	case ver == "ff":
		return "versiya ff taqiqlangan"
	case len(tid) != 32 || !isLowerHex(tid):
		return "trace-id 32 ta kichik hex emas"
	case len(sid) != 16 || !isLowerHex(sid):
		return "parent-id 16 ta kichik hex emas"
	case len(flags) != 2 || !isLowerHex(flags):
		return "flags 2 ta kichik hex emas"
	case allZero(tid) || allZero(sid):
		return "hammasi nol id taqiqlangan"
	case ver == "00" && len(parts) != 4:
		return "00 versiyada ortiqcha maydon bor"
	}
	if ver != "00" {
		return "qabul: noma'lum yuqori versiya, 00 formatida o'qildi"
	}
	return "qabul"
}

func main() {
	cases := []string{
		"00-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-01",
		"00-0AF7651916CD43DD8448EB211C80319C-b7ad6b7169203331-01",
		"ff-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-01",
		"00-00000000000000000000000000000000-b7ad6b7169203331-01",
		"00-0af7651916cd43dd8448eb211c80319c-0000000000000000-01",
		"00-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-01-extra",
		"01-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-01-extra",
	}
	for _, c := range cases {
		fmt.Printf("%-64s %s\n", c, check(c))
	}
}
```

```text
00-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-01          qabul
00-0AF7651916CD43DD8448EB211C80319C-b7ad6b7169203331-01          trace-id 32 ta kichik hex emas
ff-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-01          versiya ff taqiqlangan
00-00000000000000000000000000000000-b7ad6b7169203331-01          hammasi nol id taqiqlangan
00-0af7651916cd43dd8448eb211c80319c-0000000000000000-01          hammasi nol id taqiqlangan
00-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-01-extra    00 versiyada ortiqcha maydon bor
01-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-01-extra    qabul: noma'lum yuqori versiya, 00 formatida o'qildi
```

Bu tekshiruv spetsifikatsiyaning faqat shu darsda sanalgan qoidalarini qoplaydi; `tracestate` sintaksisini (kalit va qiymat alfavitlari, 32 ta yozuv chegarasi) ko'rsatmaydi. Amalda buni o'zingiz yozmaysiz: SDK'ning `propagation.TraceContext` propagatori shu ishni bajaradi, kod esa propagator nimaga rad javobi berishini tushunish uchun kerak. Yaroqsiz sarlavha kelganda to'g'ri xatti-harakat xato qaytarish emas, yangi trace boshlash: kuzatuvchanlik tizimi biznes so'rovni to'xtatmasligi kerak.

### Sampler va batch processor: default'lar nimani anglatadi

`ParentBased` pkg.go.dev hujjatiga ko'ra ota-span bo'lmasa o'ramdagi sampler (bizda `TraceIDRatioBased`) qaror qiladi. Ota-span bor bo'lsa, to'rtta holatdan biri ishlaydi va ularning default'lari: masofadagi ota sampled bo'lsa `AlwaysOn`, sampled bo'lmasa `AlwaysOff`, lokal ota uchun ham xuddi shunday. `TraceIDRatioBased` hujjati esa ota trace'ning sampled bayrog'ini hurmat qilish uchun uni `ParentBased` ichiga delegat qilib berishni aytadi. Amaliy oqibat: ichki servislarda sampler'ni oddiy `TraceIDRatioBased(0.1)` qilib qo'ysangiz, u ota qarorini e'tiborsiz qoldiradi va servislar turli ulushlar bilan sozlangan bo'lsa, trace'ning bir qismi yo'qoladi. Bu xulosa hujjatdagi qoidalardan mantiqan chiqadi, alohida o'lchab tekshirilmagan.

`WithBatcher` ostidagi `BatchSpanProcessor` default'lari (SDK hujjatidagi konstantalar): navbat 2048 span, eksport oralig'i 5000 ms, bir paketda 512 span, eksport timeout'i 30000 ms. Shundan ikki amaliy xulosa: (1) qisqa umrli jarayon (cron job, CLI, migratsiya) 5 soniyadan oldin tugasa, `Shutdown` yoki `ForceFlush` chaqirilmasa span'lari yo'qoladi; (2) `NewSimpleSpanProcessor` har span'ni sinxron eksport qiladi va hujjat uni production uchun tavsiya etmaydi, u test va namuna uchun.

## Misol: mini-propagator va ikki servis

Quyidagi dastur ikkita `httptest` serveri (A va B) o'rtasida `traceparent` uzatilishini, har yozuvga `trace_id` qo'shilishini ko'rsatadi. Bu o'quv kodi: id generatsiyasi qat'iy seed bilan (chiqish takrorlansin), haqiqiy loyihada tasodifiy kriptografik bo'lmagan, lekin noyob id'lar SDK tomonidan beriladi. Parse soddalashtirilgan (hex.Decode katta harflarni ham qabul qiladi, W3C esa kichik harfni talab qiladi: topshiriqda buni to'g'rilaysiz).

```go
package main

import (
	"context"
	"encoding/hex"
	"fmt"
	"log/slog"
	"math/rand/v2"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"sync"
)

// SpanContext W3C Trace Context (traceparent) ning zarur qismi.
type SpanContext struct {
	TraceID [16]byte
	SpanID  [8]byte
	Flags   byte
}

func (sc SpanContext) valid() bool {
	return sc.TraceID != [16]byte{} && sc.SpanID != [8]byte{}
}

// String: version-traceid-spanid-flags
func (sc SpanContext) String() string {
	return fmt.Sprintf("00-%s-%s-%02x", hex.EncodeToString(sc.TraceID[:]), hex.EncodeToString(sc.SpanID[:]), sc.Flags)
}

func parseTraceparent(h string) (SpanContext, bool) {
	parts := strings.Split(h, "-")
	if len(parts) != 4 || parts[0] != "00" || len(parts[1]) != 32 || len(parts[2]) != 16 || len(parts[3]) != 2 {
		return SpanContext{}, false
	}
	var sc SpanContext
	if _, err := hex.Decode(sc.TraceID[:], []byte(parts[1])); err != nil {
		return SpanContext{}, false
	}
	if _, err := hex.Decode(sc.SpanID[:], []byte(parts[2])); err != nil {
		return SpanContext{}, false
	}
	var f [1]byte
	if _, err := hex.Decode(f[:], []byte(parts[3])); err != nil {
		return SpanContext{}, false
	}
	sc.Flags = f[0]
	return sc, sc.valid()
}

type ctxKey struct{}

var (
	mu  sync.Mutex
	rng = rand.New(rand.NewPCG(7, 11)) // misol chiqishi takrorlanishi uchun qat'iy seed
)

func randBytes(b []byte) {
	mu.Lock()
	defer mu.Unlock()
	for i := range b {
		b[i] = byte(rng.IntN(256))
	}
}

// startSpan: context'da span bo'lsa bola yaratadi (trace id saqlanadi), bo'lmasa yangi trace boshlaydi.
func startSpan(ctx context.Context) (context.Context, SpanContext) {
	sc, ok := ctx.Value(ctxKey{}).(SpanContext)
	if !ok {
		randBytes(sc.TraceID[:])
		sc.Flags = 1
	}
	randBytes(sc.SpanID[:])
	return context.WithValue(ctx, ctxKey{}, sc), sc
}

// traceHandler har log yozuviga context'dagi trace_id va span_id ni qo'shadi.
type traceHandler struct{ slog.Handler }

func (h traceHandler) Handle(ctx context.Context, r slog.Record) error {
	if sc, ok := ctx.Value(ctxKey{}).(SpanContext); ok {
		r.AddAttrs(
			slog.String("trace_id", hex.EncodeToString(sc.TraceID[:])),
			slog.String("span_id", hex.EncodeToString(sc.SpanID[:])),
		)
	}
	return h.Handler.Handle(ctx, r)
}
func (h traceHandler) WithAttrs(a []slog.Attr) slog.Handler {
	return traceHandler{h.Handler.WithAttrs(a)}
}
func (h traceHandler) WithGroup(n string) slog.Handler { return traceHandler{h.Handler.WithGroup(n)} }

// serverMiddleware kiruvchi traceparent'ni o'qiydi (extract) va bola span ochadi.
func serverMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		if parent, ok := parseTraceparent(r.Header.Get("traceparent")); ok {
			ctx = context.WithValue(ctx, ctxKey{}, parent)
		}
		ctx, _ = startSpan(ctx)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// call chiquvchi so'rovga joriy span'ni traceparent sifatida qo'shadi (inject).
func call(ctx context.Context, client *http.Client, url string) error {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return err
	}
	if sc, ok := ctx.Value(ctxKey{}).(SpanContext); ok {
		req.Header.Set("traceparent", sc.String())
	}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	return resp.Body.Close()
}

func main() {
	log := slog.New(traceHandler{slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
		ReplaceAttr: func(g []string, a slog.Attr) slog.Attr {
			if a.Key == slog.TimeKey && len(g) == 0 {
				return slog.Attr{}
			}
			return a
		},
	})})

	// B servisi: ma'lumotlar ombori o'rniga faqat log yozadi.
	b := httptest.NewServer(serverMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.InfoContext(r.Context(), "B: nuqta saqlandi")
	})))
	defer b.Close()

	// A servisi: B ni chaqiradi.
	a := httptest.NewServer(serverMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.InfoContext(r.Context(), "A: so'rov qabul qilindi")
		if err := call(r.Context(), b.Client(), b.URL); err != nil {
			log.ErrorContext(r.Context(), "B chaqiruvi xato", "err", err)
		}
	})))
	defer a.Close()

	// Tashqi mijoz traceparent yubormaydi: A yangi trace boshlaydi.
	resp, err := a.Client().Get(a.URL)
	if err != nil {
		fmt.Println(err)
		return
	}
	resp.Body.Close()

	// Mijoz o'z traceparent'ini yuborsa, A shu trace'ni davom ettiradi.
	req, _ := http.NewRequest(http.MethodGet, a.URL, nil)
	req.Header.Set("traceparent", "00-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-01")
	resp, err = a.Client().Do(req)
	if err != nil {
		fmt.Println(err)
		return
	}
	resp.Body.Close()
}
```

Chiqish (Go 1.24.7, qat'iy seed tufayli har ishga tushirishda bir xil):

```text
{"level":"INFO","msg":"A: so'rov qabul qilindi","trace_id":"724bd2b14f6fec73c359503d42afcf43","span_id":"07ca850ac73bec2c"}
{"level":"INFO","msg":"B: nuqta saqlandi","trace_id":"724bd2b14f6fec73c359503d42afcf43","span_id":"9651456e8e1a93f4"}
{"level":"INFO","msg":"A: so'rov qabul qilindi","trace_id":"0af7651916cd43dd8448eb211c80319c","span_id":"7f85ed2e5bf0039b"}
{"level":"INFO","msg":"B: nuqta saqlandi","trace_id":"0af7651916cd43dd8448eb211c80319c","span_id":"e411292d61c86b64"}
```

Chiqishdan:

- Birinchi so'rovda mijoz sarlavha yubormadi: A yangi trace boshladi (`724bd2b1...`), B ga uzatilgan sarlavha orqali B ham shu trace'da ishladi, lekin span_id farqli (har span o'z id'siga ega).
- Ikkinchi so'rovda mijoz o'z `traceparent` sarlavhasini yubordi: A uni extract qilib, `0af76519...` trace'ini davom ettirdi. Ikkala servis yozuvida ham trace_id mijoz bergan qiymat.
- Qidiruv tizimida (Loki yoki Elasticsearch) bitta `trace_id` filtri ikkala servisning loglarini bitta ro'yxatga yig'adi.

### OpenTelemetry SDK bilan

Haqiqiy loyihada shu mexanizmni `otelhttp` (server va client instrumentatsiyasi) va SDK qoplaydi. Quyidagi kod tashqi modullarga tayanadi (`go.opentelemetry.io/otel` va unga bog'liq paketlar), sandbox'da yuklanmagani uchun kompilyatsiya qilinmagan: sintaksis `gofmt` bilan tekshirilgan, imzolar (`sdktrace.NewTracerProvider`, `WithBatcher`, `ParentBased`, `TraceIDRatioBased`, `resource.NewWithAttributes`, `otlptracegrpc.New`, `otelhttp.NewHandler`, `propagation.NewCompositeTextMapPropagator`, `semconv/v1.26.0` dagi `SchemaURL`, `ServiceName`, `ServiceVersion`) esa pkg.go.dev hujjati bilan solishtirildi (2026-11-03). `semconv` paketi versiyasi o'rnatilgan otel modulingizga mos tanlanadi. Loyihangizda `go build` bilan tekshiring.

```go
package main

import (
	"context"
	"errors"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"

	"go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/codes"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracegrpc"
	"go.opentelemetry.io/otel/propagation"
	"go.opentelemetry.io/otel/sdk/resource"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
	semconv "go.opentelemetry.io/otel/semconv/v1.26.0" // versiya otel modul versiyasiga mos bo'lishi kerak
)

// initTracing global TracerProvider va propagator'ni o'rnatadi; qaytgan funksiya flush qiladi.
func initTracing(ctx context.Context) (func(context.Context) error, error) {
	exp, err := otlptracegrpc.New(ctx) // manzil OTEL_EXPORTER_OTLP_ENDPOINT dan olinadi
	if err != nil {
		return nil, err
	}
	res := resource.NewWithAttributes(semconv.SchemaURL,
		semconv.ServiceName("ingest"),
		semconv.ServiceVersion("1.4.0"),
	)
	tp := sdktrace.NewTracerProvider(
		sdktrace.WithBatcher(exp),
		sdktrace.WithResource(res),
		sdktrace.WithSampler(sdktrace.ParentBased(sdktrace.TraceIDRatioBased(0.1))),
	)
	otel.SetTracerProvider(tp)
	otel.SetTextMapPropagator(propagation.NewCompositeTextMapPropagator(
		propagation.TraceContext{}, propagation.Baggage{},
	))
	return tp.Shutdown, nil
}

var tracer = otel.Tracer("ingest/store")

func savePoint(ctx context.Context, device string) error {
	ctx, span := tracer.Start(ctx, "store.SavePoint")
	defer span.End()
	span.SetAttributes(attribute.String("device.id", device))

	if err := write(ctx, device); err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, "yozib bo'lmadi")
		return err
	}
	return nil
}

func write(ctx context.Context, device string) error {
	if device == "" {
		return errors.New("qurilma bo'sh")
	}
	return nil
}

func main() {
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt)
	defer stop()

	shutdown, err := initTracing(ctx)
	if err != nil {
		log.Fatal(err)
	}
	defer func() {
		sctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		_ = shutdown(sctx) // buferdagi span'larni yuborib tugatadi
	}()

	mux := http.NewServeMux()
	mux.HandleFunc("POST /points/{device}", func(w http.ResponseWriter, r *http.Request) {
		if err := savePoint(r.Context(), r.PathValue("device")); err != nil {
			http.Error(w, "xato", http.StatusInternalServerError)
		}
	})
	// otelhttp server span ochadi va kiruvchi traceparent'ni extract qiladi.
	srv := &http.Server{Addr: ":8080", Handler: otelhttp.NewHandler(mux, "ingest")}
	go func() { _ = srv.ListenAndServe() }()
	<-ctx.Done()
}
```

Bu kodda e'tibor beradigan joylar:

- `initTracing` global provider va propagator'ni o'rnatadi va flush qiluvchi funksiya qaytaradi; `main` uni `defer` bilan, vaqt cheklangan context ichida chaqiradi.
- `savePoint` ichida `defer span.End()`, xatoda `RecordError` va `SetStatus`.
- `otelhttp.NewHandler` kiruvchi sarlavhani extract qilib server span ochadi; chiquvchi so'rovlar uchun `otelhttp.NewTransport` shu rolni o'ynaydi.
- Sampler `ParentBased(TraceIDRatioBased(0.1))`: 10% root trace'lar.
- OTLP manzili va protokol sozlamalari standart environment o'zgaruvchilaridan o'qiladi (`OTEL_EXPORTER_OTLP_ENDPOINT`), shuning uchun kod muhitga bog'lanmaydi.

## Qachon qo'llamaslik kerak

- Bitta servis, bitta ma'lumotlar bazasi: trace qiymati kam, narx (SDK, backend, saqlash) katta. Avval log va metrika.
- Issiq yo'lda har kichik funksiyaga span qo'shish. Span yaratish va yuborish narxga ega, trace ham shovqin bo'ladi. Span'larni ma'noli chegaralarda qo'ying: kiruvchi so'rov, tashqi chaqiruv, DB so'rovi, navbat operatsiyasi.
- Hamma narsani 100% sampling qilish yuqori trafikda qimmat; sampling strategiyasini oldindan o'ylang.
- Baggage (trace bilan birga uzatiladigan key-value) ga maxfiy yoki katta ma'lumot yozish: u har chaqiruvda sarlavha sifatida chiqib ketadi, tashqi servislarga ham.
- Trace tizimi ishonchli audit yozuvi emas: sampling va yo'qolgan span'lar tufayli to'liqlik kafolati yo'q.
- Kirish `traceparent` sarlavhasiga ko'r-ko'rona ishonish: ommaviy API'da begona mijoz o'z trace id'sini yuborishi mumkin. Ommaviy chegarada sarlavhani e'tiborsiz qoldirish va yangi trace boshlash to'g'ri bo'lishi mumkin.

## Stack'da: Node.js bilan farq

Node.js'da OpenTelemetry avto-instrumentatsiya (monkey-patching) bilan `http`, `pg`, `express` kabi modullarni o'zi o'raydi, kontekst esa `AsyncLocalStorage` orqali yashirin uzatiladi. Go'da monkey-patching yo'q: instrumentatsiya aniq o'raladi (`otelhttp.NewHandler`, `otelhttp.NewTransport`, DB driver uchun o'ram kutubxonalari), kontekst esa aniq `ctx` parametri bilan uzatiladi. Bu ko'proq yozishni talab qiladi, lekin nimaning o'lchanayotgani ko'rinib turadi va "kontekst qayerda yo'qoldi" savoli kod o'qish bilan hal bo'ladi.

Telemetriya platformasida odatiy zanjir: qurilma gateway'i, ingest servisi, xabar navbati, ishlov beruvchi, DB. HTTP sarlavhasi gateway'dan ingest'gacha o'tadi, navbatda esa xabar atributiga qo'lda yoziladi (propagator `TextMapCarrier` interface'i orqali istalgan tashuvchiga ishlaydi). Navbatdan o'qigan consumer extract qilib, o'z span'ini ota-span bilan bog'laydi (80-dars). Bu uzilishlar odatda birinchi navbatda yo'qoladigan joylar.

## Xulosa

- Trace so'rovning butun yo'li, span esa uning bir bo'lagi; ular `traceparent` (W3C) orqali servislar orasida ulanadi: chiquvchi tomon inject, kiruvchi tomon extract qiladi.
- Go'da span `context.Context` ichida yashaydi: har I/O funksiyasi `ctx` oladi, `NewRequestWithContext` ishlatiladi; context uzilsa, trace ham uziladi.
- SDK `main` da sozlanadi (resource, provider, batch exporter, propagator, sampler) va `Shutdown` bilan flush qilinadi; kutubxonalar faqat API ishlatadi.
- `defer span.End()`, xatoda `RecordError` + `SetStatus`; yuqori kardinalli atribut trace'da mumkin, metrikada emas; maxfiy ma'lumotni yozmang.
- Head sampling (`ParentBased`) arzon, lekin xato trace'ni keyin tanlay olmaydi; log'ga `trace_id` qo'shib trace va logni bog'lang.
