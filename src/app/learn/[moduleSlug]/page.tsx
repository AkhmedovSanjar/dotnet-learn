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
    <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[320px_1fr] lg:px-8">
      <Sidebar
        modules={buildCurriculum().modules}
        activeModuleSlug={moduleSlug}
        lessons={lessons}
        overallProgress={dashboard.overallProgress}
      />

      <div className="space-y-8">
        <section className="rounded-[36px] border border-[color:var(--border-color)] bg-white/95 p-8 shadow-[var(--shadow-soft)] dark:bg-slate-950/80">
          <p className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">
            Module overview
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {moduleData.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600 dark:text-slate-300">
            {moduleData.description}
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {moduleData.expectedOutcomes.map((outcome) => (
              <div
                key={outcome}
                className="rounded-[24px] bg-slate-50 p-4 text-sm leading-7 text-slate-600 dark:bg-slate-900 dark:text-slate-300"
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
