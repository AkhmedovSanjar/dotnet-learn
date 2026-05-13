import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LessonCard } from "@/components/LessonCard";

const lesson = {
  title: "Class vs Object",
  description: "Learn the difference with a simple .NET example.",
  duration: "24 min",
  difficulty: "Foundational" as const,
  moduleTitle: "Object-Oriented Programming",
  moduleSlug: "object-oriented-programming",
  slug: "class-vs-object",
};

describe("LessonCard", () => {
  it("keeps module cards simple without small metadata tags", () => {
    render(<LessonCard lesson={lesson} />);

    expect(screen.getByText("Class vs Object")).toBeInTheDocument();
    expect(screen.queryByText("Object-Oriented Programming")).not.toBeInTheDocument();
    expect(screen.queryByText("Foundational")).not.toBeInTheDocument();
    expect(screen.queryByText("24 min")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Learn the difference with a simple .NET example."),
    ).not.toBeInTheDocument();
  });
});
