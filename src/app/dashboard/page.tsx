import Link from "next/link";
import {
  ArrowRight,
  BookCheck,
  Flame,
  Sparkles,
  Target,
} from "lucide-react";

import { LessonCard } from "@/components/LessonCard";
import { MetricCard } from "@/components/MetricCard";
import { ProgressBar } from "@/components/ProgressBar";
import { SearchLessons } from "@/components/SearchLessons";
import { buildCurriculum } from "@/modules/curriculum/catalog";
import {
  buildDashboardState,
  computePracticeScore,
  computeStreakDays,
  countQuizzesPassed,
} from "@/progress/logic";
import { listProgressForDefaultUser } from "@/progress/service";

export const metadata = {
  title: "Learning Dashboard",
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string }>;
}) {
  const curriculum = buildCurriculum();
  const progress = await listProgressForDefaultUser();
  const dashboard = buildDashboardState(curriculum, progress);
  const resolvedSearchParams = (await searchParams) ?? {};
  const query = resolvedSearchParams.query ?? "";

  const streak = computeStreakDays(progress);
  const practiceScore = computePracticeScore(progress);
  const quizzes = countQuizzesPassed(progress);
  const totalQuizzes = curriculum.lessons.length;
  const startHref = dashboard.recommendedLesson
    ? `/learn/${dashboard.recommendedLesson.moduleSlug}/${dashboard.recommendedLesson.slug}`
    : "/roadmap";

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
    <div className="mx-auto flex w-full max-w-[120rem] flex-col gap-7 px-4 py-8 sm:px-6 lg:px-8">
      <section className="surface-banner relative overflow-hidden rounded-[36px] border border-[color:var(--border-color)] p-8 shadow-[var(--shadow-soft)] sm:p-10">
        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-slate-500 uppercase">
              Welcome back
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-5xl">
              Become Strong in
              <br />
              <span className="bg-[linear-gradient(135deg,var(--accent),#0ea5b7)] bg-clip-text text-transparent">
                Backend and .NET Fundamentals
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">
              {dashboard.currentLesson
                ? `Pick up where you left off in ${dashboard.currentLesson.moduleTitle}. The next lesson is queued and your progress is saved.`
                : "Start with the first module and build a foundation you will rely on for years."}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href={startHref}
                className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,var(--accent),#3d9eff)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_30px_rgba(47,128,237,0.25)] transition hover:-translate-y-0.5"
              >
                Start Learning
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/roadmap"
                className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border-color)] bg-white px-5 py-3 text-sm font-semibold text-slate-700"
              >
                Browse the roadmap
              </Link>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="absolute -right-6 -top-6 h-48 w-48 rounded-[40px] bg-[linear-gradient(135deg,#dbe9ff,#ffffff)] shadow-[0_30px_60px_rgba(15,23,42,0.12)]" />
            <div className="absolute right-8 top-12 h-40 w-40 rotate-6 rounded-[32px] bg-white shadow-[0_30px_60px_rgba(15,23,42,0.08)]">
              <div className="flex h-full flex-col items-center justify-center gap-2">
                <Sparkles className="h-8 w-8 text-[color:var(--accent)]" />
                <span className="text-2xl font-bold text-slate-900">.NET</span>
                <span className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">
                  C# / Backend
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={BookCheck}
          label="Lessons Completed"
          value={`${dashboard.completedLessons}`}
          hint={`of ${dashboard.totalLessons}`}
          variant="sparkline"
        />
        <MetricCard
          icon={Flame}
          label="Streak"
          value={streak > 0 ? `${streak} days` : "Start today"}
          hint={streak > 0 ? "Keep it up!" : "One lesson kicks it off."}
          variant="flame"
          iconTone="bg-amber-50 text-amber-500"
        />
        <MetricCard
          icon={Target}
          label="Practice Score"
          value={`${practiceScore}%`}
          hint={
            practiceScore >= 70
              ? "Good progress!"
              : practiceScore > 0
                ? "Aim for 70%+ on each quiz."
                : "Take your first quiz to start scoring."
          }
          variant="ring"
          ringValue={practiceScore}
          iconTone="bg-emerald-50 text-emerald-700"
        />
        <MetricCard
          icon={Sparkles}
          label="Quizzes Passed"
          value={`${quizzes.passed}`}
          hint={`of ${totalQuizzes}`}
          variant="donut"
          ringValue={
            totalQuizzes === 0 ? 0 : Math.round((quizzes.passed / totalQuizzes) * 100)
          }
          iconTone="bg-violet-50 text-violet-700"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[32px] border border-[color:var(--border-color)] bg-white/95 p-6 shadow-[var(--shadow-soft)] dark:bg-slate-950/70">
            <p className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">
              Current lesson
            </p>
            {dashboard.currentLesson ? (
              <div className="mt-4">
                <LessonCard lesson={dashboard.currentLesson} compact />
              </div>
            ) : (
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                No current lesson yet. Open the first module to start building
                momentum.
              </p>
            )}
          </div>

          <div className="rounded-[32px] border border-[color:var(--border-color)] bg-white/95 p-6 shadow-[var(--shadow-soft)] dark:bg-slate-950/70">
            <p className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">
              Recommended next
            </p>
            {dashboard.recommendedLesson ? (
              <div className="mt-4">
                <LessonCard lesson={dashboard.recommendedLesson} compact />
              </div>
            ) : (
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                You have completed every lesson in the path.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-[32px] border border-[color:var(--border-color)] bg-white/95 p-6 shadow-[var(--shadow-soft)] dark:bg-slate-950/70">
          <p className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">
            Overall progress
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {dashboard.overallProgress}%
          </p>
          <ProgressBar
            value={dashboard.overallProgress}
            className="mt-4 h-2.5"
          />
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            {dashboard.completedLessons} of {dashboard.totalLessons} lessons
            completed
          </p>
        </div>
      </section>

      <SearchLessons
        lessons={searchItems}
        modules={curriculum.modules.map((module) => module.title)}
        initialQuery={query}
        title="Jump back into the right lesson"
        description="Use the global search or filter by module and difficulty to find the exact topic you want."
      />

      <section className="rounded-[32px] border border-[color:var(--border-color)] bg-white/95 p-6 shadow-[var(--shadow-soft)] dark:bg-slate-950/70">
        <p className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">
          Module progress
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {dashboard.modules.map((module) => (
            <div
              key={module.id}
              className="rounded-[26px] bg-slate-50 p-5 dark:bg-slate-900"
            >
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold tracking-tight text-slate-950 dark:text-white">
                {module.title}
                </h2>
                <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-500 ring-1 ring-inset ring-[color:var(--border-color)] dark:bg-slate-950">
                  {module.category}
                </span>
                <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-500 ring-1 ring-inset ring-[color:var(--border-color)] dark:bg-slate-950">
                  {module.pace}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
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
              <div className="mt-4 flex items-center justify-between text-sm font-semibold text-slate-700 dark:text-slate-200">
                <span>
                  {module.completedLessons}/{module.lessonCount} lessons
                </span>
                <span>{module.completionPercentage}%</span>
              </div>
              <ProgressBar value={module.completionPercentage} className="mt-3" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
