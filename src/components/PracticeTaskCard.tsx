"use client";

import { ChevronDown, ChevronUp, Lightbulb, TerminalSquare } from "lucide-react";
import { useState } from "react";

import type { PracticeTask } from "@/lessons/contracts";

export function PracticeTaskCard({ task }: { task: PracticeTask }) {
  const [showSolution, setShowSolution] = useState(false);

  return (
    <article className="rounded-[30px] border border-[color:var(--border-color)] bg-white/95 p-6 shadow-[var(--shadow-soft)] dark:bg-slate-950/70">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">
            Practice task
          </p>
          <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {task.title}
          </h3>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border-color)] px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[color:var(--accent)] hover:text-slate-950 dark:text-slate-200"
          onClick={() => setShowSolution((current) => !current)}
        >
          {showSolution ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          {showSolution ? "Hide solution" : "Show solution"}
        </button>
      </div>

      <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
        {task.prompt}
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-[24px] bg-slate-50 p-4 dark:bg-slate-900">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
            <TerminalSquare className="h-4 w-4 text-[color:var(--accent-strong)]" />
            Expected result
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            {task.expectedResult}
          </p>
        </div>
        <div className="rounded-[24px] bg-slate-50 p-4 dark:bg-slate-900">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
            <Lightbulb className="h-4 w-4 text-[color:var(--accent-strong)]" />
            Hints
          </p>
          <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
            {task.hints.map((hint) => (
              <li key={hint}>• {hint}</li>
            ))}
          </ul>
        </div>
      </div>

      {showSolution ? (
        <div className="mt-5 rounded-[24px] border border-emerald-100 bg-emerald-50/80 p-4 text-sm leading-7 text-emerald-900 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-100">
          {task.solution}
        </div>
      ) : null}
    </article>
  );
}
