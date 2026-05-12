"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { cn } from "@/shared/utils/cn";

export function CopyButton({
  value,
  label = "Copy",
  className,
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/90 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800",
        className,
      )}
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1400);
      }}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : label}
    </button>
  );
}
