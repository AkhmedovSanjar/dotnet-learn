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
    <div>
      <div className="flex flex-wrap gap-0 border-b border-[color:var(--border-color)] bg-white px-5">
        {tabs.map((tab) => {
          const Icon = tabIcons[tab.id];
          return (
            <button
              key={tab.id}
              type="button"
              className={cn(
                "relative inline-flex h-12 items-center gap-2 px-5 text-sm font-bold transition",
                activeTab === tab.id
                  ? "text-[color:var(--accent)] after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-[color:var(--accent)]"
                  : "text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white",
              )}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="bg-white dark:bg-slate-950">
        {tabs.map((tab) => (
          <div key={tab.id} className={activeTab === tab.id ? "block" : "hidden"}>
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}
