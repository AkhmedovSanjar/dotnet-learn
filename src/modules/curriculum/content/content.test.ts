import { describe, expect, it } from "vitest";

import { moduleSeeds } from "@/modules/curriculum/seed";
import {
  getAuthoredLessonContent,
  getAuthoredModuleIds,
} from "@/modules/curriculum/content";
import { buildCurriculum } from "@/modules/curriculum/catalog";

describe("authored lesson content", () => {
  const authoredIds = new Set(getAuthoredModuleIds());

  it("includes at least the foundational modules", () => {
    for (const expected of [
      "oop",
      "dtos",
      "api-requests",
      "database",
      "framework",
    ]) {
      expect(authoredIds.has(expected)).toBe(true);
    }
  });

  describe("for every authored lesson", () => {
    const authoredEntries = moduleSeeds
      .filter((m) => authoredIds.has(m.id))
      .flatMap((m) =>
        m.lessons.map((topic) => ({
          moduleId: m.id,
          slug: topic.slug,
          title: topic.title,
        })),
      );

    it("has at least one entry per module", () => {
      expect(authoredEntries.length).toBeGreaterThan(0);
    });

    it.each(authoredEntries)(
      "exposes content for $moduleId/$slug",
      ({ moduleId, slug }) => {
        const content = getAuthoredLessonContent(moduleId, slug);
        expect(content, `${moduleId}/${slug} should have content`).toBeDefined();
      },
    );

    it.each(authoredEntries)(
      "has exactly 4 quiz questions with the 4 distinct kinds for $moduleId/$slug",
      ({ moduleId, slug }) => {
        const content = getAuthoredLessonContent(moduleId, slug);
        expect(content).toBeDefined();
        expect(content!.quiz).toHaveLength(4);
        const kinds = content!.quiz.map((q) => q.kind);
        expect(new Set(kinds)).toEqual(
          new Set(["concept", "code-reading", "spot-the-bug", "interview"]),
        );
      },
    );

    it.each(authoredEntries)(
      "every correctAnswer is in its options for $moduleId/$slug",
      ({ moduleId, slug }) => {
        const content = getAuthoredLessonContent(moduleId, slug);
        for (const q of content!.quiz) {
          expect(q.options).toContain(q.correctAnswer);
        }
      },
    );
  });
});

describe("curriculum integration", () => {
  it("builds every lesson with 4 quiz questions", () => {
    const curriculum = buildCurriculum();
    for (const lesson of curriculum.lessons) {
      expect(lesson.quiz.length, `${lesson.id} quiz length`).toBe(4);
    }
  });

  it("every lesson quiz question has a kind", () => {
    const curriculum = buildCurriculum();
    for (const lesson of curriculum.lessons) {
      for (const q of lesson.quiz) {
        expect(["concept", "code-reading", "spot-the-bug", "interview"]).toContain(
          q.kind,
        );
      }
    }
  });
});
