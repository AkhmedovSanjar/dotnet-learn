import { BookOpen, Code2, Bug, MessageSquare } from "lucide-react";

import type { QuizKind } from "@/lessons/contracts";

const KIND_META: Record<
  QuizKind,
  { label: string; icon: typeof BookOpen; tone: string }
> = {
  concept: {
    label: "Concept",
    icon: BookOpen,
    tone: "bg-sky-50 text-[#245da6] border-[#cfe1ff]",
  },
  "code-reading": {
    label: "Code reading",
    icon: Code2,
    tone: "bg-violet-50 text-violet-700 border-violet-200",
  },
  "spot-the-bug": {
    label: "Spot the bug",
    icon: Bug,
    tone: "bg-amber-50 text-amber-800 border-amber-200",
  },
  interview: {
    label: "Interview",
    icon: MessageSquare,
    tone: "bg-emerald-50 text-emerald-800 border-emerald-200",
  },
};

export function QuizKindBadge({ kind }: { kind: QuizKind }) {
  const meta = KIND_META[kind];
  const Icon = meta.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${meta.tone}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {meta.label}
    </span>
  );
}
