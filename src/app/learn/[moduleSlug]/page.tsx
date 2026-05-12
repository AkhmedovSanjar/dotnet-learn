import { notFound } from "next/navigation";

import { LessonCard } from "@/components/LessonCard";
import { Sidebar } from "@/components/Sidebar";
import { buildCurriculum, getLessonsForModule, getModuleBySlug } from "@/modules/curriculum/catalog";
import { buildDashboardState } from "@/progress/logic";
import { listProgressForDefaultUser } from "@/progress/service";

export async function generateStaticParams() {
  return buildCurriculum().modules.map((module) => ({
    moduleSlug: module.slug,
  }));
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ moduleSlug: string }>;
}) {
  const { moduleSlug } = await params;
  const moduleData = getModuleBySlug(moduleSlug);

  if (!moduleData) {
    notFound();
  }

  const lessons = getLessonsForModule(moduleSlug);
  const progress = await listProgressForDefaultUser();
  const dashboard = buildDashboardState(buildCurriculum(), progress);

  return (
    <div className="mx-auto grid w-full max-w-[120rem] gap-6 px-4 py-8 sm:px-6 xl:grid-cols-[300px_minmax(0,1fr)] lg:px-8">
      <Sidebar
        modules={buildCurriculum().modules}
        activeModuleSlug={moduleSlug}
        lessons={lessons}
        overallProgress={dashboard.overallProgress}
      />

      <div className="space-y-6">
        <section className="rounded-[30px] border border-[color:var(--border-color)] bg-white/95 p-6 shadow-[var(--shadow-soft)] dark:bg-slate-950/80">
          <p className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">
            Module overview
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {moduleData.title}
            </h1>
            <span className="rounded-full bg-[#eef5ff] px-3 py-1 text-xs font-semibold text-[#245da6] ring-1 ring-inset ring-[#cfe1ff]">
              {moduleData.category}
            </span>
            <span className="rounded-full border border-[color:var(--border-color)] bg-white px-3 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-950">
              {moduleData.pace}
            </span>
          </div>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">
            {moduleData.description}
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-300">
            {moduleData.summary}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {moduleData.focusAreas.map((area) => (
              <span
                key={area}
                className="rounded-full bg-[var(--surface-muted)] px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-200"
              >
                {area}
              </span>
            ))}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[22px] bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-300">
              <p className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
                Lesson count
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
                {moduleData.lessonCount}
              </p>
            </div>
            {moduleData.expectedOutcomes.map((outcome) => (
              <div
                key={outcome}
                className="rounded-[22px] bg-slate-50 p-4 text-sm leading-6 text-slate-600 dark:bg-slate-900 dark:text-slate-300"
              >
                {outcome}
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-2">
          {lessons.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}
        </section>
      </div>
    </div>
  );
}
