import { databaseHubSections } from "@/modules/hubs";

export const metadata = {
  title: "Database Learning",
};

export default function DatabaseLearningPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-[36px] border border-[color:var(--border-color)] bg-white/95 p-8 shadow-[var(--shadow-soft)] dark:bg-slate-950/80">
        <p className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">
          Database learning section
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
          Connect SQL, EF Core, repositories, and DTO thinking together
        </h1>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {databaseHubSections.map((section) => (
            <article
              key={section.title}
              className="rounded-[28px] border border-[color:var(--border-color)] bg-slate-50/80 p-5 dark:bg-slate-900/70"
            >
              <h2 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                {section.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                {section.body}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
