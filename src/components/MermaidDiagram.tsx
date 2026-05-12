"use client";

import mermaid from "mermaid";
import { useEffect, useId, useState } from "react";

export function MermaidDiagram({ chart }: { chart: string }) {
  const id = useId().replace(/:/g, "");
  const [svg, setSvg] = useState<string>("");

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "base",
      themeVariables: {
        primaryColor: "#ffffff",
        primaryTextColor: "#0f172a",
        primaryBorderColor: "#bae6fd",
        lineColor: "#0f172a",
        secondaryColor: "#ecfeff",
        tertiaryColor: "#f8fafc",
      },
    });

    void mermaid.render(`mermaid-${id}`, chart).then(({ svg: rendered }) => {
      setSvg(rendered);
    });
  }, [chart, id]);

  return (
    <div className="overflow-x-auto rounded-[28px] border border-[color:var(--border-color)] bg-white p-5 shadow-[var(--shadow-soft)] dark:bg-slate-950/70">
      <div dangerouslySetInnerHTML={{ __html: svg }} />
    </div>
  );
}
