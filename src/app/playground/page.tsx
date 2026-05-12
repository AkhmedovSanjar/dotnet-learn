import { Code } from "lucide-react";

import { ComingSoonShell } from "@/components/ComingSoonShell";

export const metadata = { title: "Code Playground" };

export default function PlaygroundPage() {
  return (
    <ComingSoonShell
      icon={Code}
      eyebrow="Code Playground"
      title="Run snippets without leaving the lesson"
      description="A scratchpad for C# and SQL examples is on its way. You will be able to run the lesson's code, edit it, and compare your output to the expected result side by side."
      bullets={[
        "Inline C# REPL connected to the lesson's example.",
        "Quick SQL runner for the Database module exercises.",
        "Save-as-snippet so you can revisit your experiments.",
        "Share a link to a snippet for code review or pair sessions.",
      ]}
    />
  );
}
