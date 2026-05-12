import { scoreQuizAttempt } from "@/quizzes/logic";

describe("quiz scoring", () => {
  it("scores answers and explains each result", () => {
    const result = scoreQuizAttempt(
      [
        {
          id: "q1",
          lessonId: "oop-encapsulation",
          kind: "concept",
          question: "Why do we use private fields?",
          options: ["A", "B", "C", "D"],
          correctAnswer: "B",
          explanation: "Private fields protect state.",
        },
        {
          id: "q2",
          lessonId: "oop-encapsulation",
          kind: "code-reading",
          question: "What should Deposit validate first?",
          options: ["A", "B", "C", "D"],
          correctAnswer: "A",
          explanation: "Validate input before changing state.",
        },
      ],
      { q1: "B", q2: "C" },
    );

    expect(result.score).toBe(50);
    expect(result.correctCount).toBe(1);
    expect(result.details[0]).toMatchObject({ isCorrect: true });
    expect(result.details[1]).toMatchObject({ isCorrect: false });
  });
});
