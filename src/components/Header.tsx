"use client";

import { Bell, Flame, Search } from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { ThemeToggle } from "@/components/ThemeToggle";

export function Header({ streakDays = 0 }: { streakDays?: number }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/dashboard?query=${encodeURIComponent(trimmed)}` : "/dashboard");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--border-color)] bg-white/95 backdrop-blur-xl">
      <div className="flex min-h-14 items-center gap-3 px-4">
        <form
          onSubmit={handleSearchSubmit}
          className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-lg border border-[color:var(--border-color)] bg-white px-3 shadow-[0_6px_14px_rgba(15,23,42,0.035)] xl:max-w-5xl"
        >
          <Search className="h-4 w-4 shrink-0 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search lessons, topics, or code examples..."
            className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
          <span className="hidden rounded-md border border-[color:var(--border-color)] bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-400 sm:inline-flex">
            Ctrl K
          </span>
        </form>

        <div className="hidden items-center gap-2 md:flex">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Flame className="h-4 w-4 fill-amber-500 text-amber-500" />
            <span>{streakDays}</span>
          </div>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[color:var(--border-color)] bg-white text-slate-500 transition hover:text-slate-950"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
          </button>
          <ThemeToggle className="rounded-lg" />
        </div>
      </div>
    </header>
  );
}
