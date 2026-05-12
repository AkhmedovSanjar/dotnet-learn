"use client";

import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LessonCompletionButton({
  lessonId,
  initialCompleted,
}: {
  lessonId: string;
  initialCompleted: boolean;
}) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  return (
    <button
      type="button"
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
        completed
          ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-100"
          : "bg-slate-950 text-white hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
      }`}
      disabled={saving}
      onClick={async () => {
        setSaving(true);
        const nextCompleted = !completed;

        await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessonId, completed: nextCompleted }),
        });

        setCompleted(nextCompleted);
        setSaving(false);
        router.refresh();
      }}
    >
      <CheckCircle2 className="h-4 w-4" />
      {saving ? "Saving..." : completed ? "Completed" : "Mark as completed"}
    </button>
  );
}
