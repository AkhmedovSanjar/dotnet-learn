import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { Lesson } from "@/lessons/contracts";
import { cn } from "@/shared/utils/cn";

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
        "group relative flex flex-col rounded-[24px] border border-[color:var(--border-color)] bg-white/95 p-4 shadow-[var(--shadow-card)] transition duration-200 hover:-translate-y-1 hover:border-[color:var(--accent)] dark:bg-slate-950/70",
        compact ? "gap-3" : "gap-4",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-slate-950 dark:text-white sm:text-xl">
            {lesson.title}
          </h3>
        </div>
        <ArrowUpRight className="h-5 w-5 text-slate-400 transition group-hover:text-[color:var(--accent-strong)]" />
      </div>
    </Link>
  );
}
