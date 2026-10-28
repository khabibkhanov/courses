"use client";

import { ThemeProvider as NextThemes, useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemes attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
    </NextThemes>
  );
}

const OPTIONS = [
  { value: "system", label: "Tizim", Icon: Monitor },
  { value: "light", label: "Yorug'", Icon: Sun },
  { value: "dark", label: "Qorong'i", Icon: Moon },
] as const;

const noop = () => () => {};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  // Tanlov faqat brauzerda ma'lum: serverda hech biri belgilanmaydi.
  const mounted = useSyncExternalStore(noop, () => true, () => false);

  return (
    <div role="radiogroup" aria-label="Mavzu" className="flex items-center rounded-full border border-rule p-0.5">
      {OPTIONS.map(({ value, label, Icon }) => {
        const active = mounted && theme === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={label}
            title={label}
            onClick={() => setTheme(value)}
            className={`grid h-7 w-7 place-items-center rounded-full transition-colors ${
              active ? "bg-ink text-paper" : "text-muted hover:text-ink"
            }`}
          >
            <Icon size={14} strokeWidth={2} aria-hidden />
          </button>
        );
      })}
    </div>
  );
}
