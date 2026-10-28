// ```<til> run bloklari darsda tahrirlanadigan va ishga tushiriladigan kodga aylanadi.
export const RUN_LANGS = {
  python: "python",
  py: "python",
  sql: "sql",
  js: "js",
  javascript: "js",
  ts: "ts",
  typescript: "ts",
} as const;

export type RunLang = (typeof RUN_LANGS)[keyof typeof RUN_LANGS];
export type PlaygroundSpec = { lang: RunLang; code: string };

export const runLang = (fenceLang: string): RunLang | undefined => RUN_LANGS[fenceLang as keyof typeof RUN_LANGS];
