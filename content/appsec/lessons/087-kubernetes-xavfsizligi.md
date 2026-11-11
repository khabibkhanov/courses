---
n: 87
slug: kubernetes-xavfsizligi
title: "Kubernetes xavfsizligi asoslari"
summary: "Pod Security Standards (privileged, baseline, restricted) va Pod Security Admission rejimlari, securityContext, RBAC va service account token'lari, Secret'lar va etcd, network policy: nima default'da ochiq va uni qanday yopish."
duration: 50
sources:
  - id: k8s-pss
    note: "Pod Security Standards: uch profil (Privileged, Baseline, Restricted); Baseline privileged konteyner, host namespace va hostPath'ni taqiqlaydi; Restricted allowPrivilegeEscalation=false, runAsNonRoot, seccomp, capability drop ALL va cheklangan hajm turlarini talab qiladi"
  - id: k8s-pod-api
    note: "Pod v1 API reference, runAsNonRoot: true bo'lsa kubelet image'ni ishga tushirish paytida UID 0 emasligini tekshiradi va 0 bo'lsa konteynerni ishga tushirmaydi; qiymat berilmagan yoki false bo'lsa tekshiruv yo'q; SecurityContext va PodSecurityContext ikkalasida berilsa SecurityContext (konteyner) ustun; runAsUser berilmasa image metadata'dagi foydalanuvchi ishlatiladi"
  - id: kubelet-kuberuntime-container
    note: "kubelet manba kodi (kuberuntime_container.go, generateContainerConfig): getImageUser natijasi bilan verifyRunAsNonRoot chaqiriladi, oldidagi izoh 'Non-root verification only supports numeric user'"
  - id: kubelet-security-context
    note: "kubelet manba kodi (security_context_others.go, verifyRunAsNonRoot): runAsNonRoot yoqilgan bo'lsa runAsUser 0 rad etiladi; samarali runAsNonRoot nil yoki false bo'lsa tekshiruv yo'q; samarali runAsUser 0 bo'lsa container's runAsUser breaks non-root policy, boshqa qiymatda image'ga qaralmaydi; runAsUser yo'q bo'lsa image foydalanuvchisi: nom bo'lib UID yo'q bo'lsa 'container has runAsNonRoot and image has non-numeric user (%s), cannot verify user is non-root', UID 0 bo'lsa 'container has runAsNonRoot and image will run as root' (hammasi oxirida '(pod: %q, container: %s)'); konteyner qiymati pod qiymatini maydon bo'yicha bosadi (pkg/securitycontext/util.go, DetermineEffectiveSecurityContext); 2026-11-11 da sparse clone'dan o'qildi"
  - id: k8s-psa
    note: "Pod Security Admission: namespace label'lari pod-security.kubernetes.io/<MODE>: <LEVEL>, rejimlar enforce, audit, warn; enforce workload resource'larga emas, hosil bo'lgan pod'larga qo'llanadi; istisnolar"
  - id: k8s-secrets-practices
    note: "Kubernetes Secrets good practices: default holatda Secret'lar etcd'da shifrlanmagan, encryption at rest sozlanadi; Secret'larga list ruxsati kontentni olish imkonini beradi; minimal huquq"
  - id: k8s-rbac-practices
    note: "RBAC good practices: namespace darajasida RoleBinding, wildcard'dan qochish, cluster-admin'dan qochish, system:masters, automountServiceAccountToken: false"
  - id: cs-k8s
    note: "OWASP Kubernetes Security Cheat Sheet: etcd'ga yozuv ruxsati cluster root'iga teng, NetworkPolicy default'da pod'lar izolyatsiyalanmagan, build/deploy/runtime bosqichlari"
  - id: t10-a02
    note: "A02:2025 Security Misconfiguration: bulut va platforma sozlamalari, takrorlanuvchi hardening, komponentlar/tenant'lar segmentatsiyasi"
