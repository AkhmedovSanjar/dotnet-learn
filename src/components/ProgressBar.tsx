import { cn } from "@/shared/utils/cn";

export function ProgressBar({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "h-2 overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800",
        className,
      )}
    >
      <div
        className="h-full rounded-full bg-[linear-gradient(90deg,var(--accent),var(--accent-strong))] transition-[width] duration-500"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
