import type { LucideIcon } from "lucide-react";

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <article className="rounded-[28px] border border-[color:var(--border-color)] bg-white/95 p-5 shadow-[var(--shadow-soft)] dark:bg-slate-950/70">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-[color:var(--accent-strong)] dark:bg-sky-500/10">
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-4 text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
        {value}
      </p>
      <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
        {hint}
      </p>
    </article>
  );
}
