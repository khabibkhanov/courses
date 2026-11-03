---
n: 75
slug: tls-mtls
title: "TLS va mTLS: crypto/tls"
summary: "crypto/tls.Config qanday tekshiradi, server va client tomonda to'g'ri sozlash, mTLS bilan qurilma va servislarni autentifikatsiya qilish, sertifikatni qayta ishga tushirmasdan yangilash va Go 1.24-1.27 oralig'idagi TLS default o'zgarishlari."
duration: 45
sources:
  - id: pkg-tls
    note: "Config maydonlari (Certificates, GetCertificate, ClientAuth, ClientCAs, RootCAs, ServerName, MinVersion, InsecureSkipVerify) va ClientAuthType qiymatlari"
  - id: go126
    note: "crypto/tls bo'limi: SecP256r1MLKEM768 va SecP384r1MLKEM1024 default; GODEBUG sozlamalarining 1.27 da olib tashlanishi haqida ogohlantirish"
  - id: go127
    note: "crypto/tls bo'limi: ConnectionState.LocalCertificate, MLKEM1024, olib tashlangan GODEBUG sozlamalari (tlsrsakex, tls3des, tls10server va boshqalar)"
quiz:
  - q: "mTLS server uchun qaysi `ClientAuth` qiymati klient sertifikatini talab qiladi VA uni `ClientCAs` bo'yicha tekshiradi?"
    options:
      - "tls.RequestClientCert"
      - "tls.RequireAnyClientCert"
      - "tls.VerifyClientCertIfGiven"
      - "tls.RequireAndVerifyClientCert"
    answer: 3
    explain: "RequestClientCert sertifikat so'raydi, lekin berilmasa ham, noto'g'ri bo'lsa ham o'tkazadi. RequireAnyClientCert talab qiladi, lekin zanjirni tekshirmaydi. VerifyClientCertIfGiven sertifikat berilmasa o'tkazadi. Faqat RequireAndVerifyClientCert ham talab qiladi, ham ClientCAs bo'yicha tekshiradi."
  - q: "Lokal sinovda klient serverga ishonmaydigan boshqa CA imzolagan sertifikatni bergan holda ulandi. Xato `remote error: tls: certificate required` chiqdi (`bad certificate` emas). Nega?"
    options:
      - "Klient o'z sertifikatini umuman yubormadi: server so'ragan CA ro'yxatiga mos sertifikat topilmagani uchun Go client ro'yxatsiz sertifikat taklif qilmaydi, server esa sertifikat talab qilgan edi"
      - "Server sertifikatni o'qidi va muddatini tekshirdi"
      - "Klient TLS 1.0 ishlatdi"
      - "Server CA'sini bilmagani uchun 'certificate required' xabarini yubordi"
    answer: 0
    explain: "TLS 1.3 da server CertificateRequest ichida qabul qiladigan CA'lar ro'yxatini yuboradi. Go client faqat shu ro'yxatga mos sertifikatni tanlaydi; topilmasa, sertifikatsiz davom etadi. RequireAndVerifyClientCert bo'lgani uchun server 'certificate required' alert bilan uzadi."
  - q: "Klient sertifikati ishonchli CA tomonidan imzolangan, lekin amal qilish muddati o'tgan. mTLS server (RequireAndVerifyClientCert) bilan lokal sinovda qanday xato chiqdi?"
    options:
      - "Ulanish muvaffaqiyatli bo'ldi, muddat faqat server sertifikati uchun tekshiriladi"
      - "x509: certificate signed by unknown authority"
      - "remote error: tls: expired certificate"
      - "Hech qanday xato yo'q, lekin ma'lumot yuborilmadi"
    answer: 2
    explain: "Server klient sertifikatini ClientCAs bo'yicha tekshiradi, muddat ham shu tekshiruvning bir qismi. Xato alert sifatida klientga 'expired certificate' ko'rinishida qaytdi. Zanjir to'g'ri bo'lgani uchun 'unknown authority' emas."
  - q: "Jamoa 'sertifikat xatosi chiqayapti' deb klient konfiguratsiyasiga `InsecureSkipVerify: true` qo'ydi. Bu nimaga olib keladi?"
    options:
      - "Faqat hostname tekshiruvi o'chadi, zanjir tekshiruvi qoladi"
      - "Server sertifikati zanjiri va host nomi tekshirilmaydi: shifrlash bor, lekin kim bilan gaplashayotganingiz noma'lum, man-in-the-middle xavfi paydo bo'ladi. To'g'ri yo'l: RootCAs va ServerName"
      - "Faqat TLS 1.0 yoqiladi"
      - "Hech narsa o'zgarmaydi, bu faqat log darajasini pasaytiradi"
    answer: 1
    explain: "InsecureSkipVerify sertifikat zanjiri va host nomi tekshiruvini o'chiradi. Topshiriqdagi sinov ham shuni ko'rsatdi: starter versiya nomi mos kelmaydigan va ishonchsiz serverga ham ulandi. Ishonchli CA'ni RootCAs ga qo'shing, ServerName ni to'g'ri qo'ying."
  - q: "Servis Go 1.23 dan 1.24 ga yangilangandan keyin eski korporativ firewall ortidagi bitta serverga TLS handshake timeout bera boshladi. Kod o'zgarmagan, `CurvePreferences` nil. Eng ehtimolli sabab va yechim?"
    options:
      - "TLS 1.3 ishlatilmagani uchun: MinVersion ni TLS 1.0 ga tushirish"
      - "Go 1.24 da sertifikat zanjirlari qat'iylashgan: InsecureSkipVerify yoqish"
      - "Go 1.24 default'da gibrid post-quantum X25519MLKEM768 ni yoqdi: ClientHello kattalashdi va katta yozuvni noto'g'ri qayta ishlaydigan serverlar timeout beradi. `GODEBUG=tlsmlkem=0` yoki CurvePreferences ni aniq berish, ammo avvalo serverni tuzatish"
      - "Go 1.24 HTTP/2 ni majburan yoqdi"
    answer: 2
    explain: "Go 1.24 release notes: X25519MLKEM768 CurvePreferences nil bo'lganda default yoqildi va tlsmlkem=0 uni qaytaradi; notes xuddi shu timeout holatini tilga oladi. Go 1.26 yana SecP256r1MLKEM768 va SecP384r1MLKEM1024 ni default qildi (tlssecpmlkem=0). Bu vaqtinchalik chora, asosiy yechim muammoli serverni yangilash."
  - q: "mTLS server session ticket'larni yoqilgan holda ishlaydi. Qurilma sertifikati bekor qilindi (revoke), lekin qurilma qayta ulanganda server uni qabul qildi. Mumkin bo'lgan sabab?"
    options:
      - "Go server har handshake'da OCSP so'rovi yuboradi, lekin OCSP javobi kechikdi"
      - "Qayta ulanish session resumption orqali bo'ldi: Go 1.21 dan server tiklangan ulanishlarda klient sertifikatini qayta tekshirmaydi (faqat muddatini ko'radi), shuning uchun revoke tekshiruvi ham ishga tushmadi"
      - "Server bekor qilingan sertifikatlarni 24 soat keshlaydi"
      - "Go sertifikatlarni faqat TLS 1.3 da tekshiradi, TLS 1.2 da tekshirmaydi"
    answer: 1
    explain: "Release notes (Go 1.21): serverlar tiklangan ulanishlar uchun klient sertifikatini tekshirmaydi, VerifyPeerCertificate ham chaqirilmaydi, faqat muddat ko'riladi. Bekor qilishni tezroq kuchga kiritish uchun qisqa muddatli sertifikatlar, qisqa ticket muddati yoki VerifyConnection'da qo'shimcha tekshiruv ishlatiladi. Go o'zi CRL yoki OCSP tekshiruvini bajarmaydi, shuning uchun OCSP variantlari ham noto'g'ri."
  - q: "mTLS muvaffaqiyatli o'rnatildi. Handler `r.TLS.PeerCertificates[0].Subject.CommonName` ni 'tracker-0042' deb o'qidi va shu bo'yicha ruxsat berdi. Nima yetishmaydi?"
    options:
      - "Hech narsa: autentifikatsiya va avtorizatsiya bir xil narsa"
      - "Avtorizatsiya: sertifikat shu qurilma haqiqiy ekanini isbotlaydi, lekin u qaysi resurslarga ruxsatli ekanini ma'lumotlar bazasi yoki siyosat bilan tekshirish kerak; shuningdek identifikator uchun CN o'rniga SAN ishlatish tavsiya etiladi"
      - "Sertifikat TLS 1.2 da bo'lishi kerak edi"
      - "r.TLS faqat HTTP/1.0 da to'ldiriladi"
    answer: 1
    explain: "mTLS faqat 'kim' savoliga javob beradi (autentifikatsiya). Qurilma qaysi buyruqni bajarishi mumkinligi alohida avtorizatsiya qarori. Identifikator sifatida zamonaviy amaliyot SAN (DNS/URI) ishlatadi, CN esa eskirgan."
