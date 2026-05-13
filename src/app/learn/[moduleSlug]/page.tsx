import { notFound } from "next/navigation";

import { LessonCard } from "@/components/LessonCard";
import { ProductShell } from "@/components/ProductShell";
import { ProgressBar } from "@/components/ProgressBar";
import { buildCurriculum, getLessonsForModule, getModuleBySlug } from "@/modules/curriculum/catalog";
import { buildDashboardState } from "@/progress/logic";
import { listProgressForDefaultUser } from "@/progress/service";

export const dynamic = "force-dynamic";

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

  const moduleProgress = dashboard.modules.find((module) => module.slug === moduleSlug);

  return (
    <ProductShell activeModuleSlug={moduleSlug}>
      <div className="space-y-5 p-4">
        <section className="rounded-xl border border-[color:var(--border-color)] bg-white p-5 shadow-[var(--shadow-card)]">
          <p className="text-xs font-bold tracking-[0.18em] text-slate-400 uppercase">
            Module overview
          </p>
          <div className="mt-3">
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">
              {moduleData.title}
            </h1>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            {moduleData.description}
          </p>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            {moduleData.summary}
          </p>

          <div className="mt-5">
            <div className="max-w-xs rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
              <p className="text-xs font-bold tracking-[0.16em] text-slate-400 uppercase">
                Progress
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-950">
                {moduleProgress?.completionPercentage ?? 0}%
              </p>
              <ProgressBar value={moduleProgress?.completionPercentage ?? 0} className="mt-3 h-2" />
              <p className="mt-2 text-xs text-slate-500">
                {moduleProgress?.completedLessons ?? 0}/{moduleData.lessonCount} lessons
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-3 xl:grid-cols-2 2xl:grid-cols-3">
          {lessons.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}
        </section>
      </div>
    </ProductShell>
  );
}
