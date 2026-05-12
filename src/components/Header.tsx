"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Flame, Menu, Search, Sparkles, X } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

import { siteConfig } from "@/config/site";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/shared/utils/cn";

export function Header() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  const activeHref = useMemo(() => {
    return siteConfig.navigation.find((item) => {
      if (item.href === "/") return pathname === "/";
      return pathname === item.href || pathname.startsWith(`${item.href}/`);
    })?.href;
  }, [pathname]);

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/dashboard?query=${encodeURIComponent(trimmed)}` : "/dashboard");
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--border-color)] bg-white/88 backdrop-blur-2xl dark:bg-slate-950/88">
      <div className="mx-auto grid w-full max-w-[120rem] gap-3 px-4 py-3 sm:px-6 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--accent),var(--accent-strong))] text-white shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight text-slate-950 dark:text-white">
              DotnetLearn
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-200">
              Backend foundations, taught clearly
            </p>
          </div>
        </Link>

        <div className="hidden lg:flex lg:flex-col lg:items-center lg:justify-center lg:gap-3">
          <form onSubmit={handleSearchSubmit} className="flex w-full max-w-2xl items-center gap-3 rounded-[20px] border border-[color:var(--border-color)] bg-white px-4 py-2.5 shadow-[0_10px_30px_rgba(15,23,42,0.04)] dark:bg-slate-900">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search lessons, topics, or code examples..."
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
            <span className="rounded-lg border border-[color:var(--border-color)] bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-400">
              Ctrl K
            </span>
          </form>
          <nav className="flex w-full max-w-2xl flex-wrap items-center gap-2">
            {siteConfig.navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm font-medium transition",
                  activeHref === item.href
                    ? "bg-[#eef5ff] text-[#245da6] ring-1 ring-inset ring-[#cfe1ff] dark:bg-white dark:text-slate-950"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-amber-50 text-amber-500">
              <Flame className="h-4 w-4" />
            </span>
            <span className="font-semibold text-slate-700">12</span>
          </div>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--border-color)] bg-white text-slate-500 shadow-sm transition hover:text-slate-950"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
          </button>
          <ThemeToggle />
          <div className="flex items-center gap-3 rounded-full border border-[color:var(--border-color)] bg-white px-2 py-2 shadow-sm">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#2f80ed] text-sm font-semibold text-white">
              DL
            </span>
            <div className="pr-2">
              <p className="text-sm font-semibold text-slate-900">Devansh</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--border-color)] bg-white text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-100"
            onClick={() => setOpen((current) => !current)}
            aria-label="Toggle navigation"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-[color:var(--border-color)] bg-white/95 transition-[max-height] duration-300 lg:hidden dark:bg-slate-950/95",
          open ? "max-h-96" : "max-h-0",
        )}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 sm:px-6">
          <form onSubmit={handleSearchSubmit} className="mb-2 flex items-center gap-3 rounded-2xl border border-[color:var(--border-color)] bg-slate-50 px-4 py-3 dark:bg-slate-900">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search lessons or topics"
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </form>
          {siteConfig.navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-2xl px-4 py-3 text-sm font-medium transition dark:text-slate-100 dark:hover:bg-slate-900",
                activeHref === item.href
                  ? "bg-[#eef5ff] text-[#245da6] dark:bg-white dark:text-slate-950"
                  : "text-slate-700 hover:bg-slate-100",
              )}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/dashboard"
            className="mt-2 inline-flex items-center justify-center rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white dark:bg-white dark:text-slate-950"
            onClick={() => setOpen(false)}
          >
            Start Learning
          </Link>
        </div>
      </div>
    </header>
  );
}