task:
  title: "InsecureSkipVerify o'rniga to'g'ri tekshiruvli client"
  prompt: |
    Ichki servis boshqa servisga HTTPS orqali murojaat qiladi. Sertifikat xatosini "vaqtincha" yo'qotish uchun `newClient` ichida `InsecureSkipVerify: true` qo'yilgan. Natijada client noma'lum CA va noto'g'ri host nomiga ham ulanadi.

    `newClient(trusted, serverName)` ni qayta yozing:
    - faqat berilgan `trusted` sertifikatga ishonsin (`RootCAs`), `trusted == nil` bo'lsa hech narsaga ishonmasin;
    - server nomini `serverName` bo'yicha tekshirsin;
    - `MinVersion` TLS 1.2 bo'lsin;
    - `InsecureSkipVerify` ishlatilmasin.

    Kutilgan natija: birinchi holat `ulandi`, ikkinchisi `rad etildi (host nomi mos emas)`, uchinchisi `rad etildi (noma'lum CA)`.
  lang: go
  starter: |
    package main

    import (
        "crypto/tls"
        "crypto/x509"
        "errors"
        "fmt"
        "net/http"
        "net/http/httptest"
    )

    // newClient serverni faqat trusted sertifikat va serverName bo'yicha tekshiradigan
    // HTTPS client qaytaradi. trusted nil bo'lsa, hech narsaga ishonmaydi.
    func newClient(trusted *x509.Certificate, serverName string) *http.Client {
        return &http.Client{Transport: &http.Transport{
            TLSClientConfig: &tls.Config{InsecureSkipVerify: true}, // "vaqtincha"
        }}
    }

    func classify(err error) string {
        var host x509.HostnameError
        var unknown x509.UnknownAuthorityError
        switch {
        case err == nil:
            return "ulandi"
        case errors.As(err, &host):
            return "rad etildi (host nomi mos emas)"
        case errors.As(err, &unknown):
            return "rad etildi (noma'lum CA)"
        default:
            return "boshqa xato: " + err.Error()
        }
    }

    func main() {
        srv := httptest.NewTLSServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            fmt.Fprint(w, "ok")
        }))
        defer srv.Close()
        cert := srv.Certificate()

        cases := []struct {
            name    string
            trusted *x509.Certificate
            host    string
        }{
            {"to'g'ri sertifikat va nom", cert, "example.com"},
            {"nom mos emas", cert, "api.other.test"},
            {"sertifikatga ishonmaydi", nil, "example.com"},
        }
        for _, c := range cases {
            resp, err := newClient(c.trusted, c.host).Get(srv.URL)
            if err == nil {
                resp.Body.Close()
            }
            fmt.Printf("%-26s %s\n", c.name+":", classify(err))
        }
    }
  solution: |
    package main

    import (
        "crypto/tls"
        "crypto/x509"
        "errors"
        "fmt"
        "net/http"
        "net/http/httptest"
    )

    // newClient serverni faqat trusted sertifikat va serverName bo'yicha tekshiradigan
    // HTTPS client qaytaradi. trusted nil bo'lsa, hech narsaga ishonmaydi.
    func newClient(trusted *x509.Certificate, serverName string) *http.Client {
        pool := x509.NewCertPool()
        if trusted != nil {
            pool.AddCert(trusted)
        }
        return &http.Client{Transport: &http.Transport{
            TLSClientConfig: &tls.Config{
                RootCAs:    pool,
                ServerName: serverName,
                MinVersion: tls.VersionTLS12,
            },
        }}
    }

    func classify(err error) string {
        var host x509.HostnameError
        var unknown x509.UnknownAuthorityError
        switch {
        case err == nil:
            return "ulandi"
        case errors.As(err, &host):
            return "rad etildi (host nomi mos emas)"
        case errors.As(err, &unknown):
            return "rad etildi (noma'lum CA)"
        default:
            return "boshqa xato: " + err.Error()
        }
    }

    func main() {
        srv := httptest.NewTLSServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            fmt.Fprint(w, "ok")
        }))
        defer srv.Close()
        cert := srv.Certificate()

        cases := []struct {
            name    string
            trusted *x509.Certificate
            host    string
        }{
            {"to'g'ri sertifikat va nom", cert, "example.com"},
            {"nom mos emas", cert, "api.other.test"},
            {"sertifikatga ishonmaydi", nil, "example.com"},
        }
        for _, c := range cases {
            resp, err := newClient(c.trusted, c.host).Get(srv.URL)
            if err == nil {
                resp.Body.Close()
            }
            fmt.Printf("%-26s %s\n", c.name+":", classify(err))
        }
    }
  solutionNotes: |
    - `x509.NewCertPool()` bo'sh pool yaratadi; `AddCert(trusted)` faqat shu sertifikatni ishonchli qiladi. `trusted == nil` bo'lsa pool bo'sh qoladi va barcha server sertifikatlari "noma'lum CA" bo'ladi. Pool'ni nil qoldirish esa tizim root'larini yoqadi, shuning uchun bo'sh pool aniq berilgan.
    - `ServerName` host nomi tekshiruvini (SAN bo'yicha) va SNI'ni boshqaradi. Tekshiruv nomi URL'dagi host emas, aynan shu qiymat bo'lishi kerak bo'lganda ishlatiladi.
    - `httptest.NewTLSServer` sertifikati `example.com` va `127.0.0.1` uchun berilgan, shuning uchun "example.com" mos keladi, "api.other.test" esa `x509.HostnameError` beradi.
    - `errors.As` bilan xato turini ajratish xato matni bo'yicha qidirishdan ishonchli.
    - Yechim `go run` bilan tekshirildi; server logiga `bad certificate` handshake xabarlari stderr'ga yoziladi, bu kutilgan holat.
  checklist:
    - "`InsecureSkipVerify` ishlatilmagan"
    - "`RootCAs` faqat `trusted` sertifikatni o'z ichiga oladi (nil bo'lsa bo'sh pool)"
    - "`ServerName` bo'yicha host nomi tekshiriladi"
    - "`MinVersion` TLS 1.2"
    - "Natijada mos kelmagan nom va ishonchsiz sertifikat rad etiladi"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Avtopark platformasida trafik ikki turga bo'linadi: brauzer va mobil ilovadan keluvchi tashqi trafik, hamda servislar orasidagi ichki trafik. Tashqi trafikni TLS shifrlaydi, bu hamma biladi. Ichki tarmoqda esa ko'pincha "bu yer xavfsiz" deb ochiq HTTP ishlatiladi. Qurilma parki kengayganda (minglab trekerlar), ichki servislar ko'p tarmoqqa tarqalganda va ma'lumot mijozlar uchun maxfiy bo'lganda, bu taxmin ishlamay qoladi.

Go'dagi TLS bilan ishlaganda ikki xil og'riq uchraydi. Birinchisi: xatoni "yo'qotish". Sertifikat xatosi chiqdi, kimdir `InsecureSkipVerify: true` qo'ydi, xato ketdi, himoya ham ketdi. Bu qator keyingi 3 yil kodda qoladi. Ikkinchisi: autentifikatsiya va avtorizatsiyani aralashtirish. mTLS ulangan tomonning kimligini kriptografik isbotlaydi, lekin u nima qila olishini hal qilmaydi.

Uchinchi qatlam: versiyalar. Go jamoasi TLS default'larini har release'da qat'iylashtiradi (minimal versiya, eskirgan shifrlar, post-quantum kalit almashuvi). Servis sizning o'zgartirishingizsiz boshqacha ishlay boshlaydi. Bu dars TLS'ning Go'dagi modelini, mTLS'ni va shu o'zgarishlarni qamrab oladi.

## Asosiy g'oya

### tls.Config: ikki tomon

`tls.Config` server va client uchun umumiy struct. Muhim maydonlar:

| Maydon | Kim ishlatadi | Vazifasi |
|---|---|---|
| `Certificates` | server (va mTLS client) | o'z sertifikati va private key |
| `GetCertificate` | server | har handshake'da sertifikat tanlash/yangilash (SNI bo'yicha ham) |
| `GetClientCertificate` | client | server so'raganda klient sertifikatini tanlash |
| `RootCAs` | client | serverni tekshirish uchun ishonchli CA'lar (nil bo'lsa tizim root'lari) |
| `ServerName` | client | host nomi tekshiruvi va SNI |
| `ClientAuth`, `ClientCAs` | server | klient sertifikati siyosati va ishonchli CA'lar |
| `MinVersion` | ikkala | minimal TLS versiyasi |
| `InsecureSkipVerify` | client | zanjir va host nomi tekshiruvini o'chiradi (ishlatilmaydi) |

