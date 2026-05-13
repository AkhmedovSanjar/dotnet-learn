import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Providers } from "@/app/providers";
import { Header } from "@/components/Header";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("Header", () => {
  it("shows the live streak count instead of a hardcoded value", () => {
    render(
      <Providers>
        <Header streakDays={5} />
      </Providers>,
    );

    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.queryByText("12")).not.toBeInTheDocument();
  });

  it("does not render the demo user profile", () => {
    render(
      <Providers>
        <Header streakDays={1} />
      </Providers>,
    );

    expect(screen.queryByText("Devansh")).not.toBeInTheDocument();
    expect(screen.queryByText("DA")).not.toBeInTheDocument();
  });
});
