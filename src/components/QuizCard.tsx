"use client";

import { CheckCircle2, CircleHelp, XCircle } from "lucide-react";

import type { QuizQuestion } from "@/lessons/contracts";
import { QuizKindBadge } from "@/components/QuizKindBadge";
import { cn } from "@/shared/utils/cn";

function splitQuestionAndCode(text: string): { prose: string; code?: string } {
  const match = text.match(/```(?:\w+)?\n([\s\S]+?)```/);
  if (!match) return { prose: text };
  const code = match[1].trimEnd();
  const prose = text.replace(match[0], "").trim();
  return { prose, code };
}

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
  const { prose, code } = splitQuestionAndCode(question.question);

  return (
    <article className="rounded-[30px] border border-[color:var(--border-color)] bg-white/95 p-6 shadow-[var(--shadow-soft)] dark:bg-slate-950/70">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <CircleHelp className="mt-1 h-5 w-5 text-[color:var(--accent-strong)]" />
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">
              Question
            </p>
            <h3 className="mt-2 text-lg font-semibold tracking-tight text-slate-950 dark:text-white">
              {prose}
            </h3>
          </div>
        </div>
        <QuizKindBadge kind={question.kind} />
      </div>

      {code ? (
        <pre className="mt-4 overflow-x-auto rounded-2xl bg-[#08162e] p-4 font-[family:var(--font-geist-mono)] text-sm leading-6 text-slate-100">
          <code>{code}</code>
        </pre>
      ) : null}

      <div className="mt-5 grid gap-3">
        {question.options.map((option) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = reveal?.correctAnswer === option;
          const isWrongSelected =
            reveal?.selectedAnswer === option && !reveal.isCorrect;

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
