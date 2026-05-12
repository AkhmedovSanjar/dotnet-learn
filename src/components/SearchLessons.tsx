"use client";

import Link from "next/link";
import { Filter, Search } from "lucide-react";
import { startTransition, useDeferredValue, useState } from "react";

import { cn } from "@/shared/utils/cn";

interface SearchLessonItem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  moduleTitle: string;
  moduleSlug: string;
  slug: string;
}

export function SearchLessons({
  lessons,
  modules,
  className,
  initialQuery = "",
  title = "Find the right lesson quickly",
  description,
  limit = 8,
}: {
  lessons: SearchLessonItem[];
  modules: string[];
  className?: string;
  initialQuery?: string;
  title?: string;
  description?: string;
  limit?: number;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [selectedModule, setSelectedModule] = useState("All modules");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All levels");
  const deferredQuery = useDeferredValue(query);

  const filteredLessons = lessons.filter((lesson) => {
    const matchesQuery =
      deferredQuery.trim().length === 0 ||
      `${lesson.title} ${lesson.description} ${lesson.moduleTitle}`
        .toLowerCase()
        .includes(deferredQuery.toLowerCase());
    const matchesModule =
      selectedModule === "All modules" || lesson.moduleTitle === selectedModule;
    const matchesDifficulty =
      selectedDifficulty === "All levels" || lesson.difficulty === selectedDifficulty;

    return matchesQuery && matchesModule && matchesDifficulty;
  });

  return (
    <section className={cn("rounded-[28px] border border-[color:var(--border-color)] bg-white/95 p-5 shadow-[var(--shadow-soft)] dark:bg-slate-950/70", className)}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">
            Search lessons
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {title}
          </h2>
          {description ? (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              {description}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-3 md:flex-row">
          <label className="flex min-w-[220px] items-center gap-3 rounded-2xl border border-[color:var(--border-color)] bg-slate-50 px-4 py-3 dark:bg-slate-900">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(event) =>
                startTransition(() => setQuery(event.target.value))
              }
              placeholder="Search DTO, Swagger, EF Core..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-[color:var(--border-color)] bg-slate-50 px-4 py-3 text-sm dark:bg-slate-900">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={selectedModule}
              onChange={(event) =>
                startTransition(() => setSelectedModule(event.target.value))
              }
              className="bg-transparent outline-none"
            >
              <option>All modules</option>
              {modules.map((module) => (
                <option key={module}>{module}</option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-[color:var(--border-color)] bg-slate-50 px-4 py-3 text-sm dark:bg-slate-900">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={selectedDifficulty}
              onChange={(event) =>
                startTransition(() => setSelectedDifficulty(event.target.value))
              }
              className="bg-transparent outline-none"
            >
              <option>All levels</option>
              <option>Beginner</option>
              <option>Junior</option>
              <option>Intermediate</option>
            </select>
          </label>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filteredLessons.slice(0, limit).map((lesson) => (
          <Link
            key={lesson.id}
            href={`/learn/${lesson.moduleSlug}/${lesson.slug}`}
            className="rounded-[22px] border border-[color:var(--border-color)] bg-slate-50/70 p-4 transition hover:border-[color:var(--accent)] hover:bg-white dark:bg-slate-900/70"
          >
            <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
              {lesson.moduleTitle}
            </p>
            <h3 className="mt-2 text-lg font-semibold tracking-tight text-slate-950 dark:text-white">
              {lesson.title}
            </h3>
            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {lesson.description}
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="rounded-full bg-white px-2.5 py-1 ring-1 ring-inset ring-[color:var(--border-color)] dark:bg-slate-950">
                {lesson.difficulty}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {filteredLessons.length === 0 ? (
        <div className="mt-6 rounded-[22px] border border-dashed border-[color:var(--border-color)] bg-[var(--surface-muted)] px-4 py-5 text-sm text-slate-500 dark:text-slate-300">
          No lessons matched that search yet. Try a module name, tool, or concept like DTO, SQL, DI, or breakpoints.
        </div>
      ) : null}
    </section>
  );
}
