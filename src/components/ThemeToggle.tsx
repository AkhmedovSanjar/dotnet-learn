"use client";

import { MoonStar, SunMedium } from "lucide-react";

import { useThemeMode } from "@/app/providers";
import { cn } from "@/shared/utils/cn";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useThemeMode();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--border-color)] bg-white text-slate-700 shadow-sm transition hover:border-[color:var(--accent)] hover:text-slate-950 dark:bg-slate-900 dark:text-slate-100",
        className,
      )}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
    </button>
  );
}
