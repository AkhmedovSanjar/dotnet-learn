import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { CodeBlock } from "@/components/CodeBlock";
import { CopyButton } from "@/components/CopyButton";
import { LessonCompletionButton } from "@/components/LessonCompletionButton";
import { LessonTabs } from "@/components/LessonTabs";
import { MermaidDiagram } from "@/components/MermaidDiagram";
import { OutputBlock } from "@/components/OutputBlock";
import { PracticeTaskCard } from "@/components/PracticeTaskCard";
import { Sidebar } from "@/components/Sidebar";
import { buildCurriculum, getLessonBySlugs, getLessonsForModule, getNeighborLessons } from "@/modules/curriculum/catalog";
import { buildDashboardState } from "@/progress/logic";
import { listProgressForDefaultUser } from "@/progress/service";

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
  const dashboard = buildDashboardState(buildCurriculum(), progress);
  const moduleLessons = getLessonsForModule(moduleSlug);
  const neighbors = getNeighborLessons(moduleSlug, lessonSlug);
  const progressRecord = progress.find((entry) => entry.lessonId === lesson.id);

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[320px_1fr] lg:px-8">
      <Sidebar
        modules={buildCurriculum().modules}
        activeModuleSlug={moduleSlug}
        activeLessonSlug={lessonSlug}
        lessons={moduleLessons}
        overallProgress={dashboard.overallProgress}
      />

      <div className="space-y-8">
        <section className="rounded-[36px] border border-[color:var(--border-color)] bg-white/95 p-8 shadow-[var(--shadow-soft)] dark:bg-slate-950/80">
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <Link href="/dashboard">Dashboard</Link>
            <span>/</span>
            <Link href={`/learn/${lesson.moduleSlug}`}>{lesson.moduleTitle}</Link>
            <span>/</span>
            <span>{lesson.title}</span>
          </div>

          <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">
                Lesson
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
                {lesson.title}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600 dark:text-slate-300">
                {lesson.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                {lesson.difficulty}
              </span>
              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                {lesson.duration}
              </span>
              <LessonCompletionButton
                lessonId={lesson.id}
                initialCompleted={Boolean(progressRecord?.completed)}
              />
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {lesson.outcomes.map((outcome) => (
              <div
                key={outcome}
                className="rounded-[24px] bg-slate-50 p-4 text-sm leading-7 text-slate-600 dark:bg-slate-900 dark:text-slate-300"
              >
                {outcome}
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
                <div className="space-y-6">
                  <section className="rounded-[30px] border border-[color:var(--border-color)] bg-white/95 p-6 shadow-[var(--shadow-soft)] dark:bg-slate-950/70">
                    <p className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">
                      Why this matters
                    </p>
                    <p className="prose-lesson mt-4 text-base leading-8 text-slate-700 dark:text-slate-200">
                      {lesson.whyItMatters}
                    </p>
                  </section>

                  <div className="grid gap-6 xl:grid-cols-2">
                    <section className="rounded-[30px] border border-[color:var(--border-color)] bg-white/95 p-6 shadow-[var(--shadow-soft)] dark:bg-slate-950/70">
                      <p className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">
                        Explain simply
                      </p>
                      <p className="prose-lesson mt-4 text-base leading-8 text-slate-700 dark:text-slate-200">
                        {lesson.simpleExplanation}
                      </p>
                      <div className="mt-5 rounded-[24px] bg-slate-50 p-4 text-sm leading-7 text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                        {lesson.explainLikeBeginner}
                      </div>
                    </section>

                    <section className="rounded-[30px] border border-[color:var(--border-color)] bg-white/95 p-6 shadow-[var(--shadow-soft)] dark:bg-slate-950/70">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">
                            Interview answer
                          </p>
                          <p className="prose-lesson mt-4 text-base leading-8 text-slate-700 dark:text-slate-200">
                            {lesson.interviewAnswer}
                          </p>
                        </div>
                        <CopyButton value={lesson.interviewAnswer} label="Copy" className="shrink-0" />
                      </div>
                    </section>
                  </div>

                  <section className="rounded-[30px] border border-[color:var(--border-color)] bg-white/95 p-6 shadow-[var(--shadow-soft)] dark:bg-slate-950/70">
                    <p className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">
                      Deep explanation
                    </p>
                    <p className="prose-lesson mt-4 text-base leading-8 text-slate-700 dark:text-slate-200">
                      {lesson.deepExplanation}
                    </p>
                    <div className="mt-6">
                      <MermaidDiagram chart={lesson.diagram ?? ""} />
                    </div>
                  </section>

                  <section className="rounded-[30px] border border-[color:var(--border-color)] bg-white/95 p-6 shadow-[var(--shadow-soft)] dark:bg-slate-950/70">
                    <p className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">
                      Real project usage
                    </p>
                    <p className="prose-lesson mt-4 text-base leading-8 text-slate-700 dark:text-slate-200">
                      {lesson.realWorldUsage}
                    </p>
                  </section>

                  <div className="grid gap-6 xl:grid-cols-2">
                    <section className="rounded-[30px] border border-rose-100 bg-rose-50/80 p-6 shadow-[var(--shadow-soft)] dark:border-rose-500/20 dark:bg-rose-500/10">
                      <p className="text-xs font-semibold tracking-[0.2em] text-rose-700 uppercase dark:text-rose-200">
                        Common mistakes
                      </p>
                      <ul className="mt-4 space-y-3 text-sm leading-7 text-rose-900 dark:text-rose-100">
                        {lesson.commonMistakes.map((item) => (
                          <li key={item}>• {item}</li>
                        ))}
                      </ul>
                    </section>

                    <section className="rounded-[30px] border border-emerald-100 bg-emerald-50/80 p-6 shadow-[var(--shadow-soft)] dark:border-emerald-500/20 dark:bg-emerald-500/10">
                      <p className="text-xs font-semibold tracking-[0.2em] text-emerald-700 uppercase dark:text-emerald-200">
                        Best practices
                      </p>
                      <ul className="mt-4 space-y-3 text-sm leading-7 text-emerald-900 dark:text-emerald-100">
                        {lesson.bestPractices.map((item) => (
                          <li key={item}>• {item}</li>
                        ))}
                      </ul>
                    </section>
                  </div>
                </div>
              ),
            },
            {
              id: "code",
              label: "Code",
              content: (
                <div className="space-y-6">
                  <CodeBlock
                    example={lesson.codeExamples[0]}
                    caption="Realistic example with a clear backend-friendly explanation."
                  />
                  <section className="rounded-[30px] border border-[color:var(--border-color)] bg-white/95 p-6 shadow-[var(--shadow-soft)] dark:bg-slate-950/70">
                    <p className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">
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
                <div className="space-y-6">
                  <OutputBlock output={lesson.codeExamples[0].output} />
                  <section className="rounded-[30px] border border-[color:var(--border-color)] bg-white/95 p-6 shadow-[var(--shadow-soft)] dark:bg-slate-950/70">
                    <p className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">
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
                <div className="space-y-6">
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
                <div className="space-y-6">
                  <section className="rounded-[30px] border border-[color:var(--border-color)] bg-white/95 p-6 shadow-[var(--shadow-soft)] dark:bg-slate-950/70">
                    <p className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">
                      Quiz preview
                    </p>
                    <div className="mt-4 space-y-4">
                      {lesson.quiz.map((question) => (
                        <div
                          key={question.id}
                          className="rounded-[24px] bg-slate-50 p-4 text-sm leading-7 text-slate-700 dark:bg-slate-900 dark:text-slate-200"
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

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[30px] border border-[color:var(--border-color)] bg-white/95 p-6 shadow-[var(--shadow-soft)] dark:bg-slate-950/70">
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
    </div>
  );
}
