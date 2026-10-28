// Reyting uchun umumiy qiymatlar: forma, API va admin bir xil ro'yxatdan foydalanadi.

export const RATING_TAGS = [
  "Ajoyib tushuntirilgan",
  "Misollar kam",
  "Juda qiyin",
  "Juda oson",
  "Juda uzun",
  "Xato bor",
] as const;

export const COMMENT_MAX = 1000;

/** Bitta IP soatiga shuncha bahodan ko'p yubora olmaydi. */
export const RATE_LIMIT_PER_HOUR = 60;
