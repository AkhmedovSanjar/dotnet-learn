import type { QuizQuestion } from "@/lessons/contracts";

export interface QuizAttemptResult {
  score: number;
  correctCount: number;
  totalQuestions: number;
  details: Array<{
    questionId: string;
    selectedAnswer: string | null;
    correctAnswer: string;
    isCorrect: boolean;
    explanation: string;
  }>;
}

export function scoreQuizAttempt(
  questions: QuizQuestion[],
  answers: Record<string, string>,
): QuizAttemptResult {
  const details = questions.map((question) => {
    const selectedAnswer = answers[question.id] ?? null;
    const isCorrect = selectedAnswer === question.correctAnswer;

    return {
      questionId: question.id,
      selectedAnswer,
      correctAnswer: question.correctAnswer,
      isCorrect,
      explanation: question.explanation,
    };
  });

  const correctCount = details.filter((detail) => detail.isCorrect).length;

  return {
    score:
      questions.length === 0
        ? 0
        : Math.round((correctCount / questions.length) * 100),
    correctCount,
    totalQuestions: questions.length,
    details,
  };
}
