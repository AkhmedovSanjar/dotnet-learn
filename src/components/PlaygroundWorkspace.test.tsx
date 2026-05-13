import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { PlaygroundWorkspace } from "@/components/PlaygroundWorkspace";

describe("PlaygroundWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("saves a snippet and shows the expected output preview", () => {
    render(<PlaygroundWorkspace />);

    fireEvent.change(screen.getByLabelText(/snippet name/i), {
      target: { value: "Bank account example" },
    });
    fireEvent.change(screen.getByLabelText(/code editor/i), {
      target: { value: "Console.WriteLine(100);" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save snippet/i }));

    expect(screen.getByText("Bank account example")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(window.localStorage.getItem("dotnetlearn-snippets")).toContain(
      "Bank account example",
    );
  });
});
