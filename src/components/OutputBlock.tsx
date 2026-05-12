export function OutputBlock({ output }: { output: string }) {
  return (
    <section className="rounded-[28px] border border-[color:var(--border-color)] bg-white p-5 shadow-[var(--shadow-soft)] dark:border-slate-800 dark:bg-slate-900/80">
      <p className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase dark:text-sky-200">
        Expected output
      </p>
      <pre className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-[22px] bg-[var(--surface-muted)] p-4 font-[family:var(--font-mono)] text-sm leading-7 text-slate-800 dark:text-slate-100">
        {output}
      </pre>
    </section>
  );
}
