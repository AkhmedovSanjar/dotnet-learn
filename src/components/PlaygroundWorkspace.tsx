"use client";

import { Code2, Copy, Play, Save } from "lucide-react";
import { FormEvent, useState } from "react";

type Snippet = {
  id: string;
  name: string;
  language: string;
  code: string;
  output: string;
};

const storageKey = "dotnetlearn-snippets";
const defaultCode = `public class Program
{
    public static void Main()
    {
        Console.WriteLine(100);
    }
}`;

function readSnippets(): Snippet[] {
  if (typeof window === "undefined") return [];

  try {
    const parsed = JSON.parse(window.localStorage.getItem(storageKey) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeSnippets(snippets: Snippet[]) {
  window.localStorage.setItem(storageKey, JSON.stringify(snippets));
}

function previewOutput(code: string) {
  const matches = [...code.matchAll(/Console\.WriteLine\((["']?)(.*?)\1\);/g)];
  if (matches.length === 0) {
    return "Preview only: add Console.WriteLine(...) to see an expected console output.";
  }

  return matches.map((match) => match[2]).join("\n");
}

export function PlaygroundWorkspace() {
  const [snippets, setSnippets] = useState<Snippet[]>(readSnippets);
  const [name, setName] = useState("Encapsulation snippet");
  const [language, setLanguage] = useState("C#");
  const [code, setCode] = useState(defaultCode);
  const output = previewOutput(code);

  function saveSnippet(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) return;

    const nextSnippet = {
      id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}`,
      name: cleanName,
      language,
      code,
      output,
    };
    const nextSnippets = [nextSnippet, ...snippets.filter((snippet) => snippet.name !== cleanName)];
    setSnippets(nextSnippets);
    writeSnippets(nextSnippets);
  }

  async function copyCode() {
    await navigator.clipboard?.writeText(code);
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <form
        onSubmit={saveSnippet}
        className="overflow-hidden rounded-xl border border-[color:var(--border-color)] bg-white shadow-[var(--shadow-card)]"
      >
        <div className="flex flex-col gap-4 border-b border-[color:var(--border-color)] p-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.18em] text-[color:var(--accent)] uppercase">
              Code Playground
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
              Test lesson snippets safely
            </h1>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              This v1 playground previews expected C# console output and saves snippets for practice.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={copyCode}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[color:var(--border-color)] px-4 text-sm font-bold text-slate-700"
            >
              <Copy className="h-4 w-4" />
              Copy
            </button>
            <button
              type="submit"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[color:var(--accent)] px-4 text-sm font-bold text-white"
            >
              <Save className="h-4 w-4" />
              Save snippet
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="p-5">
            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_140px]">
              <label className="block text-sm font-bold text-slate-700">
                Snippet name
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="mt-2 h-11 w-full rounded-lg border border-[color:var(--border-color)] px-4 text-sm outline-none focus:border-[color:var(--accent)]"
                />
              </label>
              <label className="block text-sm font-bold text-slate-700">
                Language
                <select
                  value={language}
                  onChange={(event) => setLanguage(event.target.value)}
                  className="mt-2 h-11 w-full rounded-lg border border-[color:var(--border-color)] px-3 text-sm outline-none focus:border-[color:var(--accent)]"
                >
                  <option>C#</option>
                  <option>SQL</option>
                  <option>JSON</option>
                  <option>HTTP</option>
                </select>
              </label>
            </div>

            <label className="mt-5 block text-sm font-bold text-slate-700">
              Code editor
              <textarea
                value={code}
                onChange={(event) => setCode(event.target.value)}
                spellCheck={false}
                className="mt-2 min-h-[420px] w-full rounded-lg border border-[#0b2448] bg-[#071a34] p-5 font-[family:var(--font-mono)] text-sm leading-7 text-slate-100 outline-none focus:ring-2 focus:ring-[color:var(--accent)]"
              />
            </label>
          </div>
          <aside className="border-t border-[color:var(--border-color)] bg-[#f8fbff] p-5 lg:border-t-0 lg:border-l">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Play className="h-4 w-4 text-[color:var(--accent)]" />
              Expected output
            </div>
            <pre className="mt-4 min-h-32 overflow-x-auto rounded-lg bg-white p-4 font-[family:var(--font-mono)] text-sm leading-7 text-slate-800 ring-1 ring-inset ring-[color:var(--border-color)]">
              {output}
            </pre>
            <p className="mt-4 text-xs leading-6 text-slate-500">
              This is a learning preview, not a remote C# runtime. Copy the code into `dotnet run` when you want real execution.
            </p>
          </aside>
        </div>
      </form>

      <aside className="rounded-xl border border-[color:var(--border-color)] bg-white p-5 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-2">
          <Code2 className="h-5 w-5 text-[color:var(--accent)]" />
          <h2 className="text-lg font-bold text-slate-950">Saved snippets</h2>
        </div>
        <div className="mt-5 grid gap-3">
          {snippets.length > 0 ? (
            snippets.map((snippet) => (
              <button
                key={snippet.id}
                type="button"
                onClick={() => {
                  setName(snippet.name);
                  setLanguage(snippet.language);
                  setCode(snippet.code);
                }}
                className="rounded-lg border border-[color:var(--border-color)] p-4 text-left transition hover:border-[color:var(--accent)] hover:bg-[#f6faff]"
              >
                <span className="font-bold text-slate-900">{snippet.name}</span>
                <span className="mt-1 block text-xs font-semibold text-slate-400">
                  {snippet.language}
                </span>
              </button>
            ))
          ) : (
            <p className="rounded-lg border border-dashed border-[#cfe1ff] bg-[#f6faff] p-5 text-sm leading-7 text-slate-600">
              Save a snippet and it will stay here in this browser.
            </p>
          )}
        </div>
      </aside>
    </section>
  );
}