quiz:
  - q: "Namespace'ga faqat `pod-security.kubernetes.io/warn: restricted` label'i qo'yildi. Privileged konteynerli pod yaratilsa nima bo'ladi?"
    options:
      - "Pod qabul qilinadi, foydalanuvchiga ogohlantirish chiqadi"
      - "Pod rad etiladi"
      - "Pod qabul qilinadi va audit logga annotatsiya yoziladi, ogohlantirish yo'q"
      - "Namespace o'chiriladi"
    answer: 0
    explain: "warn rejimi buzilishda foydalanuvchiga ogohlantirish ko'rsatadi, lekin pod'ga ruxsat beradi. Rad etish faqat enforce rejimida; audit esa audit log annotatsiyasi uchun."
  - q: "Deployment yaratildi, namespace'da enforce: restricted. Deployment shabloni restricted'ga mos kelmaydi. Nima rad etiladi?"
    options:
      - "Deployment'ning o'zi yaratilishda rad etiladi"
      - "Deployment yaratiladi, lekin controller yaratadigan pod'lar enforce tufayli rad etiladi; audit va warn esa workload resource'larga ham qo'llanadi"
      - "Hech narsa: enforce Deployment bilan ishlamaydi"
      - "Faqat service account o'chadi"
    answer: 1
    explain: "Hujjatga ko'ra enforce workload resource'larga emas, hosil bo'lgan pod obyektlariga qo'llanadi; audit va warn xatoni erta ko'rsatish uchun workload resource'larga ham qo'llanadi. Natijada Deployment yaratiladi-yu, pod'lar paydo bo'lmaydi."
  - q: "Restricted profil `capabilities.drop` uchun nimani talab qiladi?"
    options:
      - "Hech narsani"
      - "Faqat NET_RAW tashlansin"
      - "ALL tashlansin; qaytarib faqat NET_BIND_SERVICE qo'shilishi mumkin"
      - "Barcha capability'lar qo'shilsin"
    answer: 2
    explain: "Restricted: konteynerlar barcha capability'larni tashlashi shart, qaytarib faqat NET_BIND_SERVICE ruxsat etiladi. 86-darsdagi `--cap-drop ALL` ning Kubernetes ko'rinishi."
  - q: "Jamoa tashqi tizimga kirish uchun bir servis hisobiga `list secrets` ruxsati berdi, 'faqat ro'yxat, get yo'q' deb. Nima uchun bu yetarli emas?"
    options:
      - "list faqat nomlarni qaytaradi, shuning uchun xavfsiz"
      - "list ruxsati Secret'larning kontentini ham olish imkonini beradi"
      - "list faqat etcd'ga ta'sir qiladi"
      - "list RBAC'da mavjud emas"
    answer: 1
    explain: "Kubernetes hujjati ogohlantiradi: Secret'larga list ruxsati sub'ektga ularning mazmunini olish imkonini beradi. Shuning uchun watch/list ham get kabi sezgir huquq."
  - q: "NetworkPolicy resursi yaratildi, lekin klasterda NetworkPolicy'ni qo'llaydigan network plugin yo'q. Natija?"
    options:
      - "Pod'lar baribir izolyatsiyalanadi"
      - "Barcha trafik bloklanadi"
      - "API server policy'ni rad etadi"
      - "Policy hech narsa qilmaydi: resurs yaratish yetarli emas, plugin uni enforce qilishi kerak"
    answer: 3
    explain: "OWASP cheat sheet: plugin enforce qilmasa, resurs ta'sirsiz. Default holatda pod'lar ingress va egress uchun izolyatsiyalanmagan, shuning uchun policy'ni har yo'nalish uchun alohida yozish va enforcement'ni tekshirish kerak."
  - q: "Ilova Kubernetes API bilan gaplashmaydi, lekin pod'ga service account token avtomatik ulangan. Nima qilish kerak?"
    options:
      - "Hech narsa: token foydasiz"
      - "automountServiceAccountToken: false qo'yish; kerak bo'lgan workload'lar tokenni alohida ulaydi"
      - "Tokenni env'ga ko'chirish"
      - "Cluster-admin berish"
    answer: 1
    explain: "Default holatda Kubernetes pod'ga tayinlangan ServiceAccount credential'larini beradi. Ilova API'ni ishlatmasa, ularni ulamaslik hujumchi RCE olgan holda API'ga kirishini oldini oladi."
