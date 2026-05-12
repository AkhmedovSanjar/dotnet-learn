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
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2 rounded-[24px] border border-[color:var(--border-color)] bg-white p-2 shadow-[var(--shadow-soft)] dark:bg-slate-950/70">
        {tabs.map((tab) => {
          const Icon = tabIcons[tab.id];
          return (
            <button
              key={tab.id}
              type="button"
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold transition",
                activeTab === tab.id
                  ? "bg-[#eef5ff] text-[#245da6] shadow-sm ring-1 ring-inset ring-[#cfe1ff] dark:bg-white dark:text-slate-950"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900",
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
