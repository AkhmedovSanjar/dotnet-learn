import { gitCommandCards } from "@/modules/hubs";

export const metadata = {
  title: "Git Playground",
};

export default function GitPlaygroundPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-[36px] border border-[color:var(--border-color)] bg-white/95 p-8 shadow-[var(--shadow-soft)] dark:bg-slate-950/80">
        <p className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">
          Git commands playground
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
          The Git cheat sheet junior backend developers actually use
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600 dark:text-slate-300">
          Focus on commands you use in real delivery work: checking status,
          staging, committing, reviewing diffs, syncing safely, and recovering from mistakes.
        </p>

        <div className="mt-8 grid gap-4 xl:grid-cols-2">
          {gitCommandCards.map((card) => (
            <article
              key={card.command}
              className="rounded-[28px] border border-[color:var(--border-color)] bg-slate-50/80 p-5 dark:bg-slate-900/70"
            >
              <h2 className="font-[family:var(--font-mono)] text-lg font-semibold text-slate-950 dark:text-white">
                {card.command}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                {card.explanation}
              </p>
              <div className="mt-4 rounded-[22px] bg-white p-4 dark:bg-slate-950">
                <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
                  Example
                </p>
                <pre className="mt-2 overflow-x-auto font-[family:var(--font-mono)] text-sm text-slate-800 dark:text-slate-100">
                  {card.example}
                </pre>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                <strong className="text-slate-950 dark:text-white">When to use:</strong>{" "}
                {card.whenToUse}
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                <strong className="text-slate-950 dark:text-white">Common mistake:</strong>{" "}
                {card.mistakes}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
