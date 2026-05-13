"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import {
  Award,
  Bookmark,
  BookOpen,
  ChevronRight,
  Code2,
  FileText,
  GraduationCap,
  Home,
  Network,
  NotebookPen,
  Shapes,
} from "lucide-react";

import type { Lesson, ModuleSummary } from "@/lessons/contracts";
import { ProgressBar } from "@/components/ProgressBar";
import { cn } from "@/shared/utils/cn";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: GraduationCap },
  { href: "/playground", label: "Code Playground", icon: Code2 },
  { href: "/achievements", label: "Achievements", icon: Award },
  { href: "/notes", label: "Notes", icon: FileText },
  { href: "/bookmarks", label: "Bookmarks", icon: Bookmark },
];

const moduleIcons = [BookOpen, Code2, Shapes, Network, NotebookPen];
const sidebarScrollKey = "dotnetlearn-sidebar-scroll";

export function Sidebar({
  modules,
  activeModuleSlug,
  activeLessonSlug,
  overallProgress,
  completedLessons,
  totalLessons,
  lessons,
}: {
  modules: ModuleSummary[];
  activeModuleSlug?: string;
  activeLessonSlug?: string;
  overallProgress?: number;
  completedLessons?: number;
  totalLessons?: number;
  lessons?: Lesson[];
}) {
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLElement | null>(null);
  const visibleModules = modules;

  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    const savedScrollTop = Number(window.localStorage.getItem(sidebarScrollKey) ?? "0");
    if (Number.isFinite(savedScrollTop) && savedScrollTop > 0) {
      sidebar.scrollTop = savedScrollTop;
    }
  }, []);

  function saveSidebarScroll() {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;
    window.localStorage.setItem(sidebarScrollKey, String(sidebar.scrollTop));
  }

  function isActiveLink(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <aside
      ref={sidebarRef}
      onScroll={saveSidebarScroll}
      className="no-scrollbar sticky top-0 hidden h-screen w-[260px] shrink-0 overflow-y-auto border-r border-[color:var(--border-color)] bg-white px-3 py-4 lg:block"
    >
      <Link href="/" className="mb-5 flex items-center gap-3 px-1">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#0f6bff,#2bb8df)] text-white shadow-[0_10px_20px_rgba(15,107,255,0.18)]">
          <Shapes className="h-5 w-5" />
        </span>
        <span className="text-xl font-bold tracking-tight text-slate-950">
          Dotnet<span className="text-[color:var(--accent)]">Learn</span>
        </span>
      </Link>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActiveLink(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex h-9 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition",
                active
                  ? "bg-[color:var(--accent)] text-white shadow-[0_10px_22px_rgba(15,107,255,0.22)]"
                  : "text-slate-600 hover:bg-[#eef5ff] hover:text-[color:var(--accent)]",
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-6">
        <p className="px-3 text-xs font-bold tracking-[0.14em] text-slate-400 uppercase">
          Modules
        </p>
        <div className="mt-3 space-y-1">
          {visibleModules.map((module, index) => {
            const isActive = module.slug === activeModuleSlug;
            const Icon = moduleIcons[index % moduleIcons.length];
            return (
              <div key={module.id}>
                <Link
                  href={`/learn/${module.slug}`}
                  className={cn(
                    "flex min-h-10 items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition",
                    isActive
                      ? "bg-[#eaf3ff] text-[color:var(--accent)] ring-1 ring-inset ring-[#cfe1ff]"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-950",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="min-w-0 flex-1 leading-5">{module.title}</span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
                </Link>

                {isActive && lessons?.length ? (
                  <div className="mt-1 space-y-0.5 border-l border-[#d8e7fb] pl-4">
                    {lessons.slice(0, 11).map((lesson) => (
                      <Link
                        key={lesson.id}
                        href={`/learn/${lesson.moduleSlug}/${lesson.slug}`}
                        className={cn(
                          "block rounded-md px-3 py-1.5 text-sm leading-5 transition",
                          lesson.slug === activeLessonSlug
                            ? "bg-[color:var(--accent)] font-semibold text-white"
                            : "text-slate-500 hover:bg-[#f5f9ff] hover:text-slate-950",
                        )}
                      >
                        {lesson.title}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-[color:var(--border-color)] bg-white p-3 shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-slate-600">Overall Progress</span>
          <span className="font-bold text-slate-900">{overallProgress ?? 0}%</span>
        </div>
        <ProgressBar value={overallProgress ?? 0} className="mt-4 h-2" />
        <p className="mt-3 text-xs leading-5 text-slate-500">
          {completedLessons ?? 0} / {totalLessons ?? modules.reduce((total, module) => total + module.lessonCount, 0)} lessons completed
        </p>
      </div>
    </aside>
  );
}