Tekshiruv uchta narsani qamraydi: sertifikat zanjiri ishonchli root'ga boradimi, host nomi sertifikatning SAN ro'yxatidagi nomga mosmi, va muddat hamda maqsad (extended key usage: server uchun ServerAuth, klient uchun ClientAuth) to'g'rimi. Zamonaviy tekshiruv host nomini Subject CN emas, SAN bo'yicha qiladi.

### mTLS: ikki tomonlama autentifikatsiya

Oddiy TLS'da faqat server o'zini isbotlaydi. mTLS'da klient ham sertifikat ko'rsatadi. Server tomonda `ClientAuth` siyosati beshta qiymatdan biri:

- `NoClientCert`: klient sertifikati so'ralmaydi;
- `RequestClientCert`: so'raladi, lekin majburiy emas va tekshirilmaydi;
- `RequireAnyClientCert`: majburiy, lekin zanjir tekshirilmaydi;
- `VerifyClientCertIfGiven`: berilsa tekshiriladi, berilmasa o'tadi;
- `RequireAndVerifyClientCert`: majburiy va `ClientCAs` bo'yicha tekshiriladi.

Production uchun faqat oxirgisi mTLS hisoblanadi. Handshake'dan keyin handler `r.TLS.PeerCertificates[0]` orqali klient sertifikatini ko'radi. Shu yerda avtorizatsiya boshlanadi: sertifikat "bu tracker-0042" deydi, "tracker-0042 shu buyruqni bajara oladimi" esa siyosat savoli. Identifikator uchun SAN (DNS yoki URI, masalan SPIFFE ID) afzal.

