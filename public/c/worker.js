// C dasturlarini brauzerda kompilyatsiya qilib ishga tushiradigan worker (module).
// Kompilyator: YoWASP clang (LLVM, WASM), jsDelivr'dan, birinchi ishga tushirishda yuklanadi (~23 MB).
// Dastur wasm32-wasip1 ga kompilyatsiya qilinadi va shu worker'da kichik WASI qatlami bilan ishlaydi.
import { runClang, runLLVM } from "https://cdn.jsdelivr.net/npm/@yowasp/clang@22.0.0-git20542-10/gen/bundle.js";

const OUTPUT_LIMIT = 200_000; // belgilar: cheksiz chiqarishdan sahifani himoya qiladi
const dec = new TextDecoder();
const text = (b) => (typeof b === "string" ? b : dec.decode(b));
const send = (kind, t) => postMessage({ type: "out", out: { kind, text: t } });

// Xotira: [0, 16MB) - sanitizer shadow'i, dastur undan keyin (runtime.c ga qarang).
const LINK = [
  "-Wl,--wrap=malloc,--wrap=free,--wrap=calloc,--wrap=realloc,--wrap=strcpy,--wrap=strcat,--wrap=strlen",
  "-Wl,--global-base=16777216,--initial-memory=33554432,--max-memory=134217728,-z,stack-size=1048576,--no-stack-first",
];
const SANITIZE = [
  "-fsanitize=address,undefined",
  "-fno-sanitize=bounds,null,alignment,function,vptr",
  "-fno-sanitize-recover=undefined",
  "-mllvm",
  "-asan-use-after-return=never",
];
const BASE = ["--target=wasm32-wasip1", "-fno-color-diagnostics"];

async function clang(args, files) {
  const log = [];
  const io = { stdout: (b) => b && log.push(text(b)), stderr: (b) => b && log.push(text(b)) };
  try {
    return { out: await runClang(["clang", ...BASE, ...args], files, io), log: log.join("") };
  } catch {
    return { out: null, log: log.join("") };
  }
}

// Runtime va cs50.h bir marta yuklanib kompilyatsiya qilinadi.
let runtime;
const ready = (async () => {
  const origin = new URL(self.location.href).origin;
  const [rt, cs50] = await Promise.all(["runtime.c", "cs50.h"].map((f) => fetch(`${origin}/c/${f}`).then((r) => r.text())));
  const { out, log } = await clang(["-O1", "-fno-delete-null-pointer-checks", "-c", "-o", "runtime.o", "runtime.c"], { "runtime.c": rt });
  if (!out) throw new Error("C runtime kompilyatsiya qilinmadi:\n" + log);
  runtime = { "runtime.o": out["runtime.o"], "cs50.h": cs50 };
  postMessage({ type: "ready" });
})().catch((err) => postMessage({ type: "fail", message: String(err.message || err) }));

/** proc_exit yoki worker o'zi to'xtatgani (quiet: sababi allaqachon yozilgan). */
class Exit {
  constructor(code, quiet = false) {
    this.code = code;
    this.quiet = quiet;
  }
}

/**
 * Faqat stdin/stdout/stderr bor WASI. stdin qatorma-qator beriladi va natijaga terminaldagidek yoziladi.
 * stderr() - dastur stderr'ga yozgan matn (runtime hisoboti bormi, bilish uchun).
 */
