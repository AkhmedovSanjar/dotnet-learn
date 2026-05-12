import Link from "next/link";
import {
  ArrowRight,
  Binary,
  BookOpenText,
  ChartNoAxesCombined,
  ListChecks,
} from "lucide-react";

import { LessonCard } from "@/components/LessonCard";
import { ProgressBar } from "@/components/ProgressBar";
import { StatCard } from "@/components/StatCard";
import { buildDashboardState } from "@/progress/logic";
import { listProgressForDefaultUser } from "@/progress/service";
import { buildCurriculum } from "@/modules/curriculum/catalog";
import { siteConfig } from "@/config/site";

export default async function HomePage() {
  const curriculum = buildCurriculum();
  const progress = await listProgressForDefaultUser();
  const dashboard = buildDashboardState(curriculum, progress);
  const featuredLessons = curriculum.lessons.slice(0, 3);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-4 py-10 sm:px-6 lg:px-8">
      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[40px] border border-[color:var(--border-color)] bg-white/95 p-8 shadow-[var(--shadow-soft)] dark:bg-slate-950/80 lg:p-12">
          <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-6xl">
            {siteConfig.tagline}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Learn backend development step by step with calm explanations, real
            C#/.NET examples, request/response walkthroughs, debugging habits,
            quizzes, and practical tasks you can actually use in junior-level work.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
            >
              Start Learning
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/roadmap"
              className="inline-flex items-center justify-center rounded-full border border-[color:var(--border-color)] px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-[color:var(--accent)] hover:text-slate-950 dark:text-slate-200"
            >
              View Learning Roadmap
            </Link>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <StatCard
              icon={BookOpenText}
              label="Lessons"
              value={String(curriculum.lessons.length)}
              hint="Every lesson includes explanation, output, interview framing, and practice."
            />
            <StatCard
              icon={Binary}
              label="Modules"
              value={String(curriculum.modules.length)}
              hint="A step-by-step path from OOP and Git to testing, deployment, and troubleshooting."
            />
            <StatCard
              icon={ChartNoAxesCombined}
              label="Progress"
              value={`${dashboard.overallProgress}%`}
              hint="Saved locally in SQLite so your dashboard reflects real progress."
            />
          </div>
        </div>

        <div className="grid-surface rounded-[40px] border border-[color:var(--border-color)] bg-white/95 p-6 shadow-[var(--shadow-soft)] dark:bg-slate-950/80">
          <div className="rounded-[32px] bg-slate-950 p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold tracking-[0.2em] text-sky-200 uppercase">
                  Learning dashboard
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                  Track real growth, not random reading
                </h2>
              </div>
              <div className="rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold">
                {dashboard.completedLessons}/{dashboard.totalLessons}
              </div>
            </div>

            <div className="mt-6 rounded-[28px] bg-white/8 p-5">
              <div className="flex items-center justify-between text-sm text-slate-200">
                <span>Overall progress</span>
                <span>{dashboard.overallProgress}%</span>
              </div>
              <ProgressBar value={dashboard.overallProgress} className="mt-3 bg-white/10" />
            </div>

            <div className="mt-6 grid gap-4">
              {curriculum.modules.slice(0, 3).map((module, index) => (
                <div
                  key={module.id}
                  className="rounded-[24px] border border-white/10 bg-white/6 p-4"
                >
                  <p className="text-xs font-semibold tracking-[0.18em] text-slate-300 uppercase">
                    Module {index + 1}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold">{module.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    {module.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[36px] border border-[color:var(--border-color)] bg-white/95 p-8 shadow-[var(--shadow-soft)] dark:bg-slate-950/80">
          <p className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">
            Learning path preview
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
            A roadmap designed for day-to-day backend work
          </h2>
          <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">
            Move from object modeling and Git basics into API contracts,
            debugging, EF Core, testing, deployment, and maintainable service design.
          </p>

          <div className="mt-8 space-y-4">
            {curriculum.modules.slice(0, 5).map((module, index) => (
              <div
                key={module.id}
                className="flex items-start gap-4 rounded-[24px] bg-slate-50 p-4 dark:bg-slate-900"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-sm font-semibold text-slate-950 shadow-sm dark:bg-slate-950 dark:text-white">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-slate-950 dark:text-white">
                    {module.title}
                  </h3>
                  <p className="mt-1 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    {module.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">
                Featured lessons
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
                Learn through real backend examples
              </h2>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border-color)] px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200"
            >
              <ListChecks className="h-4 w-4" />
              Browse all lessons
            </Link>
          </div>

          <div className="grid gap-4">
            {featuredLessons.map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
