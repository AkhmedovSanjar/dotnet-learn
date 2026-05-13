import type { LucideIcon } from "lucide-react";

type Variant = "sparkline" | "flame" | "ring" | "donut";

export function MetricCard({
  icon: Icon,
  label,
  value,
  hint,
  variant = "sparkline",
  ringValue,
  iconTone = "bg-sky-50 text-[#245da6]",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint: string;
  variant?: Variant;
  ringValue?: number;
  iconTone?: string;
}) {
  return (
    <article className="rounded-lg border border-[color:var(--border-color)] bg-white p-4 shadow-[var(--shadow-card)] dark:bg-slate-950/70">
      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconTone}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <MetricVisual variant={variant} ringValue={ringValue} />
      </div>
      <p className="mt-3 text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
        {value}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
        {hint}
      </p>
    </article>
  );
}

function MetricVisual({
  variant,
  ringValue,
}: {
  variant: Variant;
  ringValue?: number;
}) {
  if (variant === "sparkline") {
    return (
      <svg
        viewBox="0 0 80 32"
        className="h-8 w-20 stroke-[#2f80ed]"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 24 L14 18 L26 22 L38 12 L50 16 L62 6 L78 4" />
      </svg>
    );
  }
  if (variant === "flame") {
    return (
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-amber-50 text-amber-500">
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
          <path d="M12 2c0 4-5 5-5 10a5 5 0 0010 0c0-2.5-1.5-4-2.5-6 .5 1.5-.5 3-2 3 .5-3 0-5-.5-7z" />
        </svg>
      </span>
    );
  }
  if (variant === "ring") {
    const v = Math.max(0, Math.min(100, ringValue ?? 0));
    const radius = 14;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (v / 100) * circumference;
    return (
      <svg viewBox="0 0 36 36" className="h-9 w-9 -rotate-90">
        <circle
          cx="18"
          cy="18"
          r={radius}
          stroke="#e5edf7"
          strokeWidth="4"
          fill="none"
        />
        <circle
          cx="18"
          cy="18"
          r={radius}
          stroke="#0ea5b7"
          strokeWidth="4"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
    );
  }
  // donut
  const v = Math.max(0, Math.min(100, ringValue ?? 0));
  const radius = 14;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (v / 100) * circumference;
  return (
    <svg viewBox="0 0 36 36" className="h-9 w-9 -rotate-90">
      <circle
        cx="18"
        cy="18"
        r={radius}
        stroke="#e5edf7"
        strokeWidth="4"
        fill="none"
      />
      <circle
        cx="18"
        cy="18"
        r={radius}
        stroke="#2f80ed"
        strokeWidth="4"
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </svg>
  );
}
