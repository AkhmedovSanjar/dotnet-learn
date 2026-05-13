import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { Sidebar } from "@/components/Sidebar";
import type { ModuleSummary } from "@/lessons/contracts";

vi.mock("next/navigation", () => ({
  usePathname: () => "/learn/design-patterns-and-principles",
}));

const modules: ModuleSummary[] = [
  {
    id: "design-patterns",
    slug: "design-patterns-and-principles",
    title: "Design Patterns and Principles",
    description: "Organise backend code.",
    summary: "Clean design habits.",
    category: "Architecture",
    pace: "1 week",
    focusAreas: ["Repository pattern"],
    order: 10,
    expectedOutcomes: ["Explain patterns clearly."],
    lessonCount: 7,
    lessons: [],
  },
];

describe("Sidebar", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("removes Lessons, Practice, and Quizzes from the main menu", () => {
    render(<Sidebar modules={modules} />);

    expect(screen.queryByText("Lessons")).not.toBeInTheDocument();
    expect(screen.queryByText("Practice")).not.toBeInTheDocument();
    expect(screen.queryByText("Quizzes")).not.toBeInTheDocument();
    expect(screen.getByText("Code Playground")).toBeInTheDocument();
  });

  it("restores the left menu scroll position after navigation remounts", async () => {
    window.localStorage.setItem("dotnetlearn-sidebar-scroll", "220");

    render(<Sidebar modules={modules} />);

    await waitFor(() => {
      expect(screen.getByRole("complementary").scrollTop).toBe(220);
    });
  });
});