### Sertifikatni yangilash

Qisqa muddatli sertifikat xavfsizlikni oshiradi, lekin yangilash jarayonini avtomatlashtirishni talab qiladi. `tls.Config.GetCertificate` har handshake'da chaqiriladi, shuning uchun u `atomic.Pointer[tls.Certificate]` dan joriy qiymatni qaytarsa, serverni qayta ishga tushirmasdan almashtirish mumkin. Klient tomonda xuddi shu g'oya `GetClientCertificate` bilan.

## Chuqurroq: qaysi tekshiruvlar yo'q va versiyalar

### Go nimani tekshirmaydi

- `crypto/tls` default tekshiruvi sertifikat bekor qilinganini (CRL, OCSP) tekshirmaydi. Bu kerak bo'lsa, `VerifyConnection` yoki `VerifyPeerCertificate` callback'larida o'zingiz qo'shasiz, yoki qisqa muddatli sertifikatlarga o'tasiz.
- Go 1.21 release notes: server tiklangan (resumed) ulanishlarda klient sertifikatini qayta tekshirmaydi, `Config.VerifyPeerCertificate` ham chaqirilmaydi, faqat muddat tekshiriladi. Ya'ni bekor qilingan sertifikat ticket muddati tugaguncha ishlashda davom etishi mumkin. Bekor qilish tezligi muhim bo'lsa, ticket'larni o'chirish, qisqa ticket muddati yoki qisqa muddatli sertifikatlar tanlanadi.

