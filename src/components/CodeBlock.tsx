import { codeToHtml } from "shiki";

import type { CodeExample } from "@/lessons/contracts";
import { CopyButton } from "@/components/CopyButton";

const theme = {
  light: "github-light",
  dark: "github-dark",
} as const;

export async function CodeBlock({
  example,
  caption,
}: {
  example: CodeExample;
  caption?: string;
}) {
  const html = await codeToHtml(example.code, {
    lang: example.language,
    themes: theme,
  });

  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-slate-950 shadow-[var(--shadow-soft)] dark:border-slate-800">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-white">{example.title}</p>
          {caption ? (
            <p className="mt-1 text-xs text-slate-400">{caption}</p>
          ) : null}
        </div>
        <CopyButton value={example.code} />
      </div>
      <div
        className="shiki-block overflow-x-auto text-sm [&_pre]:m-0 [&_pre]:overflow-x-auto [&_pre]:bg-transparent [&_pre]:p-5 [&_pre]:font-[family:var(--font-mono)]"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </section>
  );
}
