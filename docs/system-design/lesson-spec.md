# Dars yozish standarti

Bu fayl har bir darsni yozuvchi uchun majburiy qo'llanma. Namuna: `content/system-design/001.md` va `content/system-design/001.quiz.json` - uslub, chuqurlik va tuzilmani shulardan oling.

## O'quvchi

Backend yoki full-stack tajribasi bor dasturchi: HTTP, SQL va kamida bitta backend tilini biladi (`course.yaml` dagi `audience`).
Darajasi yuqori - asoslarni "bolalarcha" tushuntirmang, lekin hech narsani o'tkazib yubormang: kurs maqsadi - chuqur va to'liq o'rganish. Ichki mexanikaga, raqamlarga va trade-offlarga e'tibor bering.

## Fayllar

- `content/system-design/NNN.md` (NNN - uch xonali raqam, masalan `014.md`)
- `content/system-design/NNN.quiz.json`
- Mavzu nomi `content/system-design/course.yaml` dagi nom bilan bir xil bo'lsin (frontmatter `title`).

Frontmatter:

```
---
title: "<course.yaml dagi nom>"
minutes: <30-60>
---
```

## Til va uslub

- O'zbek tili, lotin yozuvi. Apostrof uchun oddiy `'` (o', g', ma'lumot).
- Texnik terminlar inglizcha qoladi (replication, sharding, consensus, cache, throughput). Birinchi uchraganda qisqa o'zbekcha izoh berish mumkin.
- **Em-dash (—) va en-dash (–) TAQIQLANADI.** Faqat oddiy "-" ishlating. Bu qat'iy talab.
- Emoji yo'q. Maqtov va "suv" yo'q. To'g'ridan-to'g'ri, aniq, zich matn.
- Sarlavhalar `##` (bo'limlar) va `###` (bo'lim ichida). `#` ishlatmang - sahifa sarlavhasi frontmatterdan chiqadi.

## Majburiy tuzilma (bo'lim nomlari shunday yoki juda yaqin)

