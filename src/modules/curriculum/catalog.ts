import type {
  CodeExample,
  CodeLanguage,
  Curriculum,
  Lesson,
  ModuleSummary,
  PracticeTask,
  QuizKind,
  QuizQuestion,
} from "@/lessons/contracts";
import { moduleSeeds } from "@/modules/curriculum/seed";
import {
  getAuthoredLessonContent,
  type LessonContent,
} from "@/modules/curriculum/content";

type TopicSeed = (typeof moduleSeeds)[number]["lessons"][number];
type ModuleSeed = (typeof moduleSeeds)[number];

function buildModuleSummary(moduleSeed: ModuleSeed) {
  return (
    moduleSeed.summary ??
    `${moduleSeed.title} gives you a guided path through ${moduleSeed.lessons
      .slice(0, 3)
      .map((lesson) => lesson.title.toLowerCase())
      .join(", ")} so the topic feels practical early.`
  );
}

function buildModuleCategory(moduleSeed: ModuleSeed) {
  return moduleSeed.category ?? "Backend foundations";
}

function buildModulePace(moduleSeed: ModuleSeed) {
  return moduleSeed.pace ?? `${Math.max(3, Math.ceil(moduleSeed.lessons.length / 3))} days`;
}

function buildModuleFocusAreas(moduleSeed: ModuleSeed) {
  return moduleSeed.focusAreas ?? moduleSeed.lessons.slice(0, 3).map((lesson) => lesson.title);
}

function buildLessonDescription(moduleSeed: ModuleSeed, topic: TopicSeed) {
  const focusLabel = buildModuleFocusAreas(moduleSeed).slice(0, 2).join(" and ");

  return `${topic.title} in ${moduleSeed.title}: clear intuition, realistic ${focusLabel.toLowerCase()} context, runnable examples, output, common mistakes, and guided practice.`;
}

function toId(moduleId: string, topicSlug: string) {
  return `${moduleId}-${topicSlug}`;
}

