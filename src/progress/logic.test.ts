import { describe, expect, it } from "vitest";

import {
  buildDashboardState,
  buildLearningStats,
  calculateCompletionPercentage,
  computePracticeScore,
  computeStreakDays,
  countQuizzesPassed,
  recommendNextLesson,
} from "@/progress/logic";
import { buildCurriculum } from "@/modules/curriculum/catalog";

describe("progress logic", () => {
  const curriculum = buildCurriculum();

  it("calculates percentages from lesson completion", () => {
    expect(calculateCompletionPercentage(0, 12)).toBe(0);
    expect(calculateCompletionPercentage(3, 12)).toBe(25);
    expect(calculateCompletionPercentage(12, 12)).toBe(100);
  });

  it("recommends the first incomplete lesson in module order", () => {
    const recommendation = recommendNextLesson(curriculum.lessons, [
      { lessonId: "oop-what-is-oop", completed: true, quizScore: 100 },
      { lessonId: "oop-class-vs-object", completed: true, quizScore: 100 },
    ]);

    expect(recommendation?.id).toBe("oop-encapsulation");
  });

  it("builds dashboard summaries with current and next lesson context", () => {
    const dashboard = buildDashboardState(curriculum, [
      { lessonId: "oop-what-is-oop", completed: true, quizScore: 90 },
      { lessonId: "oop-class-vs-object", completed: false, quizScore: null },
    ]);

    expect(dashboard.overallProgress).toBeGreaterThan(0);
    expect(dashboard.currentLesson?.id).toBe("oop-class-vs-object");
    expect(dashboard.recommendedLesson?.id).toBe("oop-class-vs-object");
    expect(dashboard.modules[0]?.completedLessons).toBe(1);
  });
});

describe("streak / practice / passed helpers", () => {
  it("returns 0 streak for no progress", () => {
    expect(computeStreakDays([])).toBe(0);
  });

  it("counts consecutive UTC days ending today as a streak", () => {
    const now = new Date(Date.UTC(2025, 4, 12, 10, 0, 0));
    const day = (offset: number) => {
      const d = new Date(now);
      d.setUTCDate(d.getUTCDate() - offset);
      return d.toISOString();
    };
    const streak = computeStreakDays(
      [
        { lessonId: "a", completed: false, quizScore: null, lastOpenedAt: day(0) },
        { lessonId: "b", completed: false, quizScore: null, lastOpenedAt: day(1) },
        { lessonId: "c", completed: false, quizScore: null, lastOpenedAt: day(2) },
        { lessonId: "d", completed: false, quizScore: null, lastOpenedAt: day(5) },
      ],
      now,
    );
    expect(streak).toBe(3);
  });

  it("computes average practice score across attempts with a score", () => {
    expect(
      computePracticeScore([
        { lessonId: "a", completed: true, quizScore: 80 },
        { lessonId: "b", completed: false, quizScore: 60 },
        { lessonId: "c", completed: false, quizScore: null },
      ]),
    ).toBe(70);
  });

  it("counts passed quizzes at the 70% threshold", () => {
    const result = countQuizzesPassed([
      { lessonId: "a", completed: true, quizScore: 80 },
      { lessonId: "b", completed: false, quizScore: 60 },
      { lessonId: "c", completed: false, quizScore: 100 },
      { lessonId: "d", completed: false, quizScore: null },
    ]);
    expect(result).toEqual({ passed: 2, attempted: 3 });
  });

  it("builds display stats from real progress records", () => {
    const curriculum = buildCurriculum();
    const now = new Date(Date.UTC(2025, 4, 12, 10, 0, 0));
    const yesterday = new Date(Date.UTC(2025, 4, 11, 10, 0, 0)).toISOString();
    const today = now.toISOString();

    const stats = buildLearningStats(
      curriculum,
      [
        {
          lessonId: "oop-what-is-oop",
          completed: true,
          quizScore: 100,
          lastOpenedAt: yesterday,
        },
        {
          lessonId: "oop-class-vs-object",
          completed: true,
          quizScore: 60,
          lastOpenedAt: today,
        },
        {
          lessonId: "oop-encapsulation",
          completed: false,
          quizScore: 80,
          lastOpenedAt: today,
        },
      ],
      now,
    );

    expect(stats.lessonsCompleted).toBe(2);
    expect(stats.totalLessons).toBe(curriculum.lessons.length);
    expect(stats.overallProgress).toBe(
      calculateCompletionPercentage(2, curriculum.lessons.length),
    );
    expect(stats.streakDays).toBe(2);
    expect(stats.practiceScore).toBe(80);
    expect(stats.quizzesPassed).toBe(2);
    expect(stats.quizzesAttempted).toBe(3);
    expect(stats.totalQuizzes).toBe(curriculum.lessons.length);
  });
});
