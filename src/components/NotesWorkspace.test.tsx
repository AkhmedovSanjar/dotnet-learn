import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { NotesWorkspace } from "@/components/NotesWorkspace";

describe("NotesWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("adds and persists a learning note", () => {
    render(<NotesWorkspace />);

    fireEvent.change(screen.getByLabelText(/note title/i), {
      target: { value: "Encapsulation reminder" },
    });
    fireEvent.change(screen.getByLabelText(/note body/i), {
      target: { value: "Use private fields and validated methods." },
    });
    fireEvent.click(screen.getByRole("button", { name: /save note/i }));

    expect(screen.getByText("Encapsulation reminder")).toBeInTheDocument();
    expect(window.localStorage.getItem("dotnetlearn-notes")).toContain(
      "Use private fields",
    );
  });
});
