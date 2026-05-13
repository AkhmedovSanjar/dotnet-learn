"use client";

import { FileText, Plus, Search, Trash2 } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

type LearningNote = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
};

const storageKey = "dotnetlearn-notes";

function readNotes(): LearningNote[] {
  if (typeof window === "undefined") return [];

  try {
    const parsed = JSON.parse(window.localStorage.getItem(storageKey) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeNotes(notes: LearningNote[]) {
  window.localStorage.setItem(storageKey, JSON.stringify(notes));
}

export function NotesWorkspace() {
  const [notes, setNotes] = useState<LearningNote[]>(readNotes);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [query, setQuery] = useState("");

  const filteredNotes = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return notes;
    return notes.filter((note) =>
      [note.title, note.body].join(" ").toLowerCase().includes(needle),
    );
  }, [notes, query]);

  function saveNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanTitle = title.trim();
    const cleanBody = body.trim();
    if (!cleanTitle || !cleanBody) return;

    const nextNotes = [
      {
        id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}`,
        title: cleanTitle,
        body: cleanBody,
        createdAt: new Date().toISOString(),
      },
      ...notes,
    ];
    setNotes(nextNotes);
    writeNotes(nextNotes);
    setTitle("");
    setBody("");
  }

  function deleteNote(noteId: string) {
    const nextNotes = notes.filter((note) => note.id !== noteId);
    setNotes(nextNotes);
    writeNotes(nextNotes);
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
      <form
        onSubmit={saveNote}
        className="rounded-xl border border-[color:var(--border-color)] bg-white p-6 shadow-[var(--shadow-card)]"
      >
        <p className="text-xs font-bold tracking-[0.18em] text-[color:var(--accent)] uppercase">
          Notes
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
          Capture what you learned
        </h1>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          Save definitions, mistakes, interview wording, and “remember this” moments while you study.
        </p>

        <label className="mt-6 block text-sm font-bold text-slate-700">
          Note title
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="mt-2 h-11 w-full rounded-lg border border-[color:var(--border-color)] px-4 text-sm outline-none focus:border-[color:var(--accent)]"
            placeholder="Encapsulation reminder"
          />
        </label>
        <label className="mt-4 block text-sm font-bold text-slate-700">
          Note body
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            className="mt-2 min-h-36 w-full rounded-lg border border-[color:var(--border-color)] p-4 text-sm leading-7 outline-none focus:border-[color:var(--accent)]"
            placeholder="Write the idea in your own words..."
          />
        </label>
        <button
          type="submit"
          className="mt-5 inline-flex h-11 items-center gap-2 rounded-lg bg-[color:var(--accent)] px-5 text-sm font-bold text-white"
        >
          <Plus className="h-4 w-4" />
          Save note
        </button>
      </form>

      <div className="rounded-xl border border-[color:var(--border-color)] bg-white p-6 shadow-[var(--shadow-card)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-950">Your study notes</h2>
            <p className="mt-1 text-sm text-slate-500">{notes.length} saved notes</p>
          </div>
          <label className="flex h-10 items-center gap-3 rounded-lg border border-[color:var(--border-color)] px-3 sm:w-72">
            <Search className="h-4 w-4 text-slate-400" />
            <span className="sr-only">Search notes</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search notes..."
              className="min-w-0 flex-1 bg-transparent text-sm outline-none"
            />
          </label>
        </div>

        <div className="mt-6 grid gap-4">
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <article key={note.id} className="rounded-lg border border-[color:var(--border-color)] bg-[#fbfdff] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-slate-950">{note.title}</h3>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                      {note.body}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteNote(note.id)}
                    className="rounded-lg border border-[color:var(--border-color)] p-2 text-slate-400 hover:text-red-600"
                    aria-label={`Delete note ${note.title}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-lg border border-dashed border-[#cfe1ff] bg-[#f6faff] p-8 text-center">
              <FileText className="mx-auto h-9 w-9 text-[color:var(--accent)]" />
              <p className="mt-3 text-sm font-semibold text-slate-700">
                No notes match your search yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
