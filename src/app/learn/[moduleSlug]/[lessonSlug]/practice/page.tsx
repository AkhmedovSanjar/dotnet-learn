import { notFound } from "next/navigation";

import { PracticeTaskCard } from "@/components/PracticeTaskCard";
import { buildCurriculum, getLessonBySlugs } from "@/modules/curriculum/catalog";

export async function generateStaticParams() {
  return buildCurriculum().lessons.map((lesson) => ({
    moduleSlug: lesson.moduleSlug,
    lessonSlug: lesson.slug,
  }));
}

export default async function LessonPracticePage({
  params,
}: {
  params: Promise<{ moduleSlug: string; lessonSlug: string }>;
}) {
  const { moduleSlug, lessonSlug } = await params;
  const lesson = getLessonBySlugs(moduleSlug, lessonSlug);

  if (!lesson) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="mb-8 rounded-[36px] border border-[color:var(--border-color)] bg-white/95 p-8 shadow-[var(--shadow-soft)] dark:bg-slate-950/80">
        <p className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">
          Practice page
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
          {lesson.title}
        </h1>
        <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">
          Use the task, hints, and solution as a mini pairing session with a senior mentor.
        </p>
      </section>

      <div className="space-y-6">
        {lesson.practiceTasks.map((task) => (
          <PracticeTaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
