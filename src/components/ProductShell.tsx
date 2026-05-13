import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { buildCurriculum, getLessonsForModule } from "@/modules/curriculum/catalog";
import { buildLearningStats } from "@/progress/logic";
import { listProgressForDefaultUser } from "@/progress/service";

export async function ProductShell({
  children,
  activeModuleSlug,
  activeLessonSlug,
}: {
  children: React.ReactNode;
  activeModuleSlug?: string;
  activeLessonSlug?: string;
}) {
  const curriculum = buildCurriculum();
  const progress = await listProgressForDefaultUser();
  const stats = buildLearningStats(curriculum, progress);
  const lessons = activeModuleSlug ? getLessonsForModule(activeModuleSlug) : undefined;

  return (
    <div className="flex min-h-screen bg-[var(--page-background)]">
      <Sidebar
        modules={curriculum.modules}
        activeModuleSlug={activeModuleSlug}
        activeLessonSlug={activeLessonSlug}
        lessons={lessons}
        overallProgress={stats.overallProgress}
        completedLessons={stats.lessonsCompleted}
        totalLessons={stats.totalLessons}
      />
      <div className="min-w-0 flex-1">
        <Header streakDays={stats.streakDays} />
        {children}
      </div>
    </div>
  );
}
