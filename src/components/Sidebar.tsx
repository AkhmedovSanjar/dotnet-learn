"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  Bookmark,
  BookOpenText,
  ChevronRight,
  Code,
  GraduationCap,
  House,
  ListChecks,
  NotebookPen,
  PencilRuler,
} from "lucide-react";

import type { Lesson, ModuleSummary } from "@/lessons/contracts";
import { ProgressBar } from "@/components/ProgressBar";
import { cn } from "@/shared/utils/cn";

const quickLinks = [
  { href: "/", label: "Home", icon: House },
  { href: "/dashboard", label: "Dashboard", icon: GraduationCap },
  { href: "/roadmap", label: "Lessons", icon: BookOpenText },
  { href: "/api-learning", label: "Practice", icon: PencilRuler },
  { href: "/debugging", label: "Quizzes", icon: ListChecks },
  { href: "/playground", label: "Code Playground", icon: Code },
  { href: "/achievements", label: "Achievements", icon: Award },
  { href: "/git-playground", label: "Notes", icon: NotebookPen },
  { href: "/bookmarks", label: "Bookmarks", icon: Bookmark },
];

export function Sidebar({
  modules,
  activeModuleSlug,
  activeLessonSlug,
  overallProgress,
  lessons,
}: {
  modules: ModuleSummary[];
  activeModuleSlug?: string;
  activeLessonSlug?: string;
  overallProgress?: number;
  lessons?: Lesson[];
}) {
  const pathname = usePathname();

  function isActiveLink(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <aside className="top-24 h-fit rounded-[32px] border border-[color:var(--border-color)] bg-white p-4 shadow-[var(--shadow-soft)] dark:bg-slate-950/80 lg:sticky">
      <div className="space-y-1">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          const active = isActiveLink(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-[18px] px-4 py-3 text-sm font-medium transition",
                active
                  ? "bg-[linear-gradient(135deg,var(--accent),#3d9eff)] text-white shadow-[0_12px_24px_rgba(47,128,237,0.22)]"
                  : "text-slate-600 hover:bg-[var(--surface-muted)] hover:text-slate-900 dark:text-slate-200",
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="mt-6 border-t border-[color:var(--border-color)] pt-6">
        <p className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
          Modules
        </p>
        <h2 className="mt-3 max-w-[12rem] text-[1.6rem] leading-tight font-semibold tracking-tight text-slate-900 dark:text-white">
          15 modules, one clear path
        </h2>
      </div>

      {typeof overallProgress === "number" ? (
        <div className="mt-5 rounded-[24px] border border-[color:var(--border-color)] bg-[var(--surface-muted)] p-4 dark:bg-slate-900">
          <div className="flex items-center justify-between text-sm font-semibold text-slate-700 dark:text-slate-200">
            <span>Overall progress</span>
            <span>{overallProgress}%</span>
          </div>
          <ProgressBar value={overallProgress} className="mt-3 h-2.5" />
        </div>
      ) : null}

      <div className="mt-5 space-y-3">
        {modules.map((module) => {
          const isActive = module.slug === activeModuleSlug;
          return (
            <div
              key={module.id}
              className="rounded-[24px] border border-[color:var(--border-color)] bg-white p-3 dark:bg-slate-900/70"
            >
              <Link
                href={`/learn/${module.slug}`}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-[18px] px-3 py-3 text-sm font-semibold transition",
                  isActive
                    ? "bg-[var(--surface-muted)] text-slate-950 ring-1 ring-inset ring-[color:var(--border-color)] dark:bg-white dark:text-slate-950"
                    : "text-slate-700 hover:bg-[var(--surface-muted)] dark:text-slate-100 dark:hover:bg-slate-950",
                )}
              >
                <span>{module.title}</span>
                <ChevronRight className="h-4 w-4" />
              </Link>

              {isActive && lessons?.length ? (
                <div className="mt-3 space-y-2">
                  {lessons.map((lesson) => (
                    <Link
                      key={lesson.id}
                      href={`/learn/${lesson.moduleSlug}/${lesson.slug}`}
                      className={cn(
                        "block rounded-2xl px-3 py-2.5 text-sm transition",
                        lesson.slug === activeLessonSlug
                          ? "bg-[#eaf3ff] font-semibold text-[#245da6] ring-1 ring-inset ring-[#cfe1ff] dark:bg-sky-500/10 dark:text-sky-100"
                          : "text-slate-600 hover:bg-[var(--surface-muted)] dark:text-slate-300 dark:hover:bg-slate-950",
                      )}
                    >
                      {lesson.title}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
