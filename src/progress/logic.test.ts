import {
  buildDashboardState,
  calculateCompletionPercentage,
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
