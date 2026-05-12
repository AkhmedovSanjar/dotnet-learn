import type { LucideIcon } from "lucide-react";

export function ComingSoonShell({
  icon: Icon,
  eyebrow,
  title,
  description,
  bullets,
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
}) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="rounded-[36px] border border-[color:var(--border-color)] bg-white/95 p-10 shadow-[var(--shadow-soft)] dark:bg-slate-950/80">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--accent),#3d9eff)] text-white shadow-sm">
          <Icon className="h-6 w-6" />
        </div>
        <p className="mt-6 text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
          {title}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600 dark:text-slate-300">
          {description}
        </p>
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {bullets.map((bullet) => (
            <li
              key={bullet}
              className="rounded-[22px] border border-[color:var(--border-color)] bg-[var(--surface-muted)] p-4 text-sm leading-7 text-slate-700 dark:text-slate-200"
            >
              {bullet}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
