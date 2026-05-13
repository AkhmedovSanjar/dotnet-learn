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

export function recommendNextLesson(
  lessons: Lesson[],
  progress: ProgressRecord[],
) {
  const progressMap = new Map(progress.map((entry) => [entry.lessonId, entry]));
  return (
    sortLessons(lessons).find(
      (lesson) => !progressMap.get(lesson.id)?.completed,
    ) ?? null
  );
}

function findCurrentLesson(
  lessons: Lesson[],
  progress: ProgressRecord[],
) {
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

export function buildLearningStats(
  curriculum: Curriculum,
  progress: ProgressRecord[],
  now: Date = new Date(),
) {
  const dashboard = buildDashboardState(curriculum, progress);
  const quizCounts = countQuizzesPassed(progress);

  return {
    lessonsCompleted: dashboard.completedLessons,
    totalLessons: dashboard.totalLessons,
    overallProgress: dashboard.overallProgress,
    streakDays: computeStreakDays(progress, now),
    practiceScore: computePracticeScore(progress),
    quizzesPassed: quizCounts.passed,
    quizzesAttempted: quizCounts.attempted,
    totalQuizzes: curriculum.lessons.length,
  };
}

function isoDateOnly(value: string | null | undefined): string | null {
  if (!value) return null;
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return null;
  const d = new Date(parsed);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

function previousIsoDay(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

export function computeStreakDays(
  progress: ProgressRecord[],
  now: Date = new Date(),
): number {
  const days = new Set<string>();
  for (const entry of progress) {
    const day = isoDateOnly(entry.lastOpenedAt ?? null);
    if (day) days.add(day);
  }
  if (days.size === 0) return 0;

  const todayIso = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}-${String(now.getUTCDate()).padStart(2, "0")}`;
  const yesterdayIso = previousIsoDay(todayIso);

  let cursor = days.has(todayIso)
    ? todayIso
    : days.has(yesterdayIso)
      ? yesterdayIso
      : null;

  if (!cursor) return 0;

  let streak = 0;
  while (days.has(cursor)) {
    streak += 1;
    cursor = previousIsoDay(cursor);
  }
  return streak;
}

export function computePracticeScore(progress: ProgressRecord[]): number {
  const scores = progress
    .map((entry) => entry.quizScore)
    .filter((value): value is number => typeof value === "number");
  if (scores.length === 0) return 0;
  const avg = scores.reduce((sum, value) => sum + value, 0) / scores.length;
  return Math.round(avg);
}

export function countQuizzesPassed(
  progress: ProgressRecord[],
  passingScore = 70,
): { passed: number; attempted: number } {
  const scored = progress.filter(
    (entry): entry is ProgressRecord & { quizScore: number } =>
      typeof entry.quizScore === "number",
  );
  return {
    attempted: scored.length,
    passed: scored.filter((entry) => entry.quizScore >= passingScore).length,
  };
}
