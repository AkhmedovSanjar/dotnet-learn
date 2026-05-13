import { ChevronDown } from "lucide-react";
import { codeToHtml } from "shiki";

import type { CodeExample } from "@/lessons/contracts";
import { CopyButton } from "@/components/CopyButton";

const languageLabel = {
  bash: "Bash",
  csharp: "C#",
  json: "JSON",
  plaintext: "Text",
  sql: "SQL",
  typescript: "TS",
  yaml: "YAML",
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
    theme: "github-dark",
  });

  return (
    <section className="overflow-hidden rounded-lg border border-[#0b2448] bg-[#071a34] shadow-[0_18px_40px_rgba(15,23,42,0.14)]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-white">{example.title}</p>
          {caption ? (
            <p className="mt-1 text-xs text-slate-400">{caption}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex h-8 items-center gap-2 rounded-md border border-white/10 bg-white/8 px-3 text-xs font-semibold text-white"
          >
            {languageLabel[example.language]}
            <ChevronDown className="h-3.5 w-3.5 text-slate-300" />
          </button>
          <CopyButton
            value={example.code}
            label=""
            className="h-8 rounded-md border-white/10 bg-white/8 px-2 text-white hover:bg-white/12 hover:text-white"
          />
        </div>
      </div>
      <div
        className="code-editor shiki-block overflow-x-auto text-sm leading-7 [&_pre]:m-0 [&_pre]:overflow-x-auto [&_pre]:bg-transparent [&_pre]:p-5 [&_pre]:font-[family:var(--font-mono)]"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </section>
  );
}
