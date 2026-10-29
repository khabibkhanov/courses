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
} as const;

export type RunLang = (typeof RUN_LANGS)[keyof typeof RUN_LANGS];
/**
 * tests - shu blokdan keyin kelgan ```<til> test blokining kodi (o'quvchiga ko'rinmaydi).
 * stdin - keyingi ```text stdin bloki: dastur kirishi uchun boshlang'ich matn (o'quvchi o'zgartira oladi).
 */
export type PlaygroundSpec = { lang: RunLang; code: string; tests?: string; stdin?: string };

/** Test bloki faqat shu tillarda: check(nom, () => shart) yordamchisi bilan. */
export const TESTABLE: RunLang[] = ["python", "js", "ts"];

/** Kirish (stdin) maydoni bor tillar. */
export const STDIN_LANGS: RunLang[] = ["c"];

export const runLang = (fenceLang: string): RunLang | undefined => RUN_LANGS[fenceLang as keyof typeof RUN_LANGS];
