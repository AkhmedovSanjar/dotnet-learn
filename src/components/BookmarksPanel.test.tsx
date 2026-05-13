import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { BookmarksPanel } from "@/components/BookmarksPanel";

const lessons = [
  {
    id: "oop-encapsulation",
    title: "Encapsulation in C#",
    description: "Protect object state with private fields.",
    moduleTitle: "Object-Oriented Programming",
    moduleSlug: "object-oriented-programming",
    slug: "encapsulation",
    difficulty: "Beginner" as const,
    duration: "16 min",
  },
  {
    id: "git-branch",
    title: "Branch",
    description: "Work safely on isolated changes.",
    moduleTitle: "Git Basics",
    moduleSlug: "git-basics",
    slug: "branch",
    difficulty: "Beginner" as const,
    duration: "12 min",
  },
];

describe("BookmarksPanel", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("lists lessons saved by the bookmark button", () => {
    window.localStorage.setItem(
      "dotnetlearn-bookmarks",
      JSON.stringify(["oop-encapsulation"]),
    );

    render(<BookmarksPanel lessons={lessons} />);

    expect(screen.getByText("Encapsulation in C#")).toBeInTheDocument();
    expect(screen.queryByText("Branch")).not.toBeInTheDocument();
  });
});
