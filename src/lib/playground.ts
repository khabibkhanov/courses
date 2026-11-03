// ```<til> run bloklari darsda tahrirlanadigan va ishga tushiriladigan kodga aylanadi.
export const RUN_LANGS = {
  python: "python",
  py: "python",
  sql: "sql",
  js: "js",
  javascript: "js",
  ts: "ts",
  typescript: "ts",
  c: "c",
  go: "go",
  golang: "go",
} as const;

export type RunLang = (typeof RUN_LANGS)[keyof typeof RUN_LANGS];
/**
 * tests - shu blokdan keyin kelgan ```<til> test blokining kodi (o'quvchiga ko'rinmaydi).
 * stdin - keyingi ```text stdin bloki: dastur kirishi uchun boshlang'ich matn (o'quvchi o'zgartira oladi).
 * args - ```text args bloki: terminaldagi buyruq qatori, masalan "./caesar 3" (birinchi so'z - argv[0]).
 * files - ```text file <nom> bloklari: dastur fopen bilan o'qiy oladigan fayllar.
 */
export type PlaygroundSpec = {
  lang: RunLang;
  code: string;
  tests?: string;
  stdin?: string;
  args?: string;
  files?: { name: string; text: string }[];
};

/** Test bloki faqat shu tillarda: check(nom, () => shart) yordamchisi bilan. */
export const TESTABLE: RunLang[] = ["python", "js", "ts"];

/** Kirish (stdin), buyruq qatori (args) va fayllar (file) bor tillar. */
export const STDIN_LANGS: RunLang[] = ["c"];

/** Fayl nomi: papkasiz, oddiy belgilar. */
export const FILE_NAME = /^[\w.-]+$/;

/** Buyruq qatorini so'zlarga ajratadi: qo'shtirnoq ichidagi bo'shliq so'zni bo'lmaydi. */
export function splitArgs(line: string): string[] {
  return [...line.matchAll(/"([^"]*)"|'([^']*)'|(\S+)/g)].map((m) => m[1] ?? m[2] ?? m[3]);
}

export const runLang = (fenceLang: string): RunLang | undefined => RUN_LANGS[fenceLang as keyof typeof RUN_LANGS];
