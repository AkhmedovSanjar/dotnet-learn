import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";

import { BookmarkButton } from "@/components/BookmarkButton";

describe("BookmarkButton", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("persists bookmark state for a lesson", () => {
    render(<BookmarkButton lessonId="oop-encapsulation" />);

    const button = screen.getByRole("button", { name: /bookmark lesson/i });
    expect(button).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(button);

    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(window.localStorage.getItem("dotnetlearn-bookmarks")).toContain(
      "oop-encapsulation",
    );
  });
});
