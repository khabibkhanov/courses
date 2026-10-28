// Matnga izoh turlari: forma, API va admin bir xil ro'yxatdan foydalanadi.

export const FEEDBACK_KINDS = {
  wrong: { label: "Noto'g'ri", hint: "Fakt, raqam yoki kod xato" },
  unclear: { label: "G'aliz", hint: "Tushunarsiz yoki og'ir jumla" },
  typo: { label: "Imlo", hint: "Imlo yoki tinish belgisi" },
  suggestion: { label: "Taklif", hint: "Misol yoki tushuntirish qo'shish" },
} as const;

export type FeedbackKind = keyof typeof FEEDBACK_KINDS;
export const FEEDBACK_KIND_KEYS = Object.keys(FEEDBACK_KINDS) as [FeedbackKind, ...FeedbackKind[]];

export const FEEDBACK_STATUSES = {
  new: "Yangi",
  fixed: "Tuzatildi",
  rejected: "Rad etildi",
} as const;
export type FeedbackStatus = keyof typeof FEEDBACK_STATUSES;

export const QUOTE_MAX = 500;
export const CONTEXT_LEN = 32;
export const FEEDBACK_COMMENT_MAX = 1000;
export const FEEDBACK_PER_HOUR = 30;

/** Bo'sh joylarni bitta probelga keltirish: belgilangan matn va dars matnini solishtirish uchun. */
export const normalize = (s: string) => s.replace(/\s+/g, " ").trim();
