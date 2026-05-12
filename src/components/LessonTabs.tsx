"use client";

import { BookText, CheckCheck, Code2, FlaskConical, TerminalSquare } from "lucide-react";
import { useState } from "react";

import { cn } from "@/shared/utils/cn";

const tabIcons = {
  explanation: BookText,
  code: Code2,
  output: TerminalSquare,
  practice: FlaskConical,
  quiz: CheckCheck,
};

interface TabDefinition {
  id: keyof typeof tabIcons;
  label: string;
  content: React.ReactNode;
}

export function LessonTabs({ tabs }: { tabs: TabDefinition[] }) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id ?? "explanation");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {tabs.map((tab) => {
          const Icon = tabIcons[tab.id];
          return (
            <button
              key={tab.id}
              type="button"
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition",
                activeTab === tab.id
                  ? "bg-slate-950 text-white shadow-[var(--shadow-soft)] dark:bg-white dark:text-slate-950"
                  : "border border-[color:var(--border-color)] bg-white/90 text-slate-600 hover:border-[color:var(--accent)] hover:text-slate-950 dark:bg-slate-950/80 dark:text-slate-300",
              )}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div>
        {tabs.map((tab) => (
          <div key={tab.id} className={activeTab === tab.id ? "block" : "hidden"}>
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}