function wasi(stdinText, memory) {
  const enc = new TextEncoder();
  const lines = stdinText ? stdinText.replace(/\r/g, "").match(/[^\n]*\n|[^\n]+$/g) ?? [] : [];
  let written = 0;
  let errText = "";
  // Chiqish guruhlanadi: har printf alohida xabar bo'lmasin (stdout buferlanmagan).
  let buf = { kind: "", text: "" };
  const flush = () => {
    if (buf.text) send(buf.kind, buf.text);
    buf = { kind: "", text: "" };
  };
  const note = (kind, t) => {
    flush();
    send(kind, t);
  };
  const view = () => new DataView(memory().buffer);
  const bytes = () => new Uint8Array(memory().buffer);
  // kind: out (stdout), err (stderr), in (stdin'dan o'qilgan qator, terminaldagidek ko'rsatiladi).
  const out = (kind, chunk) => {
    if (written > OUTPUT_LIMIT) return;
    written += chunk.length;
    if (kind === "err") errText += chunk;
    if (buf.kind !== kind) flush();
    buf.kind = kind;
    buf.text += chunk;
    if (buf.text.length > 8192) flush();
    if (written > OUTPUT_LIMIT) {
      note("err", `\nChiqish ${OUTPUT_LIMIT} belgidan oshdi, dastur to'xtatildi.`);
      throw new Exit(1, true);
    }
  };
  const ENOSYS = 52;
  const EBADF = 8;
  const imports = {
    fd_write(fd, iovs, n, nwritten) {
      if (fd !== 1 && fd !== 2) return EBADF;
      const v = view();
      let total = 0;
      let s = "";
      for (let i = 0; i < n; i++) {
        const ptr = v.getUint32(iovs + i * 8, true);
        const len = v.getUint32(iovs + i * 8 + 4, true);
        s += dec.decode(bytes().subarray(ptr, ptr + len), { stream: true });
        total += len;
      }
      if (s) out(fd === 2 ? "err" : "out", s);
      view().setUint32(nwritten, total, true);
      return 0;
    },
    fd_read(fd, iovs, n, nread) {
      if (fd !== 0) return EBADF;
      const v = view();
      let line = lines.shift();
      if (line === undefined) {
        // EOF. libc'da EOF "yopishqoq": keyingi getchar qayta so'ramaydi; kutib qolish runtime.c da ushlanadi.
        v.setUint32(nread, 0, true);
        return 0;
      }
      out("in", line.endsWith("\n") ? line : line + "\n");
      let data = enc.encode(line);
      let total = 0;
      for (let i = 0; i < n && data.length; i++) {
        const ptr = v.getUint32(iovs + i * 8, true);
        const len = v.getUint32(iovs + i * 8 + 4, true);
        const take = data.subarray(0, len);
        bytes().set(take, ptr);
        total += take.length;
        data = data.subarray(take.length);
      }
      if (data.length) lines.unshift(dec.decode(data)); // bufer kichik bo'lsa, qolgani keyingi o'qishga
      view().setUint32(nread, total, true);
      return 0;
    },
    fd_fdstat_get(fd, ptr) {
      if (fd > 2) return EBADF;
      const v = view();
      for (let i = 0; i < 24; i++) v.setUint8(ptr + i, 0);
      v.setUint8(ptr, 2); // character device: stdout qatorma-qator buferlanadi
      v.setBigUint64(ptr + 8, 0xffffffffn, true);
      v.setBigUint64(ptr + 16, 0xffffffffn, true);
      return 0;
    },
    fd_close: () => 0,
    fd_seek: () => 70, // ESPIPE
    fd_prestat_get: () => EBADF,
    fd_prestat_dir_name: () => EBADF,
    proc_exit(code) {
      throw new Exit(code);
    },
    args_sizes_get(argc, size) {
      view().setUint32(argc, 1, true);
      view().setUint32(size, 2, true);
      return 0;
    },
    args_get(argv, buf) {
      view().setUint32(argv, buf, true);
      bytes().set([0x61, 0], buf); // "a"
      return 0;
    },
    environ_sizes_get(count, size) {
      view().setUint32(count, 0, true);
      view().setUint32(size, 0, true);
      return 0;
    },
    environ_get: () => 0,
    clock_time_get(id, _precision, ptr) {
      const ns = id === 0 ? BigInt(Date.now()) * 1000000n : BigInt(Math.round(performance.now() * 1e6));
      view().setBigUint64(ptr, ns, true);
      return 0;
    },
    clock_res_get(_id, ptr) {
      view().setBigUint64(ptr, 1000n, true);
      return 0;
    },
    random_get(ptr, len) {
      crypto.getRandomValues(bytes().subarray(ptr, ptr + len));
      return 0;
    },
    sched_yield: () => 0,
  };
  return { imports: new Proxy(imports, { get: (t, k) => t[k] ?? (() => ENOSYS) }), stderr: () => errText, flush };
}

// DWARF manzillari CODE bo'limi boshidan hisoblanadi, brauzer stack'i esa fayl boshidan beradi.
function codeStart(bin) {
  let p = 8;
  const leb = () => {
    let r = 0;
    let s = 0;
    let x;
    do {
      x = bin[p++];
      r |= (x & 127) << s;
      s += 7;
    } while (x & 128);
    return r;
  };
  while (p < bin.length) {
    const id = bin[p++];
    const len = leb();
    if (id === 10) return p;
    p += len;
  }
  return 0;
}

