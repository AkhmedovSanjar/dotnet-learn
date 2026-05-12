import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";

import type { Lesson } from "@/lessons/contracts";
import { cn } from "@/shared/utils/cn";

const difficultyTone = {
  Beginner:
    "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-500/20",
  Junior:
    "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200 dark:bg-sky-500/10 dark:text-sky-200 dark:ring-sky-500/20",
  Intermediate:
    "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200 dark:bg-amber-500/10 dark:text-amber-200 dark:ring-amber-500/20",
};

export function LessonCard({
  lesson,
  href,
  compact = false,
}: {
  lesson: Pick<
    Lesson,
    "title" | "description" | "duration" | "difficulty" | "moduleTitle" | "moduleSlug" | "slug"
  >;
  href?: string;
  compact?: boolean;
}) {
  const target = href ?? `/learn/${lesson.moduleSlug}/${lesson.slug}`;

  return (
    <Link
      href={target}
      className={cn(
        "group relative flex flex-col rounded-[28px] border border-[color:var(--border-color)] bg-white/95 p-5 shadow-[var(--shadow-soft)] transition duration-200 hover:-translate-y-1 hover:border-[color:var(--accent)] dark:bg-slate-950/70",
        compact ? "gap-3" : "gap-4",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
            {lesson.moduleTitle}
          </p>
          <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {lesson.title}
          </h3>
        </div>
        <ArrowUpRight className="h-5 w-5 text-slate-400 transition group-hover:text-[color:var(--accent-strong)]" />
      </div>

      <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
        {lesson.description}
      </p>

      <div className="mt-auto flex flex-wrap items-center gap-3">
        <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", difficultyTone[lesson.difficulty])}>
          {lesson.difficulty}
        </span>
        <span className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Clock3 className="h-4 w-4" />
          {lesson.duration}
        </span>
      </div>
    </Link>
  );
}
