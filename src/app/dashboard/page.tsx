import { BookCopy, GraduationCap, Target } from "lucide-react";

import { LessonCard } from "@/components/LessonCard";
import { ProgressBar } from "@/components/ProgressBar";
import { SearchLessons } from "@/components/SearchLessons";
import { StatCard } from "@/components/StatCard";
import { buildCurriculum } from "@/modules/curriculum/catalog";
import { buildDashboardState } from "@/progress/logic";
import { listProgressForDefaultUser } from "@/progress/service";

export const metadata = {
  title: "Learning Dashboard",
};

export default async function DashboardPage() {
  const curriculum = buildCurriculum();
  const progress = await listProgressForDefaultUser();
  const dashboard = buildDashboardState(curriculum, progress);

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
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-[36px] border border-[color:var(--border-color)] bg-white/95 p-8 shadow-[var(--shadow-soft)] dark:bg-slate-950/80">
        <p className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">
          Dashboard
        </p>
        <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
              Keep the next lesson obvious
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">
              Your dashboard keeps progress, current focus, and recommended next
              steps in one place so you can study consistently instead of wondering
              what to open next.
            </p>
          </div>
          <div className="rounded-[28px] bg-slate-50 p-5 dark:bg-slate-900">
            <div className="flex items-center justify-between text-sm font-semibold text-slate-700 dark:text-slate-200">
              <span>Overall progress</span>
              <span>{dashboard.overallProgress}%</span>
            </div>
            <ProgressBar value={dashboard.overallProgress} className="mt-3" />
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              {dashboard.completedLessons} of {dashboard.totalLessons} lessons completed
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          icon={BookCopy}
          label="Current lesson"
          value={dashboard.currentLesson?.title ?? "Start here"}
          hint={dashboard.currentLesson?.moduleTitle ?? "Open the first module and begin"}
        />
        <StatCard
          icon={Target}
          label="Recommended next"
          value={dashboard.recommendedLesson?.title ?? "Keep going"}
          hint={
            dashboard.recommendedLesson?.description ??
            "The next incomplete lesson becomes your recommended step."
          }
        />
        <StatCard
          icon={GraduationCap}
          label="Modules in path"
          value={String(curriculum.modules.length)}
          hint="The sequence is designed so fundamentals support the harder topics."
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
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
              No current lesson yet. Open the first module to start building momentum.
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
              You have completed every lesson in the path. Use the hub pages to review weak spots.
            </p>
          )}
        </div>
      </section>

      <SearchLessons
        lessons={searchItems}
        modules={curriculum.modules.map((module) => module.title)}
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
              <h2 className="text-lg font-semibold tracking-tight text-slate-950 dark:text-white">
                {module.title}
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                {module.description}
              </p>
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
