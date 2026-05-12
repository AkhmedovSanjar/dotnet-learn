import { Award } from "lucide-react";

import { ComingSoonShell } from "@/components/ComingSoonShell";

export const metadata = { title: "Achievements" };

export default function AchievementsPage() {
  return (
    <ComingSoonShell
      icon={Award}
      eyebrow="Achievements"
      title="Earn badges as you build your foundation"
      description="Badges will surface here as you complete modules, win quizzes, and keep up your study streak. The first batch will recognise milestones around fundamentals, API building, and database work."
      bullets={[
        "OOP Foundations - finish the OOP module with a perfect quiz score.",
        "Contract First - finish the DTOs and REST modules in order.",
        "Schema Reader - finish the Database module with a 90% practice score.",
        "Two-Week Streak - study every weekday for two weeks straight.",
      ]}
    />
  );
}
