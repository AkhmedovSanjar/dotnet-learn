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
}: {
  lessons: SearchLessonItem[];
  modules: string[];
  className?: string;
}) {
  const [query, setQuery] = useState("");
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
    <section className={cn("rounded-[32px] border border-[color:var(--border-color)] bg-white/95 p-6 shadow-[var(--shadow-soft)] dark:bg-slate-950/70", className)}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">
            Search lessons
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Find the right lesson quickly
          </h2>
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

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {filteredLessons.slice(0, 8).map((lesson) => (
          <Link
            key={lesson.id}
            href={`/learn/${lesson.moduleSlug}/${lesson.slug}`}
            className="rounded-[24px] border border-[color:var(--border-color)] bg-slate-50/70 p-4 transition hover:border-[color:var(--accent)] hover:bg-white dark:bg-slate-900/70"
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
          </Link>
        ))}
      </div>
    </section>
  );
}
