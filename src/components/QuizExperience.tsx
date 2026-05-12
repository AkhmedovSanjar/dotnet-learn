"use client";

import { Trophy } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { QuizKind, QuizQuestion } from "@/lessons/contracts";
import { QuizCard } from "@/components/QuizCard";
import { QuizKindBadge } from "@/components/QuizKindBadge";

interface QuizExperienceProps {
  moduleSlug: string;
  lessonSlug: string;
  questions: QuizQuestion[];
}

interface QuizResultDetail {
  questionId: string;
  kind: QuizKind;
  selectedAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
}

interface QuizKindBreakdown {
  kind: QuizKind;
  correct: number;
  total: number;
}

interface QuizResult {
  score: number;
  correctCount: number;
  totalQuestions: number;
  details: QuizResultDetail[];
  byKind?: QuizKindBreakdown[];
}

export function QuizExperience({
  moduleSlug,
  lessonSlug,
  questions,
}: QuizExperienceProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  return (
    <div className="space-y-5">
      {questions.map((question) => {
        const reveal = result?.details.find(
          (detail) => detail.questionId === question.id,
        );

        return (
          <QuizCard
            key={question.id}
            question={question}
            selectedAnswer={answers[question.id]}
            onSelect={(answer) =>
              setAnswers((current) => ({ ...current, [question.id]: answer }))
            }
            reveal={reveal}
          />
        );
      })}

      <div className="rounded-[30px] border border-[color:var(--border-color)] bg-white/95 p-6 shadow-[var(--shadow-soft)] dark:bg-slate-950/70">
        {result ? (
          <div className="mb-5 space-y-4 rounded-[24px] bg-slate-50 p-4 dark:bg-slate-900">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
              <Trophy className="h-4 w-4 text-[color:var(--accent-strong)]" />
              Quiz score: {result.score}%
            </p>
            <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
              You answered {result.correctCount} of {result.totalQuestions}{" "}
              questions correctly.
            </p>
            {result.byKind && result.byKind.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {result.byKind.map((entry) => (
                  <span
                    key={entry.kind}
                    className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border-color)] bg-white px-3 py-1.5 text-xs font-medium text-slate-700"
                  >
                    <QuizKindBadge kind={entry.kind} />
                    <span>
                      {entry.correct}/{entry.total}
                    </span>
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        <button
          type="button"
          disabled={
            submitting ||
            questions.some((question) => !answers[question.id])
          }
          className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-950"
          onClick={async () => {
            setSubmitting(true);
            const response = await fetch("/api/quiz", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ moduleSlug, lessonSlug, answers }),
            });

            const data = (await response.json()) as QuizResult;
            setResult(data);
            setSubmitting(false);
            router.refresh();
          }}
        >
          {submitting ? "Checking answers..." : "Submit quiz"}
        </button>
      </div>
    </div>
  );
}
