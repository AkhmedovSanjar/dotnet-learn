"use client";

import { CheckCircle2, CircleHelp, XCircle } from "lucide-react";

import type { QuizQuestion } from "@/lessons/contracts";
import { cn } from "@/shared/utils/cn";

export function QuizCard({
  question,
  selectedAnswer,
  onSelect,
  reveal,
}: {
  question: QuizQuestion;
  selectedAnswer?: string;
  onSelect: (answer: string) => void;
  reveal?: {
    selectedAnswer: string | null;
    correctAnswer: string;
    isCorrect: boolean;
    explanation: string;
  };
}) {
  return (
    <article className="rounded-[30px] border border-[color:var(--border-color)] bg-white/95 p-6 shadow-[var(--shadow-soft)] dark:bg-slate-950/70">
      <div className="flex items-start gap-3">
        <CircleHelp className="mt-1 h-5 w-5 text-[color:var(--accent-strong)]" />
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">
            Quiz
          </p>
          <h3 className="mt-2 text-lg font-semibold tracking-tight text-slate-950 dark:text-white">
            {question.question}
          </h3>
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {question.options.map((option) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = reveal?.correctAnswer === option;
          const isWrongSelected = reveal?.selectedAnswer === option && !reveal.isCorrect;

          return (
            <button
              key={option}
              type="button"
              className={cn(
                "rounded-[22px] border px-4 py-4 text-left text-sm leading-6 transition",
                isSelected
                  ? "border-[color:var(--accent-strong)] bg-sky-50 text-slate-950 dark:bg-sky-500/10 dark:text-white"
                  : "border-[color:var(--border-color)] bg-white hover:border-[color:var(--accent)] dark:bg-slate-950/70",
                reveal && isCorrect
                  ? "border-emerald-300 bg-emerald-50 dark:bg-emerald-500/10"
                  : "",
                reveal && isWrongSelected
                  ? "border-rose-300 bg-rose-50 dark:bg-rose-500/10"
                  : "",
              )}
              onClick={() => onSelect(option)}
            >
              {option}
            </button>
          );
        })}
      </div>

      {reveal ? (
        <div
          className={cn(
            "mt-5 rounded-[22px] p-4 text-sm leading-7",
            reveal.isCorrect
              ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-100"
              : "bg-rose-50 text-rose-900 dark:bg-rose-500/10 dark:text-rose-100",
          )}
        >
          <p className="inline-flex items-center gap-2 font-semibold">
            {reveal.isCorrect ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            {reveal.isCorrect ? "Correct" : "Review this one"}
          </p>
          <p className="mt-2">{reveal.explanation}</p>
        </div>
      ) : null}
    </article>
  );
}