1. `## Bu dars nima uchun kerak` - muammo va motivatsiya, oldingi darslar bilan bog'liqlik, darsdan keyin o'quvchi nimani bila olishi (ro'yxat).
2. Asosiy nazariya bo'limlari (3-7 ta `##`) - ichki mexanika qanday ishlaydi, bosqichma-bosqich. Algoritm bo'lsa - qadamlari. Formula bo'lsa - misol bilan hisoblang.
3. Kamida bitta **trade-off jadvali** yoki taqqoslash jadvali (markdown table).
4. Kamida bitta **mermaid diagramma** (flowchart, sequenceDiagram yoki stateDiagram-v2). Qoidalar pastda.
5. **Real tizimlardan misol(lar)**: qaysi kompaniya/texnologiya buni qanday qiladi (PostgreSQL, Kafka, Cassandra, DynamoDB, Redis, Google, Netflix, Uber, Discord, Cloudflare va h.k.) - faqat manbada tasdiqlangan faktlar.
6. **Raqamlar / hisob-kitob** - mavzuga mos (latency, hajm, throughput, narx). Hisoblarni ochiq ko'rsating.
7. `## Amaliyotda` - mavzu kurs bo'ylab takrorlanuvchi o'quv misolida (avtopark monitoring platformasi: telemetriya, video, yoqilg'i) qanday ishlatiladi. Misol va nomlash qoidalari: `docs/system-design/case-study.md`. Real kompaniya nomlari ishlatilmaydi.
8. `## Ko'p uchraydigan xatolar` - 5-8 ta.
9. `## Xulosa` - 5-8 ta qisqa band.
10. `## Amaliy topshiriq` - real, o'ylashni talab qiladigan dizayn/hisob topshirig'i (imkon qadar shu o'quv misolida), 4-6 ta aniq qadam. Oxirida "Yaxshi javobda bo'lishi kerak bo'lgan narsalar:" ro'yxati (baholash mezonlari). Oxirgi gap: "Javobingizni pastdagi maydonga yozing va yuqoridagi mezonlar bilan solishtiring."
11. `## Manbalar` - 4-8 ta manba, markdown havola bilan. Har birida qaysi bob/bo'lim ekanini yozing.

Hajm: 2500-5000 so'z. Sifat hajmdan muhim, lekin yuzaki bo'lmasin.

Boshqa darslarga havola: "(23-dars)" ko'rinishida, raqamlar `content/system-design/course.yaml` bo'yicha. Oldingi darslarda o'tilgan narsani qisqa eslatib, havola bering; keyingi darsda chuqur o'tiladigan narsani "N-darsda chuqur ko'riladi" deb belgilang.

## Manbalar va faktlar

- Har bir aniq fakt, raqam, versiya, tarixiy da'vo **WebSearch/WebFetch orqali tekshirilgan** bo'lsin. Xotiradan raqam yozmang, avval tekshiring.
- Havolalar haqiqiy va ishlaydigan bo'lsin - faqat qidiruvda yoki fetch'da ko'rgan URL'lar.
- Ustuvor manbalar: Kleppmann "Designing Data-Intensive Applications" 2-nashr (O'Reilly, 2026; 1-nashr 2017), Petrov "Database Internals", Vitillo "Understanding Distributed Systems", Google SRE book (sre.google), Alex Xu "System Design Interview" 1-2, MIT 6.5840, asl ilmiy maqolalar (Dynamo, Bigtable, Spanner, Raft, Paxos Made Simple, MapReduce, GFS, Kafka, Zanzibar, Chubby va h.k.), rasmiy hujjatlar (PostgreSQL, Kafka, Redis, Kubernetes, AWS, RFC'lar), kompaniya muhandislik bloglari, AWS Builders' Library, Jepsen, Martin Fowler.
- Mualliflik huquqi: manbadan uzun iqtibos keltirmang. Faqat o'z so'zingiz bilan qayta bayon qiling. Agar iqtibos shart bo'lsa - 15 so'zdan kam va bitta manbadan bittadan ko'p emas.
- Ishonchingiz komil bo'lmagan faktni yozmang yoki "taxminan", "manbalarga ko'ra" deb aniq belgilang.

## Mermaid qoidalari (sayt buzilmasligi uchun)

- Faqat ```` ```mermaid ```` bloki ichida.
- Tugun matnini doim qo'shtirnoqqa oling: `A["Ingest gateway (TCP)"]`, `Q[("Navbat")]`, `D{"Lider bormi?"}`.
- Tugun matni ichida qo'shtirnoq `"` , `;`, `#`, `<`, `>` ishlatmang. Apostrof `'` mumkin.
- Strelka yozuvlari: `A -->|"matn"| B`.
- sequenceDiagram da xabar matnida `;` va `#` ishlatmang.
- Diagramma 15 tugundan oshmasin.

## Test fayli (`NNN.quiz.json`)

```json
{
  "passScore": 0.8,
  "questions": [
    { "q": "Savol?", "options": ["A", "B", "C", "D"], "answer": 1, "why": "Nega to'g'ri - qisqa izoh." }
  ]
}
```

- Aniq 10 ta savol, har birida 4 ta variant, `answer` - 0 dan boshlanadigan indeks.
- Savollar yodlashni emas, tushunishni tekshirsin: stsenariy, hisob-kitob, "nima bo'ladi agar", trade-off tanlash. Kamida 2 ta hisob-kitob yoki stsenariy savoli.
- Noto'g'ri variantlar ishonarli bo'lsin (keng tarqalgan xato tushunchalar).
- `why` - 1-2 gap, nega to'g'ri javob to'g'ri.
- JSON valid bo'lsin, em-dash yo'q.

## Tekshirish (yozib bo'lgach o'zingiz bajaring)

```bash
node -e 'const f=process.argv[1];const q=JSON.parse(require("fs").readFileSync(f,"utf8"));if(q.questions.length!==10)throw "10 emas";q.questions.forEach((x,i)=>{if(x.options.length!==4||x.answer<0||x.answer>3)throw "savol "+i})' content/system-design/NNN.quiz.json
grep -n "[—–]" content/system-design/NNN.md content/system-design/NNN.quiz.json   # hech narsa chiqmasligi kerak
```
