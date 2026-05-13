"use client";

import Link from "next/link";
import { BookmarkCheck, BookOpen, Search, Trash2 } from "lucide-react";
import { useMemo, useState, useSyncExternalStore } from "react";

import type { Difficulty } from "@/lessons/contracts";

const storageKey = "dotnetlearn-bookmarks";
const changeEvent = "dotnetlearn-bookmarks-change";

type BookmarkLesson = {
  id: string;
  title: string;
  description: string;
  moduleTitle: string;
  moduleSlug: string;
  slug: string;
  difficulty: Difficulty;
  duration: string;
};

function readBookmarks() {
  if (typeof window === "undefined") return [];

  try {
    const parsed = JSON.parse(window.localStorage.getItem(storageKey) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

function writeBookmarks(bookmarks: string[]) {
  window.localStorage.setItem(storageKey, JSON.stringify(bookmarks));
  window.dispatchEvent(new Event(changeEvent));
}

function subscribe(callback: () => void) {
  window.addEventListener(changeEvent, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(changeEvent, callback);
    window.removeEventListener("storage", callback);
  };
}

function getBookmarkSnapshot() {
  return readBookmarks().join("\n");
}

export function BookmarksPanel({ lessons }: { lessons: BookmarkLesson[] }) {
  const [query, setQuery] = useState("");
  const snapshot = useSyncExternalStore(subscribe, getBookmarkSnapshot, () => "");
  const bookmarks = useMemo(
    () => snapshot.split("\n").filter(Boolean),
    [snapshot],
  );
  const bookmarkSet = useMemo(() => new Set(bookmarks), [bookmarks]);
  const filteredLessons = lessons
    .filter((lesson) => bookmarkSet.has(lesson.id))
    .filter((lesson) => {
      const needle = query.trim().toLowerCase();
      if (!needle) return true;
      return [lesson.title, lesson.description, lesson.moduleTitle, lesson.difficulty]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });

  return (
    <section className="grid gap-6">
      <div className="rounded-xl border border-[color:var(--border-color)] bg-white p-6 shadow-[var(--shadow-card)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.18em] text-[color:var(--accent)] uppercase">
              Bookmarks
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
              Saved lessons for review
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
              Keep the lessons you want to revisit before practice, code review, or interviews.
            </p>
          </div>
          <label className="flex h-11 min-w-0 items-center gap-3 rounded-lg border border-[color:var(--border-color)] bg-white px-4 lg:w-96">
            <Search className="h-4 w-4 text-slate-400" />
            <span className="sr-only">Search bookmarks</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search saved lessons..."
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </label>
        </div>
      </div>

      {filteredLessons.length > 0 ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {filteredLessons.map((lesson) => (
            <article
              key={lesson.id}
              className="rounded-xl border border-[color:var(--border-color)] bg-white p-5 shadow-[var(--shadow-card)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold tracking-[0.16em] text-slate-400 uppercase">
                    {lesson.moduleTitle}
                  </p>
                  <h2 className="mt-2 text-xl font-bold text-slate-950">{lesson.title}</h2>
                </div>
                <span className="rounded-full bg-[#eef5ff] px-3 py-1 text-xs font-bold text-[color:var(--accent)]">
                  {lesson.difficulty}
                </span>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600">{lesson.description}</p>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <Link
                  href={`/learn/${lesson.moduleSlug}/${lesson.slug}`}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-[color:var(--accent)] px-4 text-sm font-bold text-white"
                >
                  <BookOpen className="h-4 w-4" />
                  Open lesson
                </Link>
                <button
                  type="button"
                  onClick={() => writeBookmarks(bookmarks.filter((id) => id !== lesson.id))}
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-[color:var(--border-color)] px-4 text-sm font-bold text-slate-600 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-[#bcd7ff] bg-[#f6faff] p-10 text-center">
          <BookmarkCheck className="mx-auto h-10 w-10 text-[color:var(--accent)]" />
          <h2 className="mt-4 text-xl font-bold text-slate-950">No saved lessons yet</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-7 text-slate-600">
            Open any lesson and press the bookmark button. Your saved list appears here instantly.
          </p>
        </div>
      )}
    </section>
  );
}