function humanizeSlug(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function chooseDifficulty(moduleOrder: number, topic: TopicSeed) {
  if (topic.difficulty) {
    return topic.difficulty;
  }
  if (moduleOrder <= 5) return "Beginner";
  if (moduleOrder <= 10) return "Junior";
  return "Intermediate";
}

function chooseLanguage(moduleSeed: ModuleSeed, topic: TopicSeed): CodeLanguage {
  return topic.language ?? moduleSeed.defaultLanguage;
}

const QUIZ_KINDS_FALLBACK: QuizKind[] = [
  "concept",
  "code-reading",
  "spot-the-bug",
  "interview",
];

function buildFallbackCodeExample(
  moduleSeed: ModuleSeed,
  topic: TopicSeed,
  lessonId: string,
): CodeExample {
  const language = chooseLanguage(moduleSeed, topic);
  const className = humanizeSlug(topic.slug).replaceAll(" ", "");

  const examples: Record<CodeLanguage, CodeExample> = {
    csharp: {
      title: `${topic.title} in a small .NET service`,
      language,
      code: `public sealed class ${className}Service
{
    private readonly ILogger<${className}Service> _logger;

    public ${className}Service(ILogger<${className}Service> logger) => _logger = logger;

    public string Explain()
    {
        _logger.LogInformation("Demonstrating ${topic.title} for ${lessonId}");
        return "${topic.title} keeps backend code predictable and reviewable.";
    }
}`,
      output: `${topic.title} keeps backend code predictable and reviewable.`,
      walkthrough: [
        `The service has one focused responsibility so the example for ${topic.title} stays easy to read.`,
        "The logger shows how backend code records important actions for later debugging.",
        "The return value represents the message you would surface to the caller.",
      ],
    },
    bash: {
      title: `${topic.title} from the terminal`,
      language,
      code: `git checkout -b feature/${topic.slug}
git add .
git commit -m "${topic.title}: working example"
git status`,
      output: `On branch feature/${topic.slug}
nothing to commit, working tree clean`,
      walkthrough: [
        `Branch name encodes the task (${topic.title}) so reviewers can find it.`,
        "Commit message is plain English and complete on its own.",
        "Status confirms a clean tree before pushing.",
      ],
    },
    json: {
      title: `${topic.title} request and response example`,
      language,
      code: `{
  "request": {
    "method": "GET",
    "path": "/api/${topic.slug}",
    "headers": { "Accept": "application/json" }
  },
  "response": {
    "status": 200,
    "body": { "message": "${topic.title} works when the contract is clear." }
  }
}`,
      output: `200 OK
{"message":"${topic.title} works when the contract is clear."}`,
      walkthrough: [
        "Request shows what the client sends.",
        "Response highlights status and a small JSON payload.",
        "A clear contract is far easier to debug than an ambiguous one.",
      ],
    },
    sql: {
      title: `${topic.title} query example`,
      language,
      code: `SELECT Id, Name, Status
FROM Customers
WHERE IsActive = 1
ORDER BY CreatedAt DESC;`,
      output: `Id   Name           Status
1    Ada Lovelace   Active
2    Grace Hopper   Active`,
      walkthrough: [
        "Selects only the columns the caller needs.",
        "Filters to active rows so results match a business rule.",
        "Orders by recency to make new records easy to spot.",
      ],
    },
    yaml: {
      title: `${topic.title} deployment snippet`,
      language,
      code: `steps:
  - name: Restore dependencies
    run: dotnet restore
  - name: Build
    run: dotnet build --configuration Release
  - name: Deploy
    run: echo "Deploying ${topic.title}"`,
      output: `Restore succeeded
Build succeeded
Deploying ${topic.title}`,
      walkthrough: [
        "Restore runs first to fail fast on missing dependencies.",
        "Build validates the project before any deploy step.",
        "Deploy is intentionally minimal here for readability.",
      ],
    },
    plaintext: {
      title: `${topic.title} debugging note`,
      language,
      code: `Symptom: ${topic.title} fails for some inputs but not others.
Hypothesis: input validation is missing on one path.
Next step: reproduce locally with the failing input, attach a debugger, inspect the call site.`,
      output: `1. Reproduce locally
2. Confirm the failing line
3. Fix the cause, not only the symptom`,
      walkthrough: [
        "A good debugging note names the symptom and a hypothesis.",
        "Reproduction is the first step before any speculation.",
        "Fix the cause; otherwise the symptom returns under a new name.",
      ],
    },
    typescript: {
      title: `${topic.title} mock server example`,
      language,
      code: `import express from "express";

const app = express();

app.get("/api/${topic.slug}", (_req, res) => {
  res.json({
    lesson: "${topic.title}",
    status: "mocked",
    note: "Use predictable fakes while the real backend is in progress.",
  });
});

app.listen(4000);`,
      output: `GET /api/${topic.slug}
200 {"lesson":"${topic.title}","status":"mocked","note":"Use predictable fakes while the real backend is in progress."}`,
      walkthrough: [
        "Predictable JSON makes downstream code easier to test.",
        "A small server is enough to unblock teams waiting on the real one.",
        "Mocks should mirror the eventual contract closely.",
      ],
    },
  };

  return examples[language];
}

function buildFallbackQuiz(
  lessonId: string,
  topic: TopicSeed,
  moduleSeed: ModuleSeed,
): QuizQuestion[] {
  const lowerTitle = topic.title.toLowerCase();
  const lowerModule = moduleSeed.title.toLowerCase();

  return [
    {
      id: `${lessonId}-quiz-1`,
      lessonId,
      kind: "concept",
      question: `Which statement best describes ${lowerTitle}?`,
      options: [
        "It is a stylistic preference with no real impact on the backend.",
        `It gives ${lowerModule} a clearer, safer way to express intent and behaviour.`,
        "It replaces unit tests, integration tests, and code review.",
        "It only applies to client-side code.",
      ],
      correctAnswer: `It gives ${lowerModule} a clearer, safer way to express intent and behaviour.`,
      explanation: `${topic.title} matters because it makes code easier to read, change, and trust in production backends.`,
    },
    {
      id: `${lessonId}-quiz-2`,
      lessonId,
      kind: "code-reading",
      question: `When you see ${lowerTitle} applied in a code review for a ${lowerModule} project, what is the first thing to verify?`,
      options: [
        "That the file count went up.",
        "That the change actually reflects the rule on the production path, not just the example.",
        "That comments were added even if they restate the code.",
        "That every public class was renamed.",
      ],
      correctAnswer:
        "That the change actually reflects the rule on the production path, not just the example.",
      explanation:
        "Surface-level edits often fake the intent. Confirm the rule applies where it has to.",
    },
    {
      id: `${lessonId}-quiz-3`,
      lessonId,
      kind: "spot-the-bug",
      question: `A teammate applies ${lowerTitle} but the test still fails. The most common cause is...`,
      options: [
        "The compiler is wrong.",
        "An older code path bypasses the change and keeps the old behaviour.",
        "The unit test framework is out of date.",
        "${lowerTitle} is incompatible with the language.",
      ],
      correctAnswer:
        "An older code path bypasses the change and keeps the old behaviour.",
      explanation:
        "Half-applied refactors are a frequent source of confusion. Run a search across the codebase to confirm the rule is consistent.",
    },
    {
      id: `${lessonId}-quiz-4`,
      lessonId,
      kind: "interview",
      question: `In an interview, what is the strongest one-sentence answer about ${lowerTitle}?`,
      options: [
        "Memorise the textbook definition word-for-word.",
        "Connect the concept to a concrete backend outcome — fewer bugs, clearer reviews, safer changes — and reference where you applied it.",
        "Recite all the alternatives without naming a preference.",
        "Say it does not matter in modern .NET.",
      ],
      correctAnswer:
        "Connect the concept to a concrete backend outcome — fewer bugs, clearer reviews, safer changes — and reference where you applied it.",
      explanation:
        "Interviewers grade on whether you can translate theory into the daily impact on a real codebase.",
    },
  ];
}

function buildFallbackContent(
  moduleSeed: ModuleSeed,
  topic: TopicSeed,
  lessonId: string,
): LessonContent {
  const lower = topic.title.toLowerCase();
  const moduleTitle = moduleSeed.title;
  const scenario =
    topic.scenario ??
    "a small backend service where clear contracts, predictable behaviour, and readable logs all matter";

  const fallback: LessonContent = {
    whyItMatters: `${topic.title} matters because real backend work depends on small habits that compound. Get ${lower} right and code review, debugging, and onboarding all become noticeably easier.`,
    simpleExplanation: `${topic.title} is a practical rule inside ${moduleTitle.toLowerCase()}: aim for clear intent, predictable behaviour, and a contract that a junior teammate could read out loud.`,
    deepExplanation: `${topic.title} earns its place once a project has real users and real teammates. In a small demo you can get away with vague naming or skipping structure; in a real backend that habit produces hidden bugs and code only the original author understands. The deeper goal is to connect ${lower} to request flow, state changes, validation, and maintainability so the rule changes how you design and review code.`,
    realWorldUsage: `In a real project, ${lower} shows up when you are working on ${scenario}. Teams rarely ask for theory; they ask for code another developer can debug next week, test next month, and extend next quarter.`,
    explainLikeBeginner: `If you are explaining ${lower} for the first time, keep it concrete: name the rule, point at where it appears in code, and describe one problem it prevents. If the answer feels abstract, ground it in a single request, class, or query.`,
    interviewAnswer: `${topic.title} is important because it helps backend teams keep behaviour predictable, maintainable, and easy to reason about. A strong answer ties the concept to validation, request flow, data safety, and teamwork — not just the textbook definition.`,
    commonMistakes: [
      `Using ${lower} by name without understanding how it changes the code flow.`,
      "Skipping validation, naming, or structure because a tutorial example skipped them.",
      "Copying patterns from another project without checking they fit the current requirement.",
    ],
    bestPractices: [
      `State the goal of ${lower} in plain English before writing code.`,
      "Keep the example small enough that every line has a clear reason to exist.",
      "Show the expected output so the next reader can confirm the rule worked.",
    ],
    summary: [
      `${topic.title} is easier to remember when connected to a real backend problem.`,
      "Strong solutions make the rule visible in code and easy to explain out loud.",
      "If you can describe the output and the common mistakes, you probably understand the topic.",
    ],
    codeExample: buildFallbackCodeExample(moduleSeed, topic, lessonId),
    practice: {
      prompt: `Build a small backend-focused example that demonstrates ${lower} inside a ${moduleTitle.toLowerCase()} scenario. Keep it tight enough to walk through line by line.`,
      expectedResult:
        "Another developer can read your example aloud, identify the rule, and confirm the output matches the intent.",
      hints: [
        "Pick a realistic noun (customers, orders, payments) so the example feels like production.",
        "Limit the example to what proves the rule; resist adding 'nice to have' features.",
        `Surface the output that makes ${lower} visible.`,
      ],
      solution: `A good answer is a focused example around ${lower} accompanied by the rule in plain English. The strongest solutions show the business rule, the code, and the output together so any reviewer can see why the design works.`,
    },
    quiz: buildFallbackQuiz(lessonId, topic, moduleSeed).map((q) => ({
      kind: q.kind,
      question: q.question,
      options: [...q.options],
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
    })),
  };

  return fallback;
}

function buildDiagram(moduleSeed: ModuleSeed, topic: TopicSeed) {
  return `flowchart LR
    A["${moduleSeed.title}"] --> B["${topic.title}"]
    B --> C["Simple rule"]
    B --> D["Backend example"]
    B --> E["Common mistakes"]
    B --> F["Interview answer"]`;
}

function buildPracticeTask(
  lessonId: string,
  content: LessonContent,
): PracticeTask {
  return {
    id: `${lessonId}-practice`,
    lessonId,
    title: "Practice",
    prompt: content.practice.prompt,
    expectedResult: content.practice.expectedResult,
    hints: [...content.practice.hints],
    solution: content.practice.solution,
  };
}

function buildQuiz(lessonId: string, content: LessonContent): QuizQuestion[] {
  return content.quiz.map((spec, index) => ({
    id: `${lessonId}-quiz-${index + 1}`,
    lessonId,
    kind: spec.kind ?? QUIZ_KINDS_FALLBACK[index] ?? "concept",
    question: spec.question,
    options: [...spec.options],
    correctAnswer: spec.correctAnswer,
    explanation: spec.explanation,
  }));
}

function buildCodeExample(
  content: LessonContent,
  moduleSeed: ModuleSeed,
  topic: TopicSeed,
): CodeExample {
  return {
    title: content.codeExample.title,
    language: content.codeExample.language ?? chooseLanguage(moduleSeed, topic),
    code: content.codeExample.code,
    output: content.codeExample.output,
    walkthrough: [...content.codeExample.walkthrough],
  };
}

function buildLesson(
  moduleSeed: ModuleSeed,
  topic: TopicSeed,
  moduleOrder: number,
  order: number,
): Lesson {
  const id = toId(moduleSeed.id, topic.slug);
  const authored = getAuthoredLessonContent(moduleSeed.id, topic.slug);
  const content: LessonContent =
    authored ?? buildFallbackContent(moduleSeed, topic, id);

  return {
    id,
    slug: topic.slug,
    moduleId: moduleSeed.id,
    moduleSlug: moduleSeed.slug,
    moduleTitle: moduleSeed.title,
    title: topic.title,
    description: buildLessonDescription(moduleSeed, topic),
    duration: `${12 + ((order + moduleOrder) % 5) * 4} min`,
    difficulty: chooseDifficulty(moduleOrder, topic),
    order,
    moduleOrder,
    tags: Array.from(
      new Set([
        moduleSeed.slug,
        topic.slug,
        topic.title.toLowerCase(),
        ...topic.keywords,
      ]),
    ),
    outcomes: [
      `Explain ${topic.title.toLowerCase()} in simple words a junior teammate would understand.`,
      `Recognise ${topic.title.toLowerCase()} in real backend code.`,
      `Apply ${topic.title.toLowerCase()} in a small, focused practice task.`,
    ],
    whyItMatters: content.whyItMatters,
    simpleExplanation: content.simpleExplanation,
    deepExplanation: content.deepExplanation,
    realWorldUsage: content.realWorldUsage,
    explainLikeBeginner: content.explainLikeBeginner,
    interviewAnswer: content.interviewAnswer,
    commonMistakes: [...content.commonMistakes],
    bestPractices: [...content.bestPractices],
    summary: [...content.summary],
    diagram: buildDiagram(moduleSeed, topic),
    codeExamples: [buildCodeExample(content, moduleSeed, topic)],
    practiceTasks: [buildPracticeTask(id, content)],
    quiz: buildQuiz(id, content),
  };
}

let cachedCurriculum: Curriculum | null = null;

export function buildCurriculum(): Curriculum {
  if (cachedCurriculum) {
    return cachedCurriculum;
  }

  const lessons: Lesson[] = [];
  const modules: ModuleSummary[] = moduleSeeds.map(
    (moduleSeed, moduleIndex) => {
      const moduleOrder = moduleIndex + 1;
      const moduleLessons = moduleSeed.lessons.map((topic, lessonIndex) => {
        const lesson = buildLesson(moduleSeed, topic, moduleOrder, lessonIndex + 1);
        lessons.push(lesson);

        return {
          id: lesson.id,
          slug: lesson.slug,
          title: lesson.title,
          description: lesson.description,
          duration: lesson.duration,
          difficulty: lesson.difficulty,
          order: lesson.order,
        };
      });

      return {
        id: moduleSeed.id,
        slug: moduleSeed.slug,
        title: moduleSeed.title,
        description: moduleSeed.description,
        summary: buildModuleSummary(moduleSeed),
        category: buildModuleCategory(moduleSeed),
        pace: buildModulePace(moduleSeed),
        focusAreas: buildModuleFocusAreas(moduleSeed),
        order: moduleOrder,
        expectedOutcomes: moduleSeed.expectedOutcomes,
        lessonCount: moduleLessons.length,
        lessons: moduleLessons,
      };
    },
  );

  cachedCurriculum = { modules, lessons };
  return cachedCurriculum;
}

export function getModuleBySlug(moduleSlug: string) {
  return (
    buildCurriculum().modules.find((module) => module.slug === moduleSlug) ??
    null
  );
}

export function getLessonsForModule(moduleSlug: string) {
  return buildCurriculum().lessons.filter(
    (lesson) => lesson.moduleSlug === moduleSlug,
  );
}

export function getLessonBySlugs(moduleSlug: string, lessonSlug: string) {
  return (
    buildCurriculum().lessons.find(
      (lesson) =>
        lesson.moduleSlug === moduleSlug && lesson.slug === lessonSlug,
    ) ?? null
  );
}

export function getNeighborLessons(moduleSlug: string, lessonSlug: string) {
  const moduleLessons = getLessonsForModule(moduleSlug).sort(
    (a, b) => a.order - b.order,
  );
  const currentIndex = moduleLessons.findIndex(
    (lesson) => lesson.slug === lessonSlug,
  );

  if (currentIndex === -1) {
    return { previous: null, next: null };
  }

  return {
    previous: moduleLessons[currentIndex - 1] ?? null,
    next: moduleLessons[currentIndex + 1] ?? null,
  };
}

export function searchLessons(query: string) {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    return buildCurriculum().lessons;
  }

  const tokens = trimmed.split(/\s+/g);

  return buildCurriculum()
    .lessons.map((lesson) => {
      const haystack = [
        lesson.title,
        lesson.description,
        lesson.moduleTitle,
        lesson.tags.join(" "),
        lesson.deepExplanation,
      ]
        .join(" ")
        .toLowerCase();

      const score = tokens.reduce((total, token) => {
        if (haystack.includes(token)) {
          return total + 1;
        }
        return total;
      }, 0);

      return { lesson, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      if (a.lesson.moduleOrder !== b.lesson.moduleOrder) {
        return a.lesson.moduleOrder - b.lesson.moduleOrder;
      }
      return a.lesson.order - b.lesson.order;
    })
    .map((entry) => entry.lesson);
}
