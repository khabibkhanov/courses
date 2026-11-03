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
  "-Wl,--wrap=malloc,--wrap=free,--wrap=calloc,--wrap=realloc,--wrap=strcpy,--wrap=strcat,--wrap=strlen,--wrap=__main_void,--wrap=__main_argc_argv",
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
 * Kichik WASI: stdin/stdout/stderr, argv va xotiradagi bitta papka (fayllar ro'yxati, fopen uchun).
 * stdin qatorma-qator beriladi va natijaga terminaldagidek yoziladi.
 * stderr() - dastur stderr'ga yozgan matn (runtime hisoboti bormi, bilish uchun).
 * changed() - dastur yaratgan yoki o'zgartirgan fayllar.
 */
function wasi(stdinText, argv, inputFiles, memory) {
  const enc = new TextEncoder();
  const args = argv.map((a) => enc.encode(a + "\0"));
  // Fayl tizimi: fd 3 - "." papkasi (preopen), 4 va undan keyingilari - ochilgan fayllar.
  const fs = new Map(inputFiles.map((f) => [f.name, { data: enc.encode(f.text), size: enc.encode(f.text).length, dirty: false }]));
  const open = new Map();
  let nextFd = 4;
  const DIR = 3;
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
  const ENOENT = 44;
  const EEXIST = 20;
  const EINVAL = 28;
  const ENOTDIR = 54;
  const FILE_LIMIT = 4 << 20; // bitta fayl uchun 4 MB
  const iov = (iovs, n) => {
    const v = view();
    return Array.from({ length: n }, (_, i) => [v.getUint32(iovs + i * 8, true), v.getUint32(iovs + i * 8 + 4, true)]);
  };
  const pathAt = (ptr, len) => dec.decode(bytes().slice(ptr, ptr + len)).replace(/^\.\//, "");
  const grow = (f, need) => {
    if (need <= f.data.length) return;
    const next = new Uint8Array(Math.max(need, f.data.length * 2, 64));
    next.set(f.data.subarray(0, f.size));
    f.data = next;
  };
  const fileWrite = (h, iovs, n, nwritten) => {
    if (!h.write) return EBADF;
    const f = h.file;
    let total = 0;
    for (const [ptr, len] of iov(iovs, n)) {
      const at = h.append ? f.size : h.pos;
      if (at + len > FILE_LIMIT) return 22; // EFBIG
      grow(f, at + len);
      f.data.set(bytes().subarray(ptr, ptr + len), at);
      h.pos = at + len;
      f.size = Math.max(f.size, h.pos);
      total += len;
    }
    if (total) f.dirty = true;
    view().setUint32(nwritten, total, true);
    return 0;
  };
  const fileRead = (h, iovs, n, nread) => {
    if (!h.read) return EBADF;
    const f = h.file;
    let total = 0;
    for (const [ptr, len] of iov(iovs, n)) {
      const take = f.data.subarray(h.pos, Math.min(f.size, h.pos + len));
      bytes().set(take, ptr);
      h.pos += take.length;
      total += take.length;
      if (take.length < len) break;
    }
    view().setUint32(nread, total, true);
    return 0;
  };
  // filestat: dev, ino, filetype, nlink, size, atim, mtim, ctim (64 bayt).
  const filestat = (ptr, type, size) => {
    const v = view();
    for (let i = 0; i < 64; i++) v.setUint8(ptr + i, 0);
    v.setUint8(ptr + 16, type);
    v.setBigUint64(ptr + 24, 1n, true);
    v.setBigUint64(ptr + 32, BigInt(size), true);
  };
  const imports = {
    fd_write(fd, iovs, n, nwritten) {
      if (open.has(fd)) return fileWrite(open.get(fd), iovs, n, nwritten);
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
      if (open.has(fd)) return fileRead(open.get(fd), iovs, n, nread);
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
      // 2 - character device (stdout qatorma-qator buferlanadi), 3 - papka, 4 - oddiy fayl.
      const type = fd <= 2 ? 2 : fd === DIR ? 3 : open.has(fd) ? 4 : 0;
      if (!type) return EBADF;
      const v = view();
      for (let i = 0; i < 24; i++) v.setUint8(ptr + i, 0);
      v.setUint8(ptr, type);
      if (open.get(fd)?.append) v.setUint16(ptr + 2, 1, true);
      v.setBigUint64(ptr + 8, 0xffffffffffffffffn, true);
      v.setBigUint64(ptr + 16, 0xffffffffffffffffn, true);
      return 0;
    },
    fd_fdstat_set_flags: () => 0,
    fd_close(fd) {
      open.delete(fd);
      return 0;
    },
    fd_seek(fd, offset, whence, newoffset) {
      const h = open.get(fd);
      if (!h) return fd <= 2 ? 70 : EBADF; // ESPIPE: terminalda seek yo'q
      const base = whence === 0 ? 0 : whence === 1 ? h.pos : h.file.size;
      const pos = base + Number(offset);
      if (pos < 0) return EINVAL;
      h.pos = pos;
      view().setBigUint64(newoffset, BigInt(pos), true);
      return 0;
    },
    fd_tell(fd, ptr) {
      const h = open.get(fd);
      if (!h) return EBADF;
      view().setBigUint64(ptr, BigInt(h.pos), true);
      return 0;
    },
    fd_filestat_get(fd, ptr) {
      if (fd === DIR) filestat(ptr, 3, 0);
      else if (open.has(fd)) filestat(ptr, 4, open.get(fd).file.size);
      else if (fd <= 2) filestat(ptr, 2, 0);
      else return EBADF;
      return 0;
    },
    fd_prestat_get(fd, ptr) {
      if (fd !== DIR) return EBADF;
      view().setUint8(ptr, 0);
      view().setUint32(ptr + 4, 1, true);
      return 0;
    },
    fd_prestat_dir_name(fd, ptr) {
      if (fd !== DIR) return EBADF;
      bytes().set([0x2e], ptr); // "."
      return 0;
    },
    path_open(dirfd, _dirflags, ptr, len, oflags, rights, _inh, fdflags, fdOut) {
      if (dirfd !== DIR) return EBADF;
      const name = pathAt(ptr, len);
      if (!name || name === "." || name.includes("/")) return name.includes("/") ? ENOENT : 31; // EISDIR
      if (oflags & 2) return ENOTDIR;
      let file = fs.get(name);
      if (!file) {
        if (!(oflags & 1)) return ENOENT;
        file = { data: new Uint8Array(0), size: 0, dirty: true };
        fs.set(name, file);
      } else if (oflags & 4) return EEXIST;
      const r = BigInt(rights);
      const write = (r & 64n) !== 0n; // FD_WRITE
      if (oflags & 8 && write) {
        file.size = 0;
        file.dirty = true;
      }
      const fd = nextFd++;
      open.set(fd, { file, pos: 0, read: (r & 2n) !== 0n, write, append: (fdflags & 1) !== 0 });
      view().setUint32(fdOut, fd, true);
      return 0;
    },
    path_filestat_get(dirfd, _flags, ptr, len, out) {
      if (dirfd !== DIR) return EBADF;
      const name = pathAt(ptr, len);
      if (name === "." || name === "") return filestat(out, 3, 0), 0;
      const f = fs.get(name);
      if (!f) return ENOENT;
      filestat(out, 4, f.size);
      return 0;
    },
    path_unlink_file(dirfd, ptr, len) {
      if (dirfd !== DIR) return EBADF;
      const name = pathAt(ptr, len);
      if (!fs.delete(name)) return ENOENT;
      removed.add(name);
      return 0;
    },
    proc_exit(code) {
      throw new Exit(code);
    },
    args_sizes_get(argc, size) {
      view().setUint32(argc, args.length, true);
      view().setUint32(size, args.reduce((s, a) => s + a.length, 0), true);
      return 0;
    },
    args_get(argv, buf) {
      let p = buf;
      args.forEach((a, i) => {
        view().setUint32(argv + i * 4, p, true);
        bytes().set(a, p);
        p += a.length;
      });
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
  const removed = new Set();
  const changed = () => [
    ...[...fs].filter(([, f]) => f.dirty).map(([name, f]) => ({ name, data: f.data.slice(0, f.size) })),
    ...[...removed].filter((n) => !fs.has(n)).map((name) => ({ name, data: null })),
  ];
  // fclose qilinmagan fayllar (FILE tuzilmasi leak hisobotida ham ko'rinadi).
  const unclosed = () => [...new Set([...open.values()].map((h) => [...fs].find(([, f]) => f === h.file)?.[0]).filter(Boolean))];
  return { imports: new Proxy(imports, { get: (t, k) => t[k] ?? (() => ENOSYS) }), stderr: () => errText, flush, changed, unclosed };
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

/** Dastur yozgan fayl: matn bo'lsa - matni, aks holda boshidagi baytlar hex ko'rinishida. */
function fileOutput({ name, data }) {
  if (!data) return { kind: "file", name, size: -1, text: null };
  let text = null;
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(data);
    if (/[\0-\x08\x0e-\x1f]/.test(text)) text = null;
  } catch {}
  const hex = text === null ? [...data.subarray(0, 64)].map((b) => b.toString(16).padStart(2, "0")).join(" ") : null;
  return { kind: "file", name, size: data.length, text: text === null ? null : text.slice(0, 20000), hex };
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
    const { code, stdin, argv = ["./main"], files = [] } = e.data;
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
    const sys = wasi(stdin, argv, files, () => memory);
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
      const left = sys.unclosed();
      if (left.length) send("err", `fclose qilinmagan fayl: ${left.join(", ")}\n`);
      for (const f of sys.changed()) postMessage({ type: "out", out: fileOutput(f) });
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
