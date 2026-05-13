import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Rocket } from "lucide-react";

import { BookmarkButton } from "@/components/BookmarkButton";
import { CodeBlock } from "@/components/CodeBlock";
import { CopyButton } from "@/components/CopyButton";
import { Header } from "@/components/Header";
import { LessonCompletionButton } from "@/components/LessonCompletionButton";
import { LessonTabs } from "@/components/LessonTabs";
import { OutputBlock } from "@/components/OutputBlock";
import { PracticeTaskCard } from "@/components/PracticeTaskCard";
import { Sidebar } from "@/components/Sidebar";
import { buildCurriculum, getLessonBySlugs, getLessonsForModule, getNeighborLessons } from "@/modules/curriculum/catalog";
import { buildLearningStats } from "@/progress/logic";
import { listProgressForDefaultUser } from "@/progress/service";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return buildCurriculum().lessons.map((lesson) => ({
    moduleSlug: lesson.moduleSlug,
    lessonSlug: lesson.slug,
  }));
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ moduleSlug: string; lessonSlug: string }>;
}) {
  const { moduleSlug, lessonSlug } = await params;
  const lesson = getLessonBySlugs(moduleSlug, lessonSlug);

  if (!lesson) {
    notFound();
  }

  const progress = await listProgressForDefaultUser();
  const stats = buildLearningStats(buildCurriculum(), progress);
  const moduleLessons = getLessonsForModule(moduleSlug);
  const neighbors = getNeighborLessons(moduleSlug, lessonSlug);
  const progressRecord = progress.find((entry) => entry.lessonId === lesson.id);
  const lessonSectionProgress = progressRecord?.completed ? 6 : 3;
  const lessonContents = [
    "Why this matters",
    "Explain simply",
    "Deep explanation",
    "Real project usage",
    "Code example",
    "Summary",
  ];

  return (
    <div className="flex min-h-screen bg-[var(--page-background)]">
      <Sidebar
        modules={buildCurriculum().modules}
        activeModuleSlug={moduleSlug}
        activeLessonSlug={lessonSlug}
        lessons={moduleLessons}
        overallProgress={stats.overallProgress}
        completedLessons={stats.lessonsCompleted}
        totalLessons={stats.totalLessons}
      />

      <div className="min-w-0 flex-1">
        <Header streakDays={stats.streakDays} />
        <div className="grid gap-5 p-5 2xl:grid-cols-[minmax(0,1fr)_300px]">
      <div className="min-w-0 space-y-5">
        <section className="lesson-shell rounded-[28px] border border-[color:var(--border-color)] bg-white px-5 py-5 shadow-[var(--shadow-soft)] dark:bg-slate-950/80 sm:px-6">
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <Link href="/dashboard">Dashboard</Link>
            <span>/</span>
            <Link href={`/learn/${lesson.moduleSlug}`}>{lesson.moduleTitle}</Link>
            <span>/</span>
            <span>{lesson.title}</span>
          </div>

          <div className="mt-5 flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
                Lesson
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                {lesson.title}
              </h1>
            </div>
            <div className="flex flex-wrap items-start justify-end gap-3">
              <a
                href="#explain-simply"
                className="inline-flex items-center rounded-full border border-[color:var(--border-color)] bg-white px-4 py-2.5 text-sm font-semibold text-[color:var(--accent)] transition hover:border-[color:var(--accent)]"
              >
                Explain simply
              </a>
              <a
                href="#interview-answer"
                className="inline-flex items-center rounded-full border border-[color:var(--border-color)] bg-white px-4 py-2.5 text-sm font-semibold text-[color:var(--accent)] transition hover:border-[color:var(--accent)]"
              >
                Interview answer
              </a>
              <LessonCompletionButton
                lessonId={lesson.id}
                initialCompleted={Boolean(progressRecord?.completed)}
              />
              <BookmarkButton lessonId={lesson.id} />
            </div>
          </div>

        </section>

        <section className="rounded-[24px] border border-[color:var(--border-color)] bg-white/95 p-5 shadow-[var(--shadow-soft)] 2xl:hidden dark:bg-slate-950/70">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
                Learning guide
              </p>
              <h2 className="mt-2 text-lg font-semibold tracking-tight text-slate-950 dark:text-white">
                Keep the lesson structure visible on smaller screens
              </h2>
            </div>
            <span className="text-sm font-medium text-slate-400">
              {lessonSectionProgress}/{lessonContents.length}
            </span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {lessonContents.map((item, index) => (
              <div
                key={item}
                className="rounded-[18px] bg-[var(--surface-muted)] px-3 py-3 text-sm text-slate-600 dark:text-slate-200"
              >
                <span className="font-semibold text-slate-950 dark:text-white">{index + 1}.</span> {item}
              </div>
            ))}
          </div>
        </section>

        <LessonTabs
          tabs={[
            {
              id: "explanation",
              label: "Explanation",
              content: (
                <div className="space-y-5">
                  <section id="why-this-matters" className="rounded-[24px] border border-[color:var(--border-color)] bg-white p-5 shadow-[var(--shadow-soft)] dark:bg-slate-950/70">
                    <p className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
                      Why this matters
                    </p>
                    <p className="mt-4 text-lg leading-9 text-slate-700 dark:text-slate-200">
                      {lesson.whyItMatters}
                    </p>
                  </section>

                  <section className="overflow-hidden rounded-[24px] border border-[color:var(--border-color)] bg-white shadow-[var(--shadow-soft)] dark:bg-slate-950/70">
                    <div className="grid gap-0 xl:grid-cols-[1.08fr_0.92fr]">
                      <div className="p-5">
                        <p className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
                          Explanation
                        </p>
                        <h2 className="mt-4 font-[family:var(--font-serif)] text-3xl leading-tight text-slate-950 dark:text-white sm:text-4xl">
                          {lesson.title.toLowerCase().startsWith("what is") ? lesson.title : `What is ${lesson.title}?`}
                        </h2>
                        <p className="mt-5 text-base leading-8 text-slate-700 dark:text-slate-200">
                          {lesson.simpleExplanation}
                        </p>

                        <div className="mt-6">
                          <h3 className="text-2xl font-[family:var(--font-serif)] text-slate-950 dark:text-white">
                            Key benefits
                          </h3>
                          <ul className="mt-4 space-y-3 text-base leading-7 text-slate-700 dark:text-slate-200">
                            {lesson.bestPractices.slice(0, 3).map((item) => (
                              <li key={item}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="border-t border-[color:var(--border-color)] bg-[#08162e] xl:border-t-0 xl:border-l">
                        <CodeBlock example={lesson.codeExamples[0]} />
                      </div>
                    </div>
                  </section>

                  <div className="grid gap-5 xl:grid-cols-2">
                    <section id="explain-simply" className="rounded-[24px] border border-[color:var(--border-color)] bg-white p-5 shadow-[var(--shadow-soft)] dark:bg-slate-950/70">
                      <p className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
                        Explain simply
                      </p>
                      <p className="mt-4 text-base leading-8 text-slate-700 dark:text-slate-200">
                        {lesson.explainLikeBeginner}
                      </p>
                    </section>

                    <section id="interview-answer" className="rounded-[24px] border border-[color:var(--border-color)] bg-white p-5 shadow-[var(--shadow-soft)] dark:bg-slate-950/70">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
                            Interview answer
                          </p>
                          <p className="mt-4 text-base leading-8 text-slate-700 dark:text-slate-200">
                            {lesson.interviewAnswer}
                          </p>
                        </div>
                        <CopyButton value={lesson.interviewAnswer} label="Copy" className="shrink-0" />
                      </div>
                    </section>
                  </div>

                  <section id="deep-explanation" className="rounded-[24px] border border-[color:var(--border-color)] bg-white p-5 shadow-[var(--shadow-soft)] dark:bg-slate-950/70">
                    <p className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
                      Deep explanation
                    </p>
                    <p className="mt-4 text-base leading-8 text-slate-700 dark:text-slate-200">
                      {lesson.deepExplanation}
                    </p>
                  </section>

                  <section id="real-project-usage" className="rounded-[24px] border border-[color:var(--border-color)] bg-white p-5 shadow-[var(--shadow-soft)] dark:bg-slate-950/70">
                    <p className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
                      Real project usage
                    </p>
                    <p className="mt-4 text-base leading-8 text-slate-700 dark:text-slate-200">
                      {lesson.realWorldUsage}
                    </p>
                  </section>

                </div>
              ),
            },
            {
              id: "code",
              label: "Code",
              content: (
                <div className="space-y-5">
                  <CodeBlock
                    example={lesson.codeExamples[0]}
                    caption="Realistic example with a clear backend-friendly explanation."
                  />
                  <section id="code-example" className="rounded-[24px] border border-[color:var(--border-color)] bg-white p-5 shadow-[var(--shadow-soft)] dark:bg-slate-950/70">
                    <p className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
                      Step by step
                    </p>
                    <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                      {lesson.codeExamples[0].walkthrough.map((step) => (
                        <li key={step}>• {step}</li>
                      ))}
                    </ul>
                  </section>
                </div>
              ),
            },
            {
              id: "output",
              label: "Output",
              content: (
                <div className="space-y-5">
                  <OutputBlock output={lesson.codeExamples[0].output} />
                  <section id="summary" className="rounded-[24px] border border-[color:var(--border-color)] bg-white p-5 shadow-[var(--shadow-soft)] dark:bg-slate-950/70">
                    <p className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
                      Summary
                    </p>
                    <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                      {lesson.summary.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </section>
                </div>
              ),
            },
            {
              id: "practice",
              label: "Practice",
              content: (
                <div className="space-y-5">
                  {lesson.practiceTasks.map((task) => (
                    <PracticeTaskCard key={task.id} task={task} />
                  ))}
                  <Link
                    href={`/learn/${lesson.moduleSlug}/${lesson.slug}/practice`}
                    className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border-color)] px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200"
                  >
                    Open dedicated practice page
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ),
            },
            {
              id: "quiz",
              label: "Quiz",
              content: (
                <div className="space-y-5">
                  <section className="rounded-[24px] border border-[color:var(--border-color)] bg-white p-5 shadow-[var(--shadow-soft)] dark:bg-slate-950/70">
                    <p className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
                      Quiz preview
                    </p>
                    <div className="mt-4 space-y-4">
                      {lesson.quiz.map((question) => (
                        <div
                          key={question.id}
                          className="rounded-[20px] bg-[var(--surface-muted)] p-4 text-sm leading-6 text-slate-700 dark:bg-slate-900 dark:text-slate-200"
                        >
                          <p className="font-semibold text-slate-950 dark:text-white">
                            {question.question}
                          </p>
                          <p className="mt-2">{question.explanation}</p>
                        </div>
                      ))}
                    </div>
                    <Link
                      href={`/learn/${lesson.moduleSlug}/${lesson.slug}/quiz`}
                      className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white dark:bg-white dark:text-slate-950"
                    >
                      Take full quiz
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </section>
                </div>
              ),
            },
          ]}
        />

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-[color:var(--border-color)] bg-white p-5 shadow-[var(--shadow-soft)] dark:bg-slate-950/70">
          {neighbors.previous ? (
            <Link
              href={`/learn/${neighbors.previous.moduleSlug}/${neighbors.previous.slug}`}
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border-color)] px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous lesson
            </Link>
          ) : (
            <span />
          )}

          {neighbors.next ? (
            <Link
              href={`/learn/${neighbors.next.moduleSlug}/${neighbors.next.slug}`}
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-950"
            >
              Next lesson
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : null}
        </div>
      </div>

      <aside className="hidden 2xl:block">
        <div className="sticky top-24 space-y-5">
          <section className="rounded-[28px] border border-[color:var(--border-color)] bg-white p-5 shadow-[var(--shadow-soft)]">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight text-slate-950">
                Lesson Contents
              </h2>
              <span className="text-sm font-medium text-slate-400">
                {lessonSectionProgress}/{lessonContents.length}
              </span>
            </div>
            <div className="mt-5 space-y-3">
              {lessonContents.map((item, index) => {
                const completed = index === 0;
                const active = index === 1;
                return (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm text-slate-600"
                  >
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                        completed
                          ? "border-emerald-300 bg-emerald-500 text-white"
                          : active
                            ? "border-[#2f80ed] bg-[#2f80ed] text-white"
                            : "border-slate-300 bg-white"
                      }`}
                    >
                      {completed ? (
                        <Check className="h-3 w-3" strokeWidth={3} />
                      ) : null}
                    </span>
                    <span
                      className={
                        active
                          ? "font-semibold text-slate-950"
                          : ""
                      }
                    >
                      {item}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-[28px] border border-[color:var(--border-color)] bg-[linear-gradient(135deg,#eaf3ff,#ffffff)] p-5 shadow-[var(--shadow-soft)]">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#2f80ed]">
              <Rocket className="h-4 w-4" />
              Keep going!
            </div>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              You&apos;re doing great.
            </p>
            <div className="mt-4">
              <div className="h-2 rounded-full bg-white">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,var(--accent),var(--accent-strong))]"
                  style={{ width: `${stats.overallProgress}%` }}
                />
              </div>
              <p className="mt-2 text-right text-sm font-semibold text-slate-700">
                {stats.overallProgress}%
              </p>
            </div>
          </section>
        </div>
      </aside>
        </div>
      </div>
    </div>
  );
}