### Default versiyalar va xavfsizlik o'zgarishlari

Release notes bo'yicha:

- Go 1.23: klient tomonda Encrypted Client Hello qo'llab-quvvatlandi; 3DES shifrlari default ro'yxatdan olib tashlandi.
- Go 1.24: server tomonda ECH; post-quantum gibrid kalit almashuvi X25519MLKEM768 `CurvePreferences` nil bo'lganda default yoqildi. Uni `GODEBUG=tlsmlkem=0` qaytaradi. Release notes shuni ham qayd etadi: bu foydali bo'lishi mumkin, chunki katta yozuvlarni noto'g'ri qayta ishlaydigan serverlar handshake timeout berishi mumkin. Shuningdek `CurvePreferences` tartibi endi e'tiborga olinmaydi, u faqat qaysi almashuvlar yoqilishini belgilaydi.
- Go 1.25: TLS 1.2 handshake'larda SHA-1 imzo algoritmlari taqiqlandi (`tlssha1=1` bilan qaytariladi); server eng yuqori qo'llab-quvvatlanadigan versiyani afzal ko'radi; yangi `ConnectionState.CurveID` qaysi almashuv ishlatilganini ko'rsatadi.
- Go 1.26: gibrid `SecP256r1MLKEM768` va `SecP384r1MLKEM1024` default yoqildi (`tlssecpmlkem=0` yoki `CurvePreferences` bilan o'chiriladi). Release notes ogohlantirdi: Go 1.22 va 1.23 da kiritilgan `tlsunsafeekm`, `tlsrsakex`, `tls10server`, `tls3des`, `x509keypairleaf` sozlamalari keyingi major release'da olib tashlanadi.
- Go 1.27: ogohlantirilgandek, shu besh sozlama butunlay olib tashlandi. Demak, default minimal versiya (TLS 1.2), RSA-only kalit almashuvining o'chirilgani, 3DES yo'qligi va `X509KeyPair` `Leaf`ni to'ldirishi endi GODEBUG yoki go.mod versiyasidan qat'i nazar qo'llanadi. Yangi `ConnectionState.LocalCertificate` maydoni handshake'da peer'ga ko'rsatilgan zanjirni beradi; `Config.Rand` deprecated bo'ldi.

Bu ro'yxatdagi 1.25-1.27 xususiyatlari sandbox'da (Go 1.24) kompilyatsiya qilinmadi, matn release notes'ga tayanadi. Amaliy xulosa: toolchain yangilashda TLS bilan ishlaydigan servislar uchun integratsiya testini (haqiqiy peer'lar bilan) alohida o'tkazing, ayniqsa eski qurilmalar va korporativ firewall ortidagi peer'lar bilan.

