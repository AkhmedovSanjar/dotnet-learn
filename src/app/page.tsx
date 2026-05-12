import Link from "next/link";
import {
  ArrowRight,
  Binary,
  BookOpenText,
  ChartNoAxesCombined,
  Compass,
  ListChecks,
  Sparkles,
} from "lucide-react";

import { LessonCard } from "@/components/LessonCard";
import { ProgressBar } from "@/components/ProgressBar";
import { SearchLessons } from "@/components/SearchLessons";
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
  const spotlightModules = curriculum.modules.slice(0, 4);
  const nextLesson = dashboard.recommendedLesson ?? curriculum.lessons[0];
  const searchItems = curriculum.lessons.map((lesson) => ({
    id: lesson.id,
    title: lesson.title,
    description: lesson.description,
    difficulty: lesson.difficulty,
    moduleTitle: lesson.moduleTitle,
    moduleSlug: lesson.moduleSlug,
    slug: lesson.slug,
  }));

  return (
    <div className="mx-auto flex w-full max-w-[120rem] flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
        <div className="hero-grid rounded-[34px] border border-[color:var(--border-color)] bg-white/95 p-6 shadow-[var(--shadow-soft)] dark:bg-slate-950/80 lg:p-8">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">
            <span className="rounded-full bg-[#eef5ff] px-3 py-1 text-[#245da6] ring-1 ring-inset ring-[#cfe1ff]">
              Main learning hub
            </span>
            <span>Compact learning dashboard</span>
          </div>

          <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-5xl xl:text-6xl">
            {siteConfig.tagline}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg sm:leading-8">
            Learn backend development step by step with calm explanations, real
            C#/.NET examples, request/response walkthroughs, debugging habits,
            quizzes, and practical tasks you can actually use in junior-level work.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href={nextLesson ? `/learn/${nextLesson.moduleSlug}/${nextLesson.slug}` : "/dashboard"}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
            >
              {dashboard.completedLessons > 0 ? "Continue learning" : "Start learning"}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/roadmap"
              className="inline-flex items-center justify-center rounded-full border border-[color:var(--border-color)] px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-[color:var(--accent)] hover:text-slate-950 dark:text-slate-200"
            >
              View Learning Roadmap
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
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

          <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_0.95fr]">
            <div className="compact-card rounded-[26px] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
                    Next focus
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    {nextLesson?.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {nextLesson?.description}
                  </p>
                </div>
                <Sparkles className="mt-1 h-5 w-5 text-[color:var(--accent)]" />
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
                <span className="rounded-full bg-[var(--surface-muted)] px-3 py-1">
                  {nextLesson?.moduleTitle}
                </span>
                <span className="rounded-full bg-[var(--surface-muted)] px-3 py-1">
                  {nextLesson?.difficulty}
                </span>
                <span className="rounded-full bg-[var(--surface-muted)] px-3 py-1">
                  {nextLesson?.duration}
                </span>
              </div>
            </div>

            <div className="compact-card rounded-[26px] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
                    Overall progress
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    {dashboard.overallProgress}%
                  </p>
                </div>
                <Compass className="h-5 w-5 text-[color:var(--accent)]" />
              </div>
              <ProgressBar value={dashboard.overallProgress} className="mt-4 h-2.5" />
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-300">
                {dashboard.completedLessons} of {dashboard.totalLessons} lessons completed.
              </p>
            </div>
          </div>
        </div>

        <div className="grid-surface rounded-[34px] border border-[color:var(--border-color)] bg-white/95 p-5 shadow-[var(--shadow-soft)] dark:bg-slate-950/80">
          <div className="rounded-[28px] border border-[#d7e6fb] bg-[linear-gradient(135deg,#ffffff_0%,#f4f9ff_65%,#ebf5ff_100%)] p-5 shadow-[0_24px_60px_rgba(47,128,237,0.12)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">
                  Learning dashboard
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                  Track real growth, not random reading
                </h2>
              </div>
              <div className="rounded-2xl border border-[#d7e6fb] bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                {dashboard.completedLessons}/{dashboard.totalLessons}
              </div>
            </div>

            <div className="mt-6 rounded-[28px] border border-[#d7e6fb] bg-white p-5">
              <div className="flex items-center justify-between text-sm text-slate-700">
                <span>Overall progress</span>
                <span>{dashboard.overallProgress}%</span>
              </div>
              <ProgressBar value={dashboard.overallProgress} className="mt-3" />
            </div>

            <div className="mt-6 grid gap-3">
              {spotlightModules.map((module, index) => (
                <div
                  key={module.id}
                  className="rounded-[22px] border border-[#d7e6fb] bg-white/90 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
                      Module {index + 1}
                    </p>
                    <span className="rounded-full bg-[#eef5ff] px-3 py-1 text-xs font-semibold text-[#245da6]">
                      {module.pace}
                    </span>
                  </div>
                  <h3 className="mt-2 text-lg font-semibold text-slate-950">{module.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {module.summary}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {module.focusAreas.slice(0, 3).map((area) => (
                      <span
                        key={area}
                        className="rounded-full border border-[#d7e6fb] bg-white px-2.5 py-1 text-xs font-semibold text-slate-600"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SearchLessons
          lessons={searchItems}
          modules={curriculum.modules.map((module) => module.title)}
          title="Find a lesson without digging through the whole roadmap"
          description="Search by topic, tool, or concept and jump straight into the next useful explanation."
          limit={6}
        />

        <div className="rounded-[30px] border border-[color:var(--border-color)] bg-white/95 p-6 shadow-[var(--shadow-soft)] dark:bg-slate-950/80">
          <p className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">
            Module explorer
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Module info that is easier to scan
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
            Each module now shows what it covers, how fast it moves, and the main skills you should expect to build.
          </p>

          <div className="mt-6 space-y-3">
            {curriculum.modules.slice(0, 5).map((module, index) => (
              <div
                key={module.id}
                className="rounded-[24px] bg-slate-50 p-4 dark:bg-slate-900"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-sm font-semibold text-slate-950 shadow-sm dark:bg-slate-950 dark:text-white">
                    {index + 1}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold tracking-tight text-slate-950 dark:text-white">
                    {module.title}
                      </h3>
                      <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-500 ring-1 ring-inset ring-[color:var(--border-color)] dark:bg-slate-950">
                        {module.category}
                      </span>
                      <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-500 ring-1 ring-inset ring-[color:var(--border-color)] dark:bg-slate-950">
                        {module.pace}
                      </span>
                    </div>
                    <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {module.summary}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {module.focusAreas.map((area) => (
                        <span
                          key={area}
                          className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-500 ring-1 ring-inset ring-[color:var(--border-color)] dark:bg-slate-950"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
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
