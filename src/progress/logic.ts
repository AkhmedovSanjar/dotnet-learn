import type {
  Curriculum,
  DashboardModuleProgress,
  DashboardState,
  Lesson,
  ProgressRecord,
} from "@/lessons/contracts";

export function calculateCompletionPercentage(completed: number, total: number) {
  if (total <= 0) {
    return 0;
  }

  return Math.round((completed / total) * 100);
}

function sortLessons(lessons: Lesson[]) {
  return [...lessons].sort((a, b) => {
    if (a.moduleOrder !== b.moduleOrder) {
      return a.moduleOrder - b.moduleOrder;
    }

    return a.order - b.order;
  });
}

export function recommendNextLesson(lessons: Lesson[], progress: ProgressRecord[]) {
  const progressMap = new Map(progress.map((entry) => [entry.lessonId, entry]));
  return (
    sortLessons(lessons).find((lesson) => !progressMap.get(lesson.id)?.completed) ?? null
  );
}

function findCurrentLesson(lessons: Lesson[], progress: ProgressRecord[]) {
  const progressMap = new Map(progress.map((entry) => [entry.lessonId, entry]));
  return (
    sortLessons(lessons).find((lesson) => {
      const record = progressMap.get(lesson.id);
      return record && !record.completed;
    }) ?? recommendNextLesson(lessons, progress)
  );
}

export function buildDashboardState(
  curriculum: Curriculum,
  progress: ProgressRecord[],
): DashboardState {
  const progressMap = new Map(progress.map((entry) => [entry.lessonId, entry]));
  const completedLessons = curriculum.lessons.filter(
    (lesson) => progressMap.get(lesson.id)?.completed,
  ).length;

  const modules: DashboardModuleProgress[] = curriculum.modules.map((module) => {
    const completedCount = module.lessons.filter((lesson) =>
      progressMap.get(lesson.id)?.completed,
    ).length;

    return {
      ...module,
      completedLessons: completedCount,
      completionPercentage: calculateCompletionPercentage(
        completedCount,
        module.lessonCount,
      ),
    };
  });

  return {
    overallProgress: calculateCompletionPercentage(
      completedLessons,
      curriculum.lessons.length,
    ),
    completedLessons,
    totalLessons: curriculum.lessons.length,
    currentLesson: findCurrentLesson(curriculum.lessons, progress),
    recommendedLesson: recommendNextLesson(curriculum.lessons, progress),
    modules,
  };
}
