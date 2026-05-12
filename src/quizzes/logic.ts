import type { QuizKind, QuizQuestion } from "@/lessons/contracts";

export interface QuizDetail {
  questionId: string;
  kind: QuizKind;
  selectedAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
}

export interface QuizKindBreakdown {
  kind: QuizKind;
  correct: number;
  total: number;
}

export interface QuizAttemptResult {
  score: number;
  correctCount: number;
  totalQuestions: number;
  details: QuizDetail[];
  byKind: QuizKindBreakdown[];
}

export function scoreQuizAttempt(
  questions: QuizQuestion[],
  answers: Record<string, string>,
): QuizAttemptResult {
  const details: QuizDetail[] = questions.map((question) => {
    const selectedAnswer = answers[question.id] ?? null;
    const isCorrect = selectedAnswer === question.correctAnswer;

    return {
      questionId: question.id,
      kind: question.kind,
      selectedAnswer,
      correctAnswer: question.correctAnswer,
      isCorrect,
      explanation: question.explanation,
    };
  });

  const correctCount = details.filter((detail) => detail.isCorrect).length;

  const byKindMap = new Map<QuizKind, QuizKindBreakdown>();
  for (const detail of details) {
    const entry = byKindMap.get(detail.kind) ?? {
      kind: detail.kind,
      correct: 0,
      total: 0,
    };
    entry.total += 1;
    if (detail.isCorrect) entry.correct += 1;
    byKindMap.set(detail.kind, entry);
  }

  return {
    score:
      questions.length === 0
        ? 0
        : Math.round((correctCount / questions.length) * 100),
    correctCount,
    totalQuestions: questions.length,
    details,
    byKind: Array.from(byKindMap.values()),
  };
}