### Shifrlar va versiyalar sozlamasi

TLS 1.3 shifrlari sozlanmaydi. `CipherSuites` faqat TLS 1.2 ga ta'sir qiladi. Ko'pchilik servis uchun to'g'ri tanlov: `MinVersion: tls.VersionTLS12` (yoki sizning peer'laringiz hammasi TLS 1.3 ni bilsa, 1.3), qolganini Go default'iga qoldirish. Default'lar xavfsizlik jamoasi tomonidan yangilab turiladi, qo'lda yozilgan ro'yxat esa eskiradi.

## Misol: o'zi imzolagan CA bilan mTLS

Quyidagi dastur bitta jarayonda CA yaratadi, undan server va qurilma sertifikatlarini chiqaradi, boshqa CA'dan "begona" va muddati o'tgan sertifikat ham yasaydi, so'ng to'rt xil klientni sinaydi:

```go
package main

import (
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"crypto/tls"
	"crypto/x509"
	"crypto/x509/pkix"
	"fmt"
	"io"
	"log"
	"math/big"
	"net"
	"net/http"
	"net/http/httptest"
	"time"
)

type identity struct {
	cert tls.Certificate
	leaf *x509.Certificate
}

func newKey() *ecdsa.PrivateKey {
	k, err := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
	if err != nil {
		panic(err)
	}
	return k
}

// issue shablon bo'yicha sertifikat chiqaradi; parent nil bo'lsa o'zi imzolaydi (CA).
func issue(tmpl *x509.Certificate, parent *identity) identity {
	key := newKey()
	signerCert, signerKey := tmpl, key
	if parent != nil {
		signerCert, signerKey = parent.leaf, parent.cert.PrivateKey.(*ecdsa.PrivateKey)
	}
	der, err := x509.CreateCertificate(rand.Reader, tmpl, signerCert, &key.PublicKey, signerKey)
	if err != nil {
		panic(err)
	}
	leaf, _ := x509.ParseCertificate(der)
	return identity{cert: tls.Certificate{Certificate: [][]byte{der}, PrivateKey: key, Leaf: leaf}, leaf: leaf}
}

func template(serial int64, cn string) *x509.Certificate {
	return &x509.Certificate{
		SerialNumber: big.NewInt(serial),
		Subject:      pkix.Name{CommonName: cn},
		NotBefore:    time.Now().Add(-time.Minute),
		NotAfter:     time.Now().Add(time.Hour),
		KeyUsage:     x509.KeyUsageDigitalSignature,
	}
}

func main() {
	caT := template(1, "demo-ca")
	caT.IsCA, caT.BasicConstraintsValid = true, true
	caT.KeyUsage = x509.KeyUsageCertSign
	ca := issue(caT, nil)

	srvT := template(2, "telemetry-api")
	srvT.ExtKeyUsage = []x509.ExtKeyUsage{x509.ExtKeyUsageServerAuth}
	srvT.DNSNames, srvT.IPAddresses = []string{"localhost"}, []net.IP{net.ParseIP("127.0.0.1")}
	server := issue(srvT, &ca)

	devT := template(3, "tracker-0042")
	devT.ExtKeyUsage = []x509.ExtKeyUsage{x509.ExtKeyUsageClientAuth}
	device := issue(devT, &ca)

	// Boshqa CA: xizmat ko'rsatuvchi ishonmaydigan tashkilot.
	otherT := template(10, "other-ca")
	otherT.IsCA, otherT.BasicConstraintsValid = true, true
	otherT.KeyUsage = x509.KeyUsageCertSign
	other := issue(otherT, nil)
	strangerT := template(11, "stranger")
	strangerT.ExtKeyUsage = []x509.ExtKeyUsage{x509.ExtKeyUsageClientAuth}
	stranger := issue(strangerT, &other)

	oldT := template(12, "tracker-0007")
	oldT.ExtKeyUsage = []x509.ExtKeyUsage{x509.ExtKeyUsageClientAuth}
	oldT.NotBefore, oldT.NotAfter = time.Now().Add(-2*time.Hour), time.Now().Add(-time.Hour)
	expired := issue(oldT, &ca)

	pool := x509.NewCertPool()
	pool.AddCert(ca.leaf)

	srv := httptest.NewUnstartedServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		peer := r.TLS.PeerCertificates[0]
		fmt.Fprintf(w, "salom, %s", peer.Subject.CommonName)
	}))
	srv.TLS = &tls.Config{
		Certificates: []tls.Certificate{server.cert},
		ClientAuth:   tls.RequireAndVerifyClientCert,
		ClientCAs:    pool,
		MinVersion:   tls.VersionTLS13,
	}
	srv.Config.ErrorLog = log.New(io.Discard, "", 0)
	srv.StartTLS()
	defer srv.Close()

	try := func(name string, certs []tls.Certificate, roots *x509.CertPool) {
		c := &http.Client{Transport: &http.Transport{TLSClientConfig: &tls.Config{
			Certificates: certs, RootCAs: roots, MinVersion: tls.VersionTLS12,
		}}}
		resp, err := c.Get(srv.URL)
		if err != nil {
			fmt.Printf("%-28s xato: %v\n", name, err)
			return
		}
		defer resp.Body.Close()
		b, _ := io.ReadAll(resp.Body)
		fmt.Printf("%-28s %d %q (TLS %x, ALPN %q)\n", name, resp.StatusCode, b, resp.TLS.Version, resp.TLS.NegotiatedProtocol)
	}
	try("to'g'ri sertifikat:", []tls.Certificate{device.cert}, pool)
	try("klient sertifikatsiz:", nil, pool)
	try("begona CA sertifikati:", []tls.Certificate{stranger.cert}, pool)
	try("muddati o'tgan sertifikat:", []tls.Certificate{expired.cert}, pool)
	try("server CA'siga ishonmaydi:", []tls.Certificate{device.cert}, nil)
}
```

Chiqish (Go 1.24.7). Server porti har ishga tushirishda o'zgaradi:

```text
to'g'ri sertifikat:          200 "salom, tracker-0042" (TLS 304, ALPN "")
klient sertifikatsiz:        xato: Get "https://127.0.0.1:43781": remote error: tls: certificate required
begona CA sertifikati:       xato: Get "https://127.0.0.1:43781": remote error: tls: certificate required
muddati o'tgan sertifikat:   xato: Get "https://127.0.0.1:43781": remote error: tls: expired certificate
server CA'siga ishonmaydi:   xato: Get "https://127.0.0.1:43781": tls: failed to verify certificate: x509: certificate signed by unknown authority
```

Nima uchun shunday:

- Birinchi holatda handshake TLS 1.3 da o'tdi (`304` TLS versiyasining kodi 0x0304). Handler klient sertifikatidan `tracker-0042` nomini o'qidi.
- Sertifikatsiz klient `certificate required` oldi: server `RequireAndVerifyClientCert` bilan sertifikatni talab qildi.
- Begona CA sertifikatida ham xuddi shu xato chiqdi, `bad certificate` emas. Sabab: server o'ziga ishonchli CA nomlarini yuboradi, Go client mos sertifikat topmagach hech narsa yubormaydi. Server tomonda bu "sertifikat taqdim etilmadi" ko'rinishida.
- Muddati o'tgan sertifikat to'g'ri CA'dan, shuning uchun client uni yubordi va server tekshiruvda `expired certificate` alert bilan rad etdi.
- Oxirgi holatda client server CA'siga ishonmaydi: xato klient tomonda, `x509: certificate signed by unknown authority`.

Server qismida `httptest.NewUnstartedServer`, `srv.TLS` ga mTLS konfiguratsiyasi, `srv.StartTLS()` ishlatildi. `ErrorLog` `io.Discard` ga yo'naltirildi, aks holda server o'z stderr'iga handshake xatolarini yozadi.

Sertifikatni qayta ishga tushirmasdan almashtirish shabloni (stdlib, kompilyatsiya qilingan, fayllar bo'lmagani uchun `reload` xato qaytaradi):

```go
package main

import (
	"crypto/tls"
	"fmt"
	"log"
	"sync/atomic"
	"time"
)

// certStore sertifikatni diskdan o'qib, atomik almashtiradi: serverni qayta ishga tushirmasdan yangilash.
type certStore struct {
	certFile, keyFile string
	current           atomic.Pointer[tls.Certificate]
}

func (s *certStore) reload() error {
	c, err := tls.LoadX509KeyPair(s.certFile, s.keyFile)
	if err != nil {
		return err // eski sertifikat ishlashda qoladi
	}
	s.current.Store(&c)
	return nil
}

// GetCertificate har handshake'da chaqiriladi va joriy sertifikatni qaytaradi.
func (s *certStore) GetCertificate(*tls.ClientHelloInfo) (*tls.Certificate, error) {
	return s.current.Load(), nil
}

func (s *certStore) watch(every time.Duration) {
	for range time.Tick(every) {
		if err := s.reload(); err != nil {
			log.Printf("sertifikatni yangilab bo'lmadi: %v", err)
		}
	}
}

func main() {
	store := &certStore{certFile: "server.crt", keyFile: "server.key"}
	err := store.reload()
	fmt.Println("fayl yo'q bo'lsa reload xatosi:", err != nil)
	cfg := &tls.Config{
		GetCertificate: store.GetCertificate,
		MinVersion:     tls.VersionTLS12,
	}
	fmt.Println("MinVersion TLS 1.2:", cfg.MinVersion == tls.VersionTLS12)
}
```

```text
fayl yo'q bo'lsa reload xatosi: true
MinVersion TLS 1.2: true
```

Dastur ishga tushganda birinchi `reload` muvaffaqiyatli bo'lishi shart (aks holda `GetCertificate` nil qaytaradi); fon yangilashi xatoda eski sertifikatni saqlab qoladi va log yozadi.

## Qachon qo'llamaslik kerak

- Har servis orasiga qo'lda boshqariladigan mTLS qo'ymang. Sertifikat chiqarish, aylantirish va bekor qilish infratuzilmasi (service mesh, SPIFFE/SPIRE, ichki CA, qisqa muddatli sertifikatlar) bo'lmasa, muddati o'tgan sertifikat tufayli yiqilgan servislar ko'payadi.
- `InsecureSkipVerify: true` ni production kodida qoldirmang. Test uchun `httptest.NewTLSServer` va `srv.Client()` yoki `srv.Certificate()` dan `RootCAs` yasash yetarli.
- `CipherSuites` va `CurvePreferences` ni qo'lda yozmang, ehtiyoj aniq bo'lmasa (masalan, muvofiqlik talabi). Qo'lda yozilgan ro'yxat yangilanmaydi, Go default'lari esa yangilanib boradi.
- Sertifikat pinning'ni (aniq sertifikatga bog'lash) ehtiyotsiz qo'llamang: yangilash paytida servislar uzilib qoladi.
- mTLS'ni avtorizatsiya o'rnida ishlatmang: u faqat kimligini isbotlaydi.
- Go 1.27 da olib tashlangan GODEBUG sozlamalariga (`tls10server`, `tlsrsakex`, `tls3des` va boshqalar) tayanmang: eski peer'lar uchun ularni qaytarib bo'lmaydi, peer'ni TLS 1.2 va ECDHE bilishiga yangilash kerak.

## Stack'da: Node.js/TypeScript bilan solishtirish

Node.js'da `https.createServer({ key, cert, ca, requestCert: true, rejectUnauthorized: true })` mTLS beradi, klientda `rejectUnauthorized: false` Go'dagi `InsecureSkipVerify` ning o'zi. Go'da farq: Subject va SAN, zanjir, muddat va maqsad tekshiruvlari standart kutubxonada bir joyda, va `r.TLS.PeerCertificates` handler'da tayyor turadi. NestJS'da guard ichida `req.socket.getPeerCertificate()` qilgan bo'lardingiz.

Servis uchun andoza:

- Server: `MinVersion`, `GetCertificate` (yangilanuvchi), mTLS kerak bo'lsa `RequireAndVerifyClientCert` + `ClientCAs`.
- Klient: `RootCAs` (kerakli CA'lar), `ServerName`, `MinVersion`; `InsecureSkipVerify` yo'q.
- Handler: identifikatorni SAN'dan oling, keyin avtorizatsiya siyosatini alohida tekshiring.
- Toolchain yangilashdan keyin: haqiqiy peer'lar bilan handshake integratsiya testi va `GODEBUG` hisoblagichlari (`/godebug/non-default-behavior/...` metrikalari, 60-dars).
- Sertifikat muddatini monitoring qiling: muddat tugashidan 2 hafta oldin ogohlantirish.

## Xulosa

- `tls.Config` ni aniq yozing: server uchun `Certificates` yoki `GetCertificate`, klient uchun `RootCAs` va `ServerName`; `InsecureSkipVerify` himoyani o'chiradi.
- mTLS uchun serverda `RequireAndVerifyClientCert` va `ClientCAs` kerak; boshqa `ClientAuth` qiymatlari sertifikatni majburiy tekshirmaydi. mTLS autentifikatsiya beradi, avtorizatsiyani alohida yozasiz.
- Lokal sinovda begona CA, muddati o'tgan va ishonchsiz server holatlari har xil xato berdi: `certificate required`, `expired certificate`, `unknown authority`.
- Go bekor qilingan sertifikatni o'zi tekshirmaydi, tiklangan ulanishlarda esa klient sertifikatini qayta tekshirmaydi (Go 1.21); qisqa muddatli sertifikatlar bu muammoni yengillashtiradi.
- Default'lar release'lar bilan o'zgaradi: Go 1.24 da X25519MLKEM768, 1.26 da yana ikki gibrid, 1.27 da beshta GODEBUG sozlamasi o'chdi. TLS servislarini toolchain yangilashdan keyin integratsiya testi bilan tekshiring.
