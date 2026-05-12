import {
  buildCurriculum,
  getLessonBySlugs,
  searchLessons,
} from "@/modules/curriculum/catalog";

describe("curriculum catalog", () => {
  it("builds the full 15-module curriculum with real lessons", () => {
    const curriculum = buildCurriculum();

    expect(curriculum.modules).toHaveLength(15);
    expect(curriculum.lessons.length).toBeGreaterThan(90);
    expect(curriculum.modules[0]?.title).toBe("Object-Oriented Programming");
    expect(curriculum.modules.at(-1)?.title).toBe("Troubleshooting");
  });

  it("returns lesson pages with teaching sections, code, quiz, and practice", () => {
    const lesson = getLessonBySlugs("object-oriented-programming", "encapsulation");

    expect(lesson?.title).toBe("Encapsulation");
    expect(lesson?.simpleExplanation.length).toBeGreaterThan(80);
    expect(lesson?.deepExplanation.length).toBeGreaterThan(200);
    expect(lesson?.codeExamples[0]?.language).toBe("csharp");
    expect(lesson?.quiz.length).toBeGreaterThanOrEqual(2);
    expect(lesson?.practiceTasks.length).toBeGreaterThanOrEqual(1);
    expect(lesson?.commonMistakes.length).toBeGreaterThanOrEqual(2);
  });

  it("supports searching by topic and lesson content", () => {
    const results = searchLessons("swagger dto");
    const slugs = results.map((lesson) => lesson.slug);

    expect(slugs).toContain("swagger-examples");
    expect(slugs).toContain("what-is-dto");
  });
});
