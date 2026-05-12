import Link from "next/link";
import { ChevronRight } from "lucide-react";

import type { Lesson, ModuleSummary } from "@/lessons/contracts";
import { ProgressBar } from "@/components/ProgressBar";
import { cn } from "@/shared/utils/cn";

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
  return (
    <aside className="top-24 h-fit rounded-[32px] border border-[color:var(--border-color)] bg-white/95 p-5 shadow-[var(--shadow-soft)] dark:bg-slate-950/80 lg:sticky">
      <p className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">
        Learning path
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
        15 modules, one clear path
      </h2>

      {typeof overallProgress === "number" ? (
        <div className="mt-5 rounded-[24px] bg-slate-50 p-4 dark:bg-slate-900">
          <div className="flex items-center justify-between text-sm font-semibold text-slate-700 dark:text-slate-200">
            <span>Overall progress</span>
            <span>{overallProgress}%</span>
          </div>
          <ProgressBar value={overallProgress} className="mt-3" />
        </div>
      ) : null}

      <div className="mt-5 space-y-3">
        {modules.map((module) => {
          const isActive = module.slug === activeModuleSlug;
          return (
            <div key={module.id} className="rounded-[24px] border border-[color:var(--border-color)] bg-slate-50/80 p-3 dark:bg-slate-900/70">
              <Link
                href={`/learn/${module.slug}`}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-[18px] px-3 py-3 text-sm font-semibold transition",
                  isActive
                    ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                    : "text-slate-700 hover:bg-white dark:text-slate-100 dark:hover:bg-slate-950",
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
                          ? "bg-sky-50 font-semibold text-sky-900 dark:bg-sky-500/10 dark:text-sky-100"
                          : "text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-950",
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
