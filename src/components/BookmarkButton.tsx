"use client";

import { Bookmark } from "lucide-react";
import { useSyncExternalStore } from "react";

import { cn } from "@/shared/utils/cn";

const storageKey = "dotnetlearn-bookmarks";
const changeEvent = "dotnetlearn-bookmarks-change";

function readBookmarks() {
  try {
    const raw = window.localStorage.getItem(storageKey);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.filter((value): value is string => typeof value === "string")
      : [];
  } catch {
    return [];
  }
}

function writeBookmarks(bookmarks: string[]) {
  window.localStorage.setItem(storageKey, JSON.stringify(bookmarks));
  window.dispatchEvent(new Event(changeEvent));
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(changeEvent, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(changeEvent, onStoreChange);
  };
}

function getBookmarkSnapshot() {
  return readBookmarks().join("\n");
}

export function BookmarkButton({
  lessonId,
  className,
}: {
  lessonId: string;
  className?: string;
}) {
  const snapshot = useSyncExternalStore(subscribe, getBookmarkSnapshot, () => "");
  const bookmarked = snapshot.split("\n").includes(lessonId);

  return (
    <button
      type="button"
      aria-label={bookmarked ? "Remove lesson bookmark" : "Bookmark lesson"}
      aria-pressed={bookmarked}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-lg border border-[color:var(--border-color)] text-slate-500 transition hover:border-[#cfe1ff] hover:text-[color:var(--accent)]",
        bookmarked && "border-[#cfe1ff] bg-[#eef5ff] text-[color:var(--accent)]",
        className,
      )}
      onClick={() => {
        const bookmarks = readBookmarks();
        const next = bookmarks.includes(lessonId)
          ? bookmarks.filter((id) => id !== lessonId)
          : [...bookmarks, lessonId];

        writeBookmarks(next);
      }}
    >
      <Bookmark className={cn("h-4 w-4", bookmarked && "fill-current")} />
    </button>
  );
}
