import { Award, BookCheck, Flame, Sparkles, Trophy } from "lucide-react";

import { ProductShell } from "@/components/ProductShell";
import { ProgressBar } from "@/components/ProgressBar";
import { buildCurriculum } from "@/modules/curriculum/catalog";
import { buildDashboardState, buildLearningStats } from "@/progress/logic";
import { listProgressForDefaultUser } from "@/progress/service";

export const metadata = { title: "Achievements" };
export const dynamic = "force-dynamic";

export default async function AchievementsPage() {
  const curriculum = buildCurriculum();
  const progress = await listProgressForDefaultUser();
  const stats = buildLearningStats(curriculum, progress);
  const dashboard = buildDashboardState(curriculum, progress);
  const completedModules = dashboard.modules.filter(
    (module) => module.completionPercentage === 100,
  ).length;
  const badges = [
    {
      title: "First Lesson Completed",
      description: "Finish any lesson and prove the platform is tracking your work.",
      icon: BookCheck,
      progress: stats.lessonsCompleted > 0 ? 100 : 0,
      unlocked: stats.lessonsCompleted > 0,
    },
    {
      title: "Quiz Starter",
      description: "Submit your first quiz and review the explanations.",
      icon: Trophy,
      progress: stats.quizzesAttempted > 0 ? 100 : 0,
      unlocked: stats.quizzesAttempted > 0,
    },
    {
      title: "Steady Learner",
      description: "Build a 3-day study streak.",
      icon: Flame,
      progress: Math.min(100, Math.round((stats.streakDays / 3) * 100)),
      unlocked: stats.streakDays >= 3,
    },
    {
      title: "Module Finisher",
      description: "Complete every lesson in any module.",
      icon: Award,
      progress: completedModules > 0 ? 100 : 0,
      unlocked: completedModules > 0,
    },
    {
      title: "Backend Foundation",
      description: "Reach 25% completion across the learning path.",
      icon: Sparkles,
      progress: Math.min(100, Math.round((stats.overallProgress / 25) * 100)),
      unlocked: stats.overallProgress >= 25,
    },
  ];

  return (
    <ProductShell>
      <div className="grid gap-6 p-5">
        <section className="rounded-xl border border-[color:var(--border-color)] bg-white p-6 shadow-[var(--shadow-card)]">
          <p className="text-xs font-bold tracking-[0.18em] text-[color:var(--accent)] uppercase">
            Achievements
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
            Your learning milestones
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
            Badges unlock from real progress: completed lessons, quiz attempts, streaks, and module completion.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <article
                key={badge.title}
                className="rounded-xl border border-[color:var(--border-color)] bg-white p-5 shadow-[var(--shadow-card)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <span
                    className={
                      badge.unlocked
                        ? "flex h-12 w-12 items-center justify-center rounded-lg bg-[color:var(--accent)] text-white"
                        : "flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-400"
                    }
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span
                    className={
                      badge.unlocked
                        ? "rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700"
                        : "rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500"
                    }
                  >
                    {badge.unlocked ? "Unlocked" : "In progress"}
                  </span>
                </div>
                <h2 className="mt-5 text-lg font-bold text-slate-950">{badge.title}</h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">{badge.description}</p>
                <ProgressBar value={badge.progress} className="mt-5 h-2" />
                <p className="mt-2 text-right text-sm font-bold text-slate-600">
                  {badge.progress}%
                </p>
              </article>
            );
          })}
        </section>
      </div>
    </ProductShell>
  );
}
