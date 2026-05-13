import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Flame,
  Lightbulb,
  MoreVertical,
  Play,
  Trophy,
  UserRound,
} from "lucide-react";

import { CodeBlock } from "@/components/CodeBlock";
import { BookmarkButton } from "@/components/BookmarkButton";
import { Header } from "@/components/Header";
import { LessonCompletionButton } from "@/components/LessonCompletionButton";
import { LessonTabs } from "@/components/LessonTabs";
import { MetricCard } from "@/components/MetricCard";
import { ProgressBar } from "@/components/ProgressBar";
import { Sidebar } from "@/components/Sidebar";
import {
  buildCurriculum,
  getLessonBySlugs,
  getLessonsForModule,
} from "@/modules/curriculum/catalog";
import { buildDashboardState, buildLearningStats } from "@/progress/logic";
import { listProgressForDefaultUser } from "@/progress/service";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const curriculum = buildCurriculum();
  const progress = await listProgressForDefaultUser();
  const dashboard = buildDashboardState(curriculum, progress);
  const stats = buildLearningStats(curriculum, progress);
  const lesson =
    getLessonBySlugs("object-oriented-programming", "encapsulation") ??
    dashboard.recommendedLesson ??
    curriculum.lessons[0];
  const moduleLessons = getLessonsForModule(lesson.moduleSlug);
  const lessonContents = [
    ["What is Encapsulation?", "done"],
    ["Why Encapsulation?", "done"],
    ["Access Modifiers in C#", "done"],
    ["Encapsulation Example", "current"],
    ["Properties in C#", "next"],
    ["Auto-Implemented Properties", "next"],
    ["Read-Only Properties", "next"],
    ["Practical Example", "next"],
    ["Common Mistakes", "next"],
    ["Best Practices", "next"],
    ["Summary", "next"],
  ] as const;

  return (
    <div className="flex min-h-screen bg-[var(--page-background)]">
      <Sidebar
        modules={curriculum.modules}
        activeModuleSlug={lesson.moduleSlug}
        activeLessonSlug={lesson.slug}
        lessons={moduleLessons}
        overallProgress={stats.overallProgress}
        completedLessons={stats.lessonsCompleted}
        totalLessons={stats.totalLessons}
      />

      <div className="min-w-0 flex-1">
        <Header streakDays={stats.streakDays} />

        <div className="grid gap-5 p-5 2xl:grid-cols-[minmax(0,1fr)_340px]">
          <section className="grid gap-5 2xl:col-span-2 xl:grid-cols-[minmax(0,1fr)_460px]">
            <div className="grid-surface overflow-hidden rounded-xl border border-[color:var(--border-color)] bg-white p-8 shadow-[var(--shadow-card)]">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
                <div>
                  <h1 className="max-w-2xl text-4xl font-bold leading-tight text-slate-950 lg:text-5xl">
                    Become Strong in Backend and .NET Fundamentals
                  </h1>
                  <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
                    Learn C#, OOP, APIs, database access, debugging, testing, and backend habits through guided lessons, code examples, outputs, practice, and quizzes.
                  </p>
                  <Link
                    href={`/learn/${lesson.moduleSlug}/${lesson.slug}`}
                    className="mt-8 inline-flex h-12 items-center gap-2 rounded-lg bg-[color:var(--accent)] px-6 text-sm font-bold text-white shadow-[0_12px_24px_rgba(15,107,255,0.24)] transition hover:-translate-y-0.5"
                  >
                    Start Learning
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <HeroIllustration />
              </div>
            </div>

            <section className="rounded-xl border border-[color:var(--border-color)] bg-white p-5 shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-950">Learning Dashboard</h2>
                <Link
                  href="/dashboard"
                  className="text-sm font-bold text-[color:var(--accent)]"
                >
                  View all
                </Link>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <MetricCard
                  icon={BookOpen}
                  label="Lessons Completed"
                  value={String(stats.lessonsCompleted)}
                  hint={`of ${stats.totalLessons}`}
                  variant="sparkline"
                />
                <MetricCard
                  icon={Flame}
                  label="Streak"
                  value={`${stats.streakDays} days`}
                  hint={stats.streakDays > 0 ? "Keep it up!" : "Start today"}
                  variant="flame"
                  iconTone="bg-amber-50 text-amber-500"
                />
                <MetricCard
                  icon={Trophy}
                  label="Practice Score"
                  value={`${stats.practiceScore}%`}
                  hint={stats.practiceScore > 0 ? "Good progress!" : "No quiz score yet"}
                  variant="ring"
                  ringValue={stats.practiceScore}
                  iconTone="bg-emerald-50 text-emerald-600"
                />
                <MetricCard
                  icon={CheckCircle2}
                  label="Quizzes Passed"
                  value={String(stats.quizzesPassed)}
                  hint={`of ${stats.quizzesAttempted || stats.totalQuizzes}`}
                  variant="donut"
                  ringValue={
                    stats.quizzesAttempted > 0
                      ? Math.round((stats.quizzesPassed / stats.quizzesAttempted) * 100)
                      : 0
                  }
                />
              </div>
            </section>
          </section>

          <section className="min-w-0 rounded-xl border border-[color:var(--border-color)] bg-white shadow-[var(--shadow-card)] 2xl:col-span-1">
            <div className="border-b border-[color:var(--border-color)] p-5">
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <Link href={`/learn/${lesson.moduleSlug}`} className="text-[color:var(--accent)]">
                  <ArrowLeft className="mr-1 inline h-4 w-4" />
                  {lesson.moduleTitle}
                </Link>
                <span>/</span>
                <span>{lesson.title} in C#</span>
              </div>

              <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="font-[family:var(--font-serif)] text-3xl font-semibold leading-tight text-slate-950">
                    {lesson.title} in C#
                  </h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                    Encapsulation is the mechanism of wrapping data (fields) and code acting on data (methods) together as a single unit.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`/learn/${lesson.moduleSlug}/${lesson.slug}#explain-simply`}
                    className="flex h-10 items-center gap-2 rounded-lg border border-[#cfe1ff] bg-white px-3 text-sm font-bold text-[color:var(--accent)]"
                  >
                    <Lightbulb className="h-4 w-4" />
                    Explain simply
                  </a>
                  <a
                    href={`/learn/${lesson.moduleSlug}/${lesson.slug}#interview-answer`}
                    className="flex h-10 items-center gap-2 rounded-lg border border-[#cfe1ff] bg-white px-3 text-sm font-bold text-[color:var(--accent)]"
                  >
                    <UserRound className="h-4 w-4" />
                    Interview answer
                  </a>
                  <LessonCompletionButton
                    lessonId={lesson.id}
                    initialCompleted={Boolean(
                      progress.find((entry) => entry.lessonId === lesson.id)?.completed,
                    )}
                    compact
                  />
                  <BookmarkButton lessonId={lesson.id} />
                  <details className="relative">
                    <summary
                      className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-lg border border-[color:var(--border-color)] text-slate-500"
                      aria-label="More lesson options"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </summary>
                    <div className="absolute right-0 z-20 mt-2 w-48 rounded-lg border border-[color:var(--border-color)] bg-white p-2 shadow-[var(--shadow-card)]">
                      <Link
                        href={`/learn/${lesson.moduleSlug}/${lesson.slug}`}
                        className="block rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-[#eef5ff] hover:text-[color:var(--accent)]"
                      >
                        Open full lesson
                      </Link>
                      <Link
                        href={`/learn/${lesson.moduleSlug}/${lesson.slug}/practice`}
                        className="block rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-[#eef5ff] hover:text-[color:var(--accent)]"
                      >
                        Practice task
                      </Link>
                      <Link
                        href={`/learn/${lesson.moduleSlug}/${lesson.slug}/quiz`}
                        className="block rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-[#eef5ff] hover:text-[color:var(--accent)]"
                      >
                        Take quiz
                      </Link>
                    </div>
                  </details>
                </div>
              </div>
            </div>

            <LessonTabs
              tabs={[
                {
                  id: "explanation",
                  label: "Explanation",
                  content: (
                    <div className="grid min-h-[460px] lg:grid-cols-[minmax(0,1fr)_470px]">
                      <article className="p-5">
                        <h3 className="font-[family:var(--font-serif)] text-2xl font-semibold text-slate-950">
                          What is Encapsulation?
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-slate-700">
                          Encapsulation is one of the four pillars of Object-Oriented Programming. It restricts direct access to some of an object&apos;s components and can prevent accidental modification of data.
                        </p>

                        <h4 className="mt-7 font-[family:var(--font-serif)] text-xl font-semibold text-slate-950">
                          Key Benefits
                        </h4>
                        <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                          {[
                            "Protects data from being modified by accident.",
                            "Improves code maintainability.",
                            "Provides better control over data.",
                            "Hides internal implementation details.",
                          ].map((item) => (
                            <li key={item} className="flex gap-3">
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="mt-8 border-t border-[color:var(--border-color)] pt-7">
                          <h4 className="font-[family:var(--font-serif)] text-xl font-semibold text-slate-950">
                            Example
                          </h4>
                          <p className="mt-3 text-sm leading-7 text-slate-700">
                            Consider a class that encapsulates a student&apos;s data. The object controls how its fields are read and changed.
                          </p>
                        </div>
                      </article>
                      <div className="border-t border-[color:var(--border-color)] bg-[#071a34] lg:border-t-0 lg:border-l">
                        <CodeBlock example={lesson.codeExamples[0]} />
                      </div>
                    </div>
                  ),
                },
                {
                  id: "code",
                  label: "Code",
                  content: <CodeBlock example={lesson.codeExamples[0]} />,
                },
                {
                  id: "output",
                  label: "Output",
                  content: (
                    <pre className="m-5 rounded-lg bg-[#f5f8fc] p-5 font-[family:var(--font-mono)] text-sm leading-7 text-slate-800">
                      {lesson.codeExamples[0].output}
                    </pre>
                  ),
                },
                {
                  id: "practice",
                  label: "Practice",
                  content: (
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-slate-950">Practice Task</h3>
                      <p className="mt-3 text-sm leading-7 text-slate-700">
                        {lesson.practiceTasks[0].prompt}
                      </p>
                    </div>
                  ),
                },
                {
                  id: "quiz",
                  label: "Quiz",
                  content: (
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-slate-950">
                        {lesson.quiz[0].question}
                      </h3>
                      <div className="mt-4 grid gap-3">
                        {lesson.quiz[0].options.map((option) => (
                          <div
                            key={option}
                            className="rounded-lg border border-[color:var(--border-color)] p-3 text-sm text-slate-700"
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    </div>
                  ),
                },
              ]}
            />

            <div className="flex items-center justify-between border-t border-[color:var(--border-color)] p-5">
              <button
                type="button"
                className="flex h-10 items-center gap-2 rounded-lg border border-[color:var(--border-color)] px-4 text-sm font-bold text-slate-700"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </button>
              <Link
                href={`/learn/${lesson.moduleSlug}/${lesson.slug}`}
                className="flex h-10 items-center gap-2 rounded-lg bg-[color:var(--accent)] px-5 text-sm font-bold text-white"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>

          <aside className="space-y-5">
            <section className="rounded-xl border border-[color:var(--border-color)] bg-white p-5 shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-950">Lesson Contents</h2>
                <span className="text-sm font-semibold text-slate-400">11 / 16</span>
              </div>
              <div className="mt-5 space-y-0">
                {lessonContents.map(([item, state], index) => (
                  <div key={item} className="grid grid-cols-[22px_1fr] gap-3">
                    <div className="flex flex-col items-center">
                      <span
                        className={state === "done"
                          ? "flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white"
                          : state === "current"
                            ? "flex h-5 w-5 items-center justify-center rounded-full border-[5px] border-[color:var(--accent)] bg-white"
                            : "flex h-5 w-5 items-center justify-center rounded-full border-2 border-slate-300 bg-white"}
                      >
                        {state === "done" ? <Check className="h-3 w-3" /> : null}
                      </span>
                      {index < lessonContents.length - 1 ? (
                        <span className="h-8 w-px bg-slate-200" />
                      ) : null}
                    </div>
                    <span
                      className={state === "current"
                        ? "pb-4 text-sm font-bold text-[color:var(--accent)]"
                        : "pb-4 text-sm font-semibold text-slate-600"}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-[#cfe1ff] bg-[#f4f9ff] p-5 shadow-[var(--shadow-card)]">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[color:var(--accent)]">
                  <Play className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-base font-bold text-[color:var(--accent)]">Keep going!</h2>
                  <p className="mt-1 text-sm text-slate-600">You&apos;re doing great.</p>
                </div>
              </div>
              <ProgressBar value={75} className="mt-5 h-2" />
              <p className="mt-2 text-right text-sm font-bold text-slate-600">75%</p>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

function HeroIllustration() {
  return (
    <div className="relative hidden min-h-[230px] lg:block">
      <div className="absolute right-4 top-4 h-24 w-44 rounded-lg border border-[#b9dcff] bg-white/70" />
      <div className="absolute right-16 top-10 h-44 w-64 rounded-xl border border-[#b9dcff] bg-white shadow-[0_20px_45px_rgba(15,107,255,0.18)]">
        <div className="flex gap-2 border-b border-[#dcecff] px-4 py-3">
          <span className="h-2 w-2 rounded-full bg-[#0f6bff]" />
          <span className="h-2 w-2 rounded-full bg-[#2bb8df]" />
          <span className="h-2 w-2 rounded-full bg-[#8ac7ff]" />
        </div>
        <div className="relative h-full">
          <span className="absolute left-8 top-10 rounded-lg bg-[color:var(--accent)] px-5 py-6 text-3xl font-bold text-white shadow-[0_18px_30px_rgba(15,107,255,0.25)]">
            .NET
          </span>
          <span className="absolute right-6 top-14 rounded-lg bg-[#77cef0] px-4 py-4 text-xl font-bold text-white shadow-[0_14px_26px_rgba(14,165,183,0.22)]">
            C#
          </span>
          <span className="absolute bottom-4 right-16 rounded-lg bg-[#3c7df0] px-4 py-4 text-2xl font-bold text-white shadow-[0_14px_26px_rgba(15,107,255,0.22)]">
            &lt;/&gt;
          </span>
        </div>
      </div>
      <div className="absolute bottom-6 left-2 h-px w-80 bg-[#b9dcff]" />
      <div className="absolute bottom-5 left-10 h-2 w-2 rounded-full bg-[#0f6bff]" />
    </div>
  );
}
