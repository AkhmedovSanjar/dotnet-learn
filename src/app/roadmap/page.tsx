import Link from "next/link";

import { buildCurriculum } from "@/modules/curriculum/catalog";

export const metadata = {
  title: "Learning Roadmap",
};

export default function RoadmapPage() {
  const curriculum = buildCurriculum();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-[36px] border border-[color:var(--border-color)] bg-white/95 p-8 shadow-[var(--shadow-soft)] dark:bg-slate-950/80">
        <p className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">
          Learning roadmap
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
          From first principles to confident junior backend work
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600 dark:text-slate-300">
          This roadmap keeps the order intentional: foundational thinking first,
          then API work, then databases, testing, deployment, and troubleshooting.
        </p>

        <div className="mt-10 space-y-6">
          {curriculum.modules.map((module, index) => (
            <div
              key={module.id}
              className="grid gap-4 rounded-[30px] border border-[color:var(--border-color)] bg-slate-50/70 p-5 md:grid-cols-[84px_1fr] dark:bg-slate-900/70"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-white text-lg font-semibold shadow-sm dark:bg-slate-950 dark:text-white">
                {index + 1}
              </div>
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    {module.title}
                  </h2>
                  <Link
                    href={`/learn/${module.slug}`}
                    className="rounded-full border border-[color:var(--border-color)] px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200"
                  >
                    Open module
                  </Link>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {module.description}
                </p>
                <ul className="mt-4 space-y-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {module.expectedOutcomes.map((outcome) => (
                    <li key={outcome}>• {outcome}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