task:
  title: "Restricted profil tekshiruvi"
  prompt: |
    `violations(pod)` Pod Security Standards bo'yicha pod buzilishlari ro'yxatini qaytaradi. Hozir faqat Baseline'ning bir qismi (hostNetwork, hostPath, privileged) tekshiriladi.

    Har konteyner uchun Restricted qoidalarini qo'shing:
    1. `allowPrivilegeEscalation` aniq `false` bo'lishi shart.
    2. `runAsNonRoot` `true` bo'lishi shart (konteyner qiymati yo'q bo'lsa, pod darajasidagisi hisobga olinadi).
    3. `runAsUser` `0` bo'lmasin.
    4. `seccomp` faqat `RuntimeDefault` yoki `Localhost` bo'lsin.
    5. `capDrop` ichida `ALL` bo'lsin; `capAdd` faqat `NET_BIND_SERVICE` ni o'z ichiga olsin.

    Kutilgan chiqish: `insecure` 6 buzilish, `baselineOnly` 4 buzilish, `restrictedPod` `restricted: OK`, `rootUser` 4 buzilish.
  lang: ts
  starter: |
    type Container = {
      name: string; privileged?: boolean; allowPrivilegeEscalation?: boolean; runAsNonRoot?: boolean;
      runAsUser?: number; seccomp?: string; capDrop?: string[]; capAdd?: string[];
    };
    type Pod = { hostNetwork?: boolean; hostPath?: boolean; runAsNonRoot?: boolean; containers: Container[] };

    // Baseline qoidalari tayyor. Restricted qoidalarini qo'shing.
    function violations(p: Pod): string[] {
      const v: string[] = [];
      if (p.hostNetwork) v.push("hostNetwork");
      if (p.hostPath) v.push("hostPath");
      for (const c of p.containers) {
        if (c.privileged) v.push(`${c.name}: privileged`);
      }
      return v;
    }

    const insecure: Pod = { hostNetwork: true, containers: [{ name: "api", privileged: true }] };
    const baselineOnly: Pod = { containers: [{ name: "api" }] };
    const restrictedPod: Pod = {
      runAsNonRoot: true,
      containers: [{ name: "api", allowPrivilegeEscalation: false, seccomp: "RuntimeDefault", capDrop: ["ALL"], capAdd: ["NET_BIND_SERVICE"] }],
    };
    const rootUser: Pod = {
      containers: [{ name: "api", allowPrivilegeEscalation: false, runAsNonRoot: true, runAsUser: 0, seccomp: "Unconfined", capDrop: ["NET_RAW"], capAdd: ["SYS_ADMIN"] }],
    };

    for (const [name, p] of Object.entries({ insecure, baselineOnly, restrictedPod, rootUser })) {
      const v = violations(p);
      console.log(name.padEnd(14), v.length === 0 ? "restricted: OK" : `${v.length} buzilish`);
    }
  solution: |
    type Container = {
      name: string; privileged?: boolean; allowPrivilegeEscalation?: boolean; runAsNonRoot?: boolean;
      runAsUser?: number; seccomp?: string; capDrop?: string[]; capAdd?: string[];
    };
    type Pod = { hostNetwork?: boolean; hostPath?: boolean; runAsNonRoot?: boolean; containers: Container[] };

    // Baseline qoidalari tayyor. Restricted qoidalarini qo'shing.
    function violations(p: Pod): string[] {
      const v: string[] = [];
      if (p.hostNetwork) v.push("hostNetwork");
      if (p.hostPath) v.push("hostPath");
      for (const c of p.containers) {
        if (c.privileged) v.push(`${c.name}: privileged`);
        if (c.allowPrivilegeEscalation !== false) v.push(`${c.name}: allowPrivilegeEscalation false emas`);
        if (!(c.runAsNonRoot ?? p.runAsNonRoot)) v.push(`${c.name}: runAsNonRoot true emas`);
        if (c.runAsUser === 0) v.push(`${c.name}: runAsUser 0`);
        if (c.seccomp !== "RuntimeDefault" && c.seccomp !== "Localhost") v.push(`${c.name}: seccomp profili yo'q yoki Unconfined`);
        if (!(c.capDrop ?? []).includes("ALL")) v.push(`${c.name}: capability'lar ALL tashlanmagan`);
        if ((c.capAdd ?? []).some((x) => x !== "NET_BIND_SERVICE")) v.push(`${c.name}: ruxsat etilmagan capability qo'shilgan`);
      }
      return v;
    }

    const insecure: Pod = { hostNetwork: true, containers: [{ name: "api", privileged: true }] };
    const baselineOnly: Pod = { containers: [{ name: "api" }] };
    const restrictedPod: Pod = {
      runAsNonRoot: true,
      containers: [{ name: "api", allowPrivilegeEscalation: false, seccomp: "RuntimeDefault", capDrop: ["ALL"], capAdd: ["NET_BIND_SERVICE"] }],
    };
    const rootUser: Pod = {
      containers: [{ name: "api", allowPrivilegeEscalation: false, runAsNonRoot: true, runAsUser: 0, seccomp: "Unconfined", capDrop: ["NET_RAW"], capAdd: ["SYS_ADMIN"] }],
    };

    for (const [name, p] of Object.entries({ insecure, baselineOnly, restrictedPod, rootUser })) {
      const v = violations(p);
      console.log(name.padEnd(14), v.length === 0 ? "restricted: OK" : `${v.length} buzilish`);
    }
  solutionNotes: |
    - Qoidalar Kubernetes Pod Security Standards jadvalidan: allowPrivilegeEscalation false, runAsNonRoot true, runAsUser nol emas, seccomp RuntimeDefault yoki Localhost, capability'lar ALL tashlanib NET_BIND_SERVICE qaytarilishi mumkin.
    - Pod darajasidagi `runAsNonRoot` konteyner darajasi bo'lmaganda hisobga olinadi (hujjat shuni ruxsat etadi); bu modelda `??` shu semantikani beradi.
    - Model Restricted'ning hammasini qamramaydi: hajm turlari cheklovi, Baseline'ning qolgan qoidalari (host port'lar, AppArmor/SELinux, sysctl kabilar) kiritilmagan. Haqiqiy tekshiruvni Pod Security Admission bajaradi.
    - initContainers va ephemeralContainers ham tekshiriladi, bu modelda esa yo'q.
  checklist:
    - "allowPrivilegeEscalation aniq false ekani talab qilinadi"
    - "runAsNonRoot pod darajasidan ham olinadi"
    - "runAsUser 0 va Unconfined seccomp ushlanadi"
    - "capability drop ALL va faqat NET_BIND_SERVICE qo'shish tekshiriladi"
    - "Model nimani qamramasligini ayta olasiz"
---

## Muammo

86-darsda konteyner sozlamalarini ko'rdik. Kubernetes shu sozlamalarni mingta pod'ga yoyadi, yangi qatlam qo'shadi (klaster ichidagi API, RBAC, Secret'lar, service account'lar, tarmoq) va ko'pchilik narsani default holatda ochiq qoldiradi. OWASP A02:2025 Security Misconfiguration kategoriyasi aynan shunday platformalar uchun: ular ko'p sozlanadi, va har bir sozlama xavfsiz qiymatda bo'lishi kerak. Tavsif keraksiz imkoniyatlar yoqilgani, xavfsizlik sozlamalari xavfsiz qiymatlarga qo'yilmaganini va takrorlanuvchi hardening jarayoni yo'qligini xavf deb belgilaydi.

Amaliy og'riq: ilovadagi bitta RCE da hujumchi pod ichida bo'ladi. Keyingi qadamlari pod sozlamalariga bog'liq: privileged pod host'ga yo'l ochadi, service account tokeni Kubernetes API'ga kirishni beradi, Secret'lar hamma o'qiy oladigan namespace'da turadi, tarmoqda boshqa pod'larga erkin yo'l bor. Bu dars shu zanjirni bo'g'inlarga ajratadi va har birini yopadigan nazoratni Kubernetes hujjatlari bo'yicha beradi.

Muhim doira: Kubernetes katta mavzu. Bu dars ilova muhandisi bilishi kerak bo'lgan asoslarni qamraydi: Pod Security Standards va admission, securityContext, RBAC, service account, Secret'lar va NetworkPolicy. Klaster administratori darajasidagi mavzular (control plane hardening, kubelet, audit policy) faqat nomi bilan tilga olinadi.

## Asosiy g'oya

### Pod Security Standards: uchta profil

Kubernetes pod xavfsizligi uchun uch standart profil belgilaydi. Privileged: ataylab ochiq, cheklovlarsiz siyosat, ma'lum huquq oshirishlarga yo'l qo'yadi. Baseline: minimal cheklovli, ma'lum huquq oshirishlarning oldini oladi va default (minimal ko'rsatilgan) pod konfiguratsiyasiga ruxsat beradi; umumiy konteynerlashtirilgan ilovalar uchun osonlik bilan joriy qilish maqsadida. Restricted: hozirgi pod hardening amaliyotlariga rioya qiluvchi qattiq cheklangan siyosat, ba'zi mos kelmaslik evaziga; xavfsizlik uchun muhim ilovalar va past ishonchli foydalanuvchilar uchun.

Baseline, hujjatdagi jadvalga ko'ra, privileged konteynerlarni taqiqlaydi ("privileged pod'lar ko'pgina xavfsizlik mexanizmlarini o'chiradi"), host namespace'larini (hostNetwork, hostPID, hostIPC) ulashishni taqiqlaydi, hostPath hajmlarini taqiqlaydi va host port'larni butunlay rad etishni tavsiya qiladi yoki ma'lum ro'yxat bilan cheklaydi. Restricted Baseline'ning hammasini o'z ichiga oladi va qo'shadi: faqat ro'yxatdagi hajm turlari (configMap, csi, downwardAPI, emptyDir, ephemeral, persistentVolumeClaim, projected, secret); `allowPrivilegeEscalation: false`; konteynerlar root bo'lmagan foydalanuvchi sifatida ishlashi (`runAsNonRoot: true`, `runAsUser` nol emas); seccomp profili aniq `RuntimeDefault` yoki `Localhost` (Unconfined ham, profilning yo'qligi ham taqiqlangan); va barcha capability'larni tashlash (`drop: ["ALL"]`), qaytarib faqat `NET_BIND_SERVICE` qo'shish mumkin. 86-darsdagi `--cap-drop ALL`, non-root va `no-new-privileges` shu profilning pod spetsifikatsiyasidagi ifodasi.

### Pod Security Admission: standartni majburlash

Standart o'zi qoida, uni admission controller majburlaydi. Pod Security Admission namespace label'lari bilan sozlanadi: `pod-security.kubernetes.io/<MODE>: <LEVEL>`, bunda MODE `enforce`, `audit` yoki `warn`, LEVEL esa `privileged`, `baseline` yoki `restricted`. Ixtiyoriy `-version` label'i siyosatni Kubernetes minor versiyasiga qotiradi (yoki `latest`). Rejimlar farqi muhim: `enforce` buzilishda pod'ni rad etadi; `audit` audit log hodisasiga annotatsiya qo'shadi, lekin ruxsat beradi; `warn` foydalanuvchiga ogohlantirish ko'rsatadi, lekin ruxsat beradi.

Yana bir nozik joy: pod'lar ko'pincha bevosita emas, Deployment yoki Job kabi workload obyektlari orqali yaratiladi. Xatoni erta ushlash uchun audit va warn rejimlari workload resource'larga qo'llanadi, lekin `enforce` workload resource'larga emas, faqat hosil bo'lgan pod obyektlariga qo'llanadi. Natija: Deployment yaratilishi mumkin, lekin uning pod'lari rad etiladi va muammo ReplicaSet hodisalarida ko'rinadi. Istisnolar (exemptions) ham sozlanishi mumkin: ular admission controller konfiguratsiyasida aniqlanadi va bu rejimlarning hammasini o'tkazib yuboradi, shuning uchun istisnolar ro'yxati ham nazorat ostida bo'lishi kerak.

## Chuqurroq: RBAC, token, Secret va tarmoq

### RBAC va service account

Kubernetes RBAC good practices hujjati quyidagilarni tavsiya qiladi: huquqlarni iloji boricha namespace darajasida berish (ClusterRoleBinding emas, RoleBinding); wildcard huquqlardan, ayniqsa barcha resurslarga, qochish, chunki Kubernetes kengaytiriladigan tizim va wildcard hozirgi obyekt turlariga ham, kelajakda yaratiladiganlariga ham huquq beradi; administratorlar `cluster-admin` akkauntlarini faqat aniq kerak bo'lgandagina ishlatishi; foydalanuvchilarni `system:masters` guruhiga qo'shmaslik, chunki bu guruh a'zosi barcha RBAC tekshiruvlarini chetlab o'tadi va huquqni RoleBinding'ni olib tashlash bilan qaytarib bo'lmaydi.

Service account tokeni alohida masala. Hujjatga ko'ra Kubernetes default holatda pod'ga tayinlangan ServiceAccount credential'larini beradi. Ilova API bilan gaplashmasa, `automountServiceAccountToken: false` qo'yish tavsiya etiladi (pod darajasidagi qiymat service account sozlamasidan ustun turadi, tokenni kerakli workload'lar baribir ulay oladi). Bu RCE dan keyingi zanjirni uzadi: token bo'lmasa, hujumchi pod ichidan API'ga tayinlangan huquq bilan kira olmaydi.

### Secret'lar va etcd

Kubernetes Secrets hujjati: default holatda Secret obyektlari etcd'da shifrlanmagan holda saqlanadi, shuning uchun etcd'da encryption at rest sozlash kerak. Kirish huquqi bo'yicha: komponentlar uchun watch va list faqat eng imtiyozli tizim komponentlariga, get faqat kerak bo'lsagina; odamlar uchun get, watch, list cheklanadi va etcd'ga faqat klaster administratorlari kira oladi. Ogohlantirish: Secret'larga list ruxsati sub'ektga ularning kontentini olish imkonini beradi. OWASP Kubernetes cheat sheet etcd haqida kuchliroq ibora ishlatadi: API server etcd'iga yozuv ruxsati butun klaster ustidan root olishga teng, o'qish ruxsati ham huquqni oshirishga yetadi; sabab: pod'lar validatsiya API server orqali o'tgandan keyin etcd'ga yoziladi, etcd'ga bevosita yozish ko'p tekshiruvlarni chetlab o'tadi. Etcd'ni faqat API server'lar kira oladigan firewall ortida va o'zaro TLS autentifikatsiya bilan saqlash tavsiya qilinadi.

Ilova muhandisi uchun amaliy xulosa 69-darsdagi secrets management bilan mos: Secret obyekti sir "saqlash joyi" emas, uzatish mexanizmi; manba sifatida tashqi secrets manager va qisqa muddatli credential afzal. Kubernetes Secret'ini git'ga base64 sifatida commit qilish 83-darsdagi muammoning o'zi.

### NetworkPolicy

OWASP cheat sheet: default holatda pod'lar ingress va egress uchun izolyatsiyalanmagan, ya'ni buzilgan ilova qo'shni ilovalarga hujum qila oladi. NetworkPolicy yo'nalish bo'yicha yoziladi (ingress'ni cheklash egress'ni cheklamaydi) va klaster NetworkPolicy'ni qo'llaydigan network plugin ishlatishi shart: plugin bo'lmasa resursning ta'siri yo'q. `hostNetwork` pod'lari uchun xatti-harakat plugin'ga bog'liq, shuning uchun enforcement'ni faraz qilmay tekshirish kerak. Bu 55-darsdagi tenant izolyatsiyasining tarmoq darajasidagi akosi: bitta klasterda bir nechta tenant bo'lsa, namespace va policy ularning orasidagi chegara.

### Zanjirni birlashtirish

Yuqoridagi nazoratlar alohida emas, zanjir bo'g'inlari sifatida ishlaydi. Ilovada RCE bo'lsin: Restricted profil hujumchini root, privileged va host namespace'dan mahrum qiladi; `automountServiceAccountToken: false` uni Kubernetes API tokenidan mahrum qiladi; tor RBAC token bo'lsa ham qilishi mumkin bo'lgan ishni cheklaydi; Secret'lar faqat shu pod'ga kerak bo'lganlari bilan cheklangan bo'lsa, o'qiladigan sirlar kam; NetworkPolicy esa qo'shni servislarga yo'lni yopadi. Bitta bo'g'in yetishmasa, qolganlari zarar hajmini cheklaydi, lekin hech biri ilovadagi zaiflikning o'zini yo'q qilmaydi. Shuning uchun bu nazoratlar 1-8 modullardagi kod darajasidagi himoyani almashtirmaydi, faqat uning ortidagi ikkinchi chiziq bo'ladi.

Takrorlanuvchanlik masalasi ham muhim: A02:2025 tavsifi hardening jarayoni takrorlanuvchi bo'lishini, ya'ni yangi muhit bir xil qulflangan holda ko'tarilishini talab qiladi. Namespace label'lari, RoleBinding'lar va NetworkPolicy'lar qo'lda emas, manifestlar sifatida repoda saqlanishi va CI orqali qo'llanishi shu talabni bajaradi.

## Misol: privileged pod va admission rejimlari

Model hujjatdagi Baseline qoidalarini va admission rejimlarini ifodalaydi. Haqiqiy tekshiruvni Pod Security Admission bajaradi; bu model uning mantiqini ko'rsatadi, qamrovi toraytirilgan (faqat privileged, hostNetwork, hostPath).

### 1. Zaif kod va 2. Hujum

> **Ta'lim maqsadida.** Bu xavfli pod'ni joylashtirish usuli faqat shu darsning o'quv kodiga qarshi ko'rsatilgan; uni faqat o'z tizimingizda yoki yozma ruxsat bilan, kelishilgan doirada qo'llang. Ruxsatsiz qo'llash Jinoyat kodeksining 278-2-moddasi (Kompyuter axborotidan ruxsatsiz foydalanish) doirasiga tushishi mumkin (kurs talqini). Batafsil: 9-dars.

Pod'da privileged konteyner va host tarmog'i bor. Savol: namespace label'iga qarab nima bo'ladi? "Hujum" bu holda sozlanmagan admission: yomon pod jim o'tib ketadi.

```ts run
type Container = {
  name: string; privileged?: boolean; allowPrivilegeEscalation?: boolean; runAsNonRoot?: boolean;
  runAsUser?: number; seccomp?: string; capDrop?: string[]; capAdd?: string[];
};
type Pod = { hostNetwork?: boolean; hostPath?: boolean; runAsNonRoot?: boolean; containers: Container[] };

// Baseline (Pod Security Standards): privileged konteyner, host namespace va hostPath taqiqlangan
function baseline(p: Pod): string[] {
  const v: string[] = [];
  if (p.hostNetwork) v.push("hostNetwork: host namespace'ini ulashish taqiqlangan");
  if (p.hostPath) v.push("hostPath hajmi taqiqlangan");
  for (const c of p.containers) if (c.privileged) v.push(`${c.name}: privileged konteyner taqiqlangan`);
  return v;
}

type Labels = { enforce?: string; audit?: string; warn?: string };
// Pod Security Admission rejimlari: enforce rad etadi, audit yozadi, warn ogohlantiradi
function admit(p: Pod, labels: Labels): string {
  const v = baseline(p); // bu modelda faqat "baseline" va "privileged" darajalari
  const level = (m?: string) => (m === "baseline" ? v : []);
  if (level(labels.enforce).length) return `RAD ETILDI (${level(labels.enforce).length} buzilish)`;
  const notes: string[] = [];
  if (level(labels.audit).length) notes.push("audit annotatsiyasi");
  if (level(labels.warn).length) notes.push("foydalanuvchiga ogohlantirish");
  return "QABUL QILINDI" + (notes.length ? ` (${notes.join(", ")})` : "");
}

// ZAIF: privileged konteyner, host tarmog'i
const pod: Pod = { hostNetwork: true, containers: [{ name: "api", privileged: true }, { name: "sidecar" }] };

console.log("buzilishlar:", baseline(pod).length);
console.log("label yo'q      :", admit(pod, {}));
console.log("faqat warn      :", admit(pod, { warn: "baseline" }));
console.log("audit + warn    :", admit(pod, { audit: "baseline", warn: "baseline" }));
console.log("enforce baseline:", admit(pod, { enforce: "baseline" }));
```

```text
buzilishlar: 2
label yo'q      : QABUL QILINDI
faqat warn      : QABUL QILINDI (foydalanuvchiga ogohlantirish)
audit + warn    : QABUL QILINDI (audit annotatsiyasi, foydalanuvchiga ogohlantirish)
enforce baseline: RAD ETILDI (2 buzilish)
```

Ko'rinib turibdiki, `warn` va `audit` ni qo'yish pod'ni to'xtatmaydi: u faqat xabar beradi. Jamoa ko'pincha rejimlarni bosqichma-bosqich joriy qiladi (avval warn va audit bilan nima buzilishini ko'radi, keyin enforce). Bu to'g'ri yo'l, lekin faqat enforce'ga o'tilsa nazorat bo'ladi.

### 3. Tuzatilgan kod

Pod spetsifikatsiyasidan privileged va host tarmog'i olib tashlangan, namespace'da `enforce: baseline`:

```ts run
type Container = {
  name: string; privileged?: boolean; allowPrivilegeEscalation?: boolean; runAsNonRoot?: boolean;
  runAsUser?: number; seccomp?: string; capDrop?: string[]; capAdd?: string[];
};
type Pod = { hostNetwork?: boolean; hostPath?: boolean; runAsNonRoot?: boolean; containers: Container[] };

// Baseline (Pod Security Standards): privileged konteyner, host namespace va hostPath taqiqlangan
function baseline(p: Pod): string[] {
  const v: string[] = [];
  if (p.hostNetwork) v.push("hostNetwork: host namespace'ini ulashish taqiqlangan");
  if (p.hostPath) v.push("hostPath hajmi taqiqlangan");
  for (const c of p.containers) if (c.privileged) v.push(`${c.name}: privileged konteyner taqiqlangan`);
  return v;
}

type Labels = { enforce?: string; audit?: string; warn?: string };
// Pod Security Admission rejimlari: enforce rad etadi, audit yozadi, warn ogohlantiradi
function admit(p: Pod, labels: Labels): string {
  const v = baseline(p); // bu modelda faqat "baseline" va "privileged" darajalari
  const level = (m?: string) => (m === "baseline" ? v : []);
  if (level(labels.enforce).length) return `RAD ETILDI (${level(labels.enforce).length} buzilish)`;
  const notes: string[] = [];
  if (level(labels.audit).length) notes.push("audit annotatsiyasi");
  if (level(labels.warn).length) notes.push("foydalanuvchiga ogohlantirish");
  return "QABUL QILINDI" + (notes.length ? ` (${notes.join(", ")})` : "");
}

// TUZATILGAN: privileged ham, host tarmog'i ham yo'q
const pod: Pod = { containers: [{ name: "api" }, { name: "sidecar" }] };

console.log("buzilishlar:", baseline(pod).length);
console.log("enforce baseline:", admit(pod, { enforce: "baseline" }));
console.log("qoldiq: baseline runAsNonRoot va capability drop ALL ni talab qilmaydi, seccomp profilini ham talab qilmaydi (faqat Unconfined'ni taqiqlaydi); restricted talab qiladi");
```

```text
buzilishlar: 0
enforce baseline: QABUL QILINDI
qoldiq: baseline runAsNonRoot va capability drop ALL ni talab qilmaydi, seccomp profilini ham talab qilmaydi (faqat Unconfined'ni taqiqlaydi); restricted talab qiladi
```

Nima yopildi: privileged konteyner va host namespace'ga chiqish yo'li enforce darajasida rad etiladi. Nima yopilmadi: Baseline root jarayonni, tashlanmagan capability'larni va seccomp profilining yo'qligini taqiqlamaydi; buning uchun Restricted kerak (quyidagi topshiriq shu qoidalarni yozishni so'raydi). Admission pod spetsifikatsiyasini tekshiradi, ilovadagi zaiflikni emas, RBAC, Secret'lar va tarmoqni ham emas.

### Mustahkamlangan manifest

Yuqoridagi nazoratlar real manifestda shunday ko'rinadi (ishga tushirilmaydigan YAML; `fleet-api:1.0.0` o'quv image nomi):

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: tracker-alfa
  labels:
    pod-security.kubernetes.io/enforce: baseline     # buzilsa pod rad etiladi
    pod-security.kubernetes.io/warn: restricted      # restricted'ga o'tishdan oldin buzilishlarni ko'rsatadi
    pod-security.kubernetes.io/audit: restricted
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: fleet-api
  namespace: tracker-alfa
automountServiceAccountToken: false                  # ilova Kubernetes API bilan gaplashmaydi
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: fleet-api
  namespace: tracker-alfa
spec:
  replicas: 2
  selector:
    matchLabels: { app: fleet-api }
  template:
    metadata:
      labels: { app: fleet-api }
    spec:
      serviceAccountName: fleet-api
      securityContext:
        runAsNonRoot: true
        runAsUser: 10001                              # raqamli UID
        seccompProfile: { type: RuntimeDefault }
      containers:
        - name: api
          image: fleet-api:1.0.0
          securityContext:
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: true
            capabilities: { drop: ["ALL"] }
          volumeMounts:
            - { name: tmp, mountPath: /tmp }
      volumes:
        - name: tmp
          emptyDir: {}
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny
  namespace: tracker-alfa
spec:
  podSelector: {}
  policyTypes: ["Ingress", "Egress"]
```

Namespace label'lari: `enforce: baseline` hozirning o'zida privileged va host namespace'larni rad etadi, `warn` va `audit` esa `restricted` bilan keyingi qadam uchun buzilishlarni yig'adi. Deployment'dagi `securityContext` Restricted'ning hamma konteyner talablarini bajaradi: non-root raqamli UID, `allowPrivilegeEscalation: false`, seccomp `RuntimeDefault`, `drop: ["ALL"]`; `readOnlyRootFilesystem` Restricted talabi emas, 86-darsdagi `--read-only` ning ekvivalenti, `emptyDir` esa yozish joyini `/tmp` bilan cheklaydi. `automountServiceAccountToken: false` ServiceAccount darajasida qo'yilgan. Bo'sh `podSelector` va ikkala `policyTypes` bilan NetworkPolicy namespace'dagi hamma pod uchun ingress va egress'ni yopadi; kerakli oqimlar (masalan DNS, PostgreSQL) alohida policy bilan ochiladi va klaster NetworkPolicy'ni qo'llaydigan plugin ishlatishi shart. Qoldiq risk: bu manifest ilovadagi zaiflikni, RBAC'dagi keng huquqlarni va etcd'dagi Secret'larni hal qilmaydi.

### Restricted qoidalarini yozish

Topshiriqda Restricted qoidalarini qo'shasiz. Boshlang'ich kod Baseline'ning bir qismini tekshiradi va to'rt pod'ni baholaydi. Hozirgi chiqishda `baselineOnly` va `rootUser` noto'g'ri `OK` bo'lib chiqadi, ular Restricted'ni buzadi:

```ts run
type Container = {
  name: string; privileged?: boolean; allowPrivilegeEscalation?: boolean; runAsNonRoot?: boolean;
  runAsUser?: number; seccomp?: string; capDrop?: string[]; capAdd?: string[];
};
type Pod = { hostNetwork?: boolean; hostPath?: boolean; runAsNonRoot?: boolean; containers: Container[] };

// Baseline qoidalari tayyor. Restricted qoidalarini qo'shing.
function violations(p: Pod): string[] {
  const v: string[] = [];
  if (p.hostNetwork) v.push("hostNetwork");
  if (p.hostPath) v.push("hostPath");
  for (const c of p.containers) {
    if (c.privileged) v.push(`${c.name}: privileged`);
  }
  return v;
}

const insecure: Pod = { hostNetwork: true, containers: [{ name: "api", privileged: true }] };
const baselineOnly: Pod = { containers: [{ name: "api" }] };
const restrictedPod: Pod = {
  runAsNonRoot: true,
  containers: [{ name: "api", allowPrivilegeEscalation: false, seccomp: "RuntimeDefault", capDrop: ["ALL"], capAdd: ["NET_BIND_SERVICE"] }],
};
const rootUser: Pod = {
  containers: [{ name: "api", allowPrivilegeEscalation: false, runAsNonRoot: true, runAsUser: 0, seccomp: "Unconfined", capDrop: ["NET_RAW"], capAdd: ["SYS_ADMIN"] }],
};

for (const [name, p] of Object.entries({ insecure, baselineOnly, restrictedPod, rootUser })) {
  const v = violations(p);
  console.log(name.padEnd(14), v.length === 0 ? "restricted: OK" : `${v.length} buzilish`);
}
```

```text
insecure       2 buzilish
baselineOnly   restricted: OK
restrictedPod  restricted: OK
rootUser       restricted: OK
```

## Qachon qo'llamaslik kerak

- Restricted'ni hamma namespace'ga bir kunda enforce qilish. Ko'p tayyor image root bilan ishlaydi yoki yoziladigan fayl tizimi kutadi. Hujjat Restricted'ni "ba'zi mos kelmaslik evaziga" deb ataydi. Yo'l: warn va audit bilan buzilishlarni ko'rish, ilovalarni tuzatish, keyin enforce.
- Istisnolar ro'yxatini uzun qilish. Har istisna nazoratni o'sha workload uchun o'chiradi; ularni hujjatlashtirib, muddat bilan ko'rib chiqing.
- RBAC'ni "hamma narsa kerak bo'lishi mumkin" deb keng berish. Wildcard va cluster-admin kelajak obyektlarni ham qamraydi, va keyin qaytarib olish qiyin (`system:masters` uchun mumkin emas).
- NetworkPolicy'ni plugin'ni tekshirmasdan yozish. Ta'siri yo'q policy xavfsizlik hissini beradi, xolos.
- Kubernetes Secret'iga tayanib "sirlar xavfsiz" deb hisoblash. Shifrlashsiz etcd va keng RBAC bo'lsa, Secret ochiq matndan yaxshi emas.

## Stack'da: NestJS/Next.js deployment

- Deployment spetsifikatsiyasida `securityContext`: `runAsNonRoot: true`, `allowPrivilegeEscalation: false`, `seccompProfile: { type: RuntimeDefault }`, `capabilities: { drop: ["ALL"] }`. 86-darsdagi image `USER node` bilan mos bo'lishi kerak. Kubelet manba kodiga ko'ra (`verifyRunAsNonRoot`) tekshiruv faqat samarali `runAsNonRoot` `true` bo'lsa ishlaydi; qiymat berilmagan yoki `false` bo'lsa tekshiruv yo'q. Samarali `runAsUser` berilgan bo'lsa: `0` bo'lsa kubelet `container's runAsUser breaks non-root policy (pod: "<pod>", container: <nom>)` xatosi bilan konteynerni ishga tushirmaydi, boshqa qiymatda image'ga qaralmaydi. `runAsUser` berilmagan bo'lsa kubelet image metadata'sidagi foydalanuvchiga qaraydi: UID 0 bo'lsa (yoki image'da `USER` yo'q bo'lsa) `container has runAsNonRoot and image will run as root (pod: "<pod>", container: <nom>)`; foydalanuvchi nom bo'lib UID yo'q bo'lsa (`USER node`) `container has runAsNonRoot and image has non-numeric user (node), cannot verify user is non-root (pod: "<pod>", container: <nom>)`. Chaqiruvchi kod oldidagi izoh: "Non-root verification only supports numeric user". Shuning uchun nomga tayanmang: `runAsUser` bilan raqamli UID bering. Pod va konteyner darajasida ikkalasi berilsa, har maydon alohida hal qilinadi: konteynerda berilgan `runAsNonRoot` va `runAsUser` pod qiymatini bosadi (konteynerdagi `runAsNonRoot: false` pod'dagi `true`ni ham o'chiradi); konteynerda berilmagan maydon pod'dan olinadi (`securitycontext.DetermineEffectiveSecurityContext`).
- Namespace'lar: har tenant yoki muhit uchun alohida namespace, label'lar `enforce: baseline` (yoki restricted), `warn` va `audit` uchun `restricted`.
- Servis hisoblari: har servis uchun alohida ServiceAccount, API ishlatilmasa `automountServiceAccountToken: false`.
- Secret'lar: tashqi secrets manager va ilova runtime'da oladi (69-dars); etcd'da encryption at rest klaster administratori bilan kelishilgan.
- NetworkPolicy: default-deny, keyin kerakli oqimlar (ingress controller → API, API → PostgreSQL va Redis, 89-dars). Egress ham cheklanadi: SSRF (27-dars) va bulut metadata xizmatiga yo'l ham egress siyosatida yopiladi.
- CI'da (85-dars) manifestlarni deploy'dan oldin linter bilan tekshirish; Pod Security Admission baribir oxirgi to'siq.

## Xulosa

- Pod Security Standards uch profil: Privileged (ochiq), Baseline (ma'lum huquq oshirishlarni taqiqlaydi), Restricted (hardening amaliyotlari).
- Admission rejimlari: faqat `enforce` rad etadi; `audit` va `warn` jim yoki ogohlantirish bilan o'tkazadi. `enforce` workload'ga emas, hosil bo'lgan pod'ga qo'llanadi.
- Restricted: allowPrivilegeEscalation false, non-root, seccomp, capability drop ALL; bu Docker chorasi (86-dars) ning Kubernetes ifodasi.
- RBAC: namespace darajasi, wildcard va cluster-admin'dan qochish; kerak bo'lmagan service account tokenini ulamaslik.
- Secret'lar default holatda etcd'da shifrlanmagan; list ruxsati kontentni ochadi; etcd'ga yozuv klaster rootiga teng.
- Pod'lar default holatda tarmoqda izolyatsiyalanmagan: NetworkPolicy va uni qo'llaydigan plugin kerak.