const RUNTIME_FN = /^(report|ub|check|safe_strlen|alloc|__asan|__ubsan|__wrap|__original_main$|_start|abort|__)/;

/** Trap bo'lgan joy: o'quvchi kodidagi birinchi kadr -> main.c:qator:ustun. */
async function where(err, wasm, code) {
  const frames = [...String(err.stack).matchAll(/at a\.wasm\.([\w$.:]+) \(wasm:\/\/wasm\/[^:]+:wasm-function\[\d+\]:(0x[0-9a-f]+)\)/g)];
  const own = frames.find((f) => !RUNTIME_FN.test(f[1]) || f[1] === "__original_main");
  if (!own) return "";
  const addr = "0x" + (parseInt(own[2], 16) - codeStart(wasm)).toString(16);
  const log = [];
  await runLLVM(["symbolizer", "--obj=a.wasm", addr], { "a.wasm": wasm }, { stdout: (b) => b && log.push(text(b)), stderr: () => {} }).catch(() => {});
  const m = log.join("").match(/main\.c:(\d+):(\d+)/);
  const fn = own[1] === "__original_main" ? "main" : own[1];
  if (!m) return `\n${fn} funksiyasida.`;
  const [line, col] = [Number(m[1]), Number(m[2])];
  if (!col) return `\nmain.c:${line}, ${fn} funksiyasida:\n${String(line).padStart(4)} | ${code.split("\n")[line - 1] ?? ""}`;
  const src = code.split("\n")[line - 1] ?? "";
  return `\nmain.c:${line}:${col}, ${fn} funksiyasida:\n${String(line).padStart(4)} | ${src}\n     | ${" ".repeat(Math.max(0, col - 1))}^`;
}

const TRAPS = [
  [/call stack|stack size/i, "Stack to'ldi: rekursiya juda chuqur yoki cheksiz."],
  [/out of bounds/i, "Xotira chegarasidan tashqariga murojaat."],
  [/divide by zero/i, "Nolga bo'lish."],
  [/unreachable/i, "Dastur to'xtadi (abort yoki undefined behavior)."],
];

self.onmessage = async (e) => {
  try {
    await ready;
    if (!runtime) throw new Error("C runtime yuklanmadi.");
    const { code, stdin } = e.data;
    const { out, log } = await clang(
      ["-O0", "-g", "-Wall", ...SANITIZE, "-I.", "-o", "a.wasm", "main.c", "runtime.o", "-lm", ...LINK],
      { "main.c": code, ...runtime },
    );
    if (!out) {
      send("err", log.trim() || "Kompilyatsiya xatosi.");
      return;
    }
    if (log.trim()) send("info", log.trim());
    const wasm = out["a.wasm"];
    let memory;
    const sys = wasi(stdin, () => memory);
    const { instance } = await WebAssembly.instantiate(wasm, { wasi_snapshot_preview1: sys.imports });
    memory = instance.exports.memory;
    let exitCode = 0;
    try {
      instance.exports._start();
    } catch (err) {
      if (!(err instanceof Exit)) throw Object.assign(err, { wasm, stderr: sys.stderr() });
      exitCode = err.quiet ? 0 : err.code;
    } finally {
      sys.flush();
    }
    if (exitCode > 0) send("info", `Dastur ${exitCode} kodi bilan tugadi.`);
  } catch (err) {
    if (!err.wasm) send("err", String(err.message || err));
    else {
      // Runtime sababini o'zi yozgan bo'lsa (XOTIRA XATOSI, UNDEFINED BEHAVIOR) - faqat joyi qo'shiladi.
      const reported = /(XOTIRA XATOSI|UNDEFINED BEHAVIOR):/.test(err.stderr);
      const known = TRAPS.find(([re]) => re.test(err.message));
      const lead = reported ? "" : `\n${known?.[1] ?? `Dastur to'xtadi: ${err.message}`}`;
      send("err", lead + (await where(err, err.wasm, e.data.code)));
    }
  } finally {
    postMessage({ type: "done" });
  }
};
