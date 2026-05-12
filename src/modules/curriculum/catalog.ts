import type {
  CodeExample,
  CodeLanguage,
  Curriculum,
  Lesson,
  ModuleSummary,
  PracticeTask,
  QuizQuestion,
} from "@/lessons/contracts";
import { moduleSeeds } from "@/modules/curriculum/seed";

type TopicSeed = (typeof moduleSeeds)[number]["lessons"][number];
type ModuleSeed = (typeof moduleSeeds)[number];

const specialLessonIntros: Record<string, Partial<Lesson>> = {
  encapsulation: {
    simpleExplanation:
      "Encapsulation means an object protects its own data. Outside code should ask the object to do something instead of changing its internal fields directly.",
    deepExplanation:
      "In backend code, encapsulation is what stops business objects from drifting into invalid states. A `BankAccount`, `Customer`, or `Order` should not let any other class change important values whenever it wants. Instead, the object exposes clear methods such as `Deposit`, `Activate`, or `Cancel`. Those methods validate input, protect invariants, and make the code easier to reason about during debugging. When junior developers skip encapsulation, they often end up with entities that can be changed from everywhere, which makes bugs feel random and makes domain rules hard to trust.",
    interviewAnswer:
      "Encapsulation is the OOP principle of hiding internal state and exposing controlled operations. In backend systems it protects data integrity, makes business rules explicit, and reduces accidental misuse from other parts of the codebase.",
  },
  "what-is-dto": {
    interviewAnswer:
      "A DTO, or Data Transfer Object, is a shape used to move data between layers or across HTTP boundaries. We use DTOs to control what the API accepts and returns instead of exposing database entities directly.",
  },
  "swagger-examples": {
    tags: ["swagger", "openapi", "api testing", "documentation"],
  },
};

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

  if (moduleOrder <= 5) {
    return "Beginner";
  }

  if (moduleOrder <= 10) {
    return "Junior";
  }

  return "Intermediate";
}

function chooseLanguage(moduleSeed: ModuleSeed, topic: TopicSeed): CodeLanguage {
  if (topic.language) {
    return topic.language;
  }

  return moduleSeed.defaultLanguage;
}

function buildCodeExample(
  moduleSeed: ModuleSeed,
  topic: TopicSeed,
  lessonId: string,
): CodeExample {
  const language = chooseLanguage(moduleSeed, topic);

  const examples: Record<CodeLanguage, CodeExample> = {
    csharp: {
      title: `${topic.title} in a small .NET service`,
      language,
      code: `public sealed class ${humanizeSlug(topic.slug).replaceAll(" ", "")}Service
{
    private readonly ILogger<${humanizeSlug(topic.slug).replaceAll(" ", "")}Service> _logger;

    public ${humanizeSlug(topic.slug).replaceAll(" ", "")}Service(
        ILogger<${humanizeSlug(topic.slug).replaceAll(" ", "")}Service> logger)
    {
        _logger = logger;
    }

    public string Explain()
    {
        _logger.LogInformation("Teaching ${topic.title} for lesson ${lessonId}");
        return "${topic.title} becomes easier when the rule is explicit in code.";
    }
}`,
      output: `${topic.title} becomes easier when the rule is explicit in code.`,
      walkthrough: [
        "The service keeps one focused responsibility so the example stays easy to read.",
        "The logger shows how backend code often records important actions for debugging.",
        "The returned string represents the business message or response you would surface to the caller.",
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
        "The branch name makes the task easy to understand in code review.",
        "The commit message explains the change in plain English.",
        "The final status check confirms the local repository is clean before pushing.",
      ],
    },
    json: {
      title: `${topic.title} request and response example`,
      language,
      code: `{
  "request": {
    "method": "GET",
    "path": "/api/${topic.slug}",
    "headers": {
      "Accept": "application/json"
    }
  },
  "response": {
    "status": 200,
    "message": "${topic.title} works when the contract is clear."
  }
}`,
      output: `200 OK
${topic.title} works when the contract is clear.`,
      walkthrough: [
        "The request block shows what the client sends.",
        "The response block highlights the status and payload a backend usually returns.",
        "A simple contract is easier to debug than a vague or inconsistent one.",
      ],
    },
    sql: {
      title: `${topic.title} query example`,
      language,
      code: `SELECT Id, Name, Status
FROM Customers
WHERE IsActive = 1
ORDER BY CreatedAt DESC;`,
      output: `Id | Name        | Status
1  | Ada Lovelace | Active
2  | Grace Hopper | Active`,
      walkthrough: [
        "The query selects only the columns the application needs.",
        "The filter narrows the dataset so the result matches a real business rule.",
        "The ordering makes the newest records easier to inspect during testing.",
      ],
    },
    yaml: {
      title: `${topic.title} deployment snippet`,
      language,
      code: `steps:
  - name: Restore dependencies
    run: dotnet restore
  - name: Build service
    run: dotnet build --configuration Release
  - name: Deploy
    run: echo "Deploying ${topic.title}"`,
      output: `Restore succeeded
Build succeeded
Deploying ${topic.title}`,
      walkthrough: [
        "The pipeline restores packages before compiling to avoid missing dependency errors.",
        "The build step validates that the code compiles in the deployment environment.",
        "The deploy step is kept simple here so the release flow stays easy to understand.",
      ],
    },
    plaintext: {
      title: `${topic.title} debugging note`,
      language,
      code: `Error: ${topic.title} failed in CustomerApplicationService
Cause: input value was missing
Next step: reproduce the issue locally and inspect the stack trace`,
      output: `1. Reproduce
2. Confirm the failing line
3. Fix the cause, not only the symptom`,
      walkthrough: [
        "A good troubleshooting note records what failed in clear words.",
        "Naming the likely cause keeps the investigation focused.",
        "A repeatable next step prevents random guessing during debugging.",
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
    reason: "Use fake data while the real backend is still in progress.",
  });
});

app.listen(4000);`,
      output: `GET /api/${topic.slug}
200 {"lesson":"${topic.title}","status":"mocked","reason":"Use fake data while the real backend is still in progress."}`,
      walkthrough: [
        "The route returns predictable JSON, which makes frontend and testing work easier.",
        "Mock responses help teams move forward before every dependency is ready.",
        "A tiny server is enough to simulate many API behaviors for learning.",
      ],
    },
  };

  return examples[language];
}

function buildDiagram(moduleSeed: ModuleSeed, topic: TopicSeed) {
  return `flowchart LR
    A["${moduleSeed.title}"] --> B["${topic.title}"]
    B --> C["Simple rule"]
    B --> D["Backend example"]
    B --> E["Common mistakes"]
    B --> F["Interview answer"]`;
}

function buildPracticeTask(lessonId: string, moduleSeed: ModuleSeed, topic: TopicSeed): PracticeTask {
  return {
    id: `${lessonId}-practice`,
    lessonId,
    title: `${topic.title} practice`,
    prompt: `Build a tiny backend-focused example that demonstrates ${topic.title.toLowerCase()} inside a ${moduleSeed.title.toLowerCase()} scenario.`,
    expectedResult:
      "Your solution should be understandable by another junior developer, include validation or a clear workflow step, and produce a visible output.",
    hints: [
      `Start with one realistic business scenario such as customers, orders, authentication, or configuration.`,
      "Keep the example small enough that you can explain every line.",
      `Make sure the final result shows why ${topic.title.toLowerCase()} matters in real backend work.`,
    ],
    solution:
      `One good answer is to create a focused example around ${topic.title.toLowerCase()} and then explain the rule in plain English. The strongest solutions show the business rule, the code, and the output together so another developer can immediately see why the design works.`,
  };
}

function buildQuiz(lessonId: string, topic: TopicSeed, moduleSeed: ModuleSeed): QuizQuestion[] {
  return [
    {
      id: `${lessonId}-quiz-1`,
      lessonId,
      question: `Which statement best describes ${topic.title.toLowerCase()}?`,
      options: [
        "It is mostly about writing more code than necessary.",
        "It gives backend code a clearer and safer way to express intent.",
        "It replaces testing and debugging.",
        "It only matters in frontend projects.",
      ],
      correctAnswer:
        "It gives backend code a clearer and safer way to express intent.",
      explanation:
        `${topic.title} matters because it makes code easier to understand, change, and trust in real backend work.`,
    },
    {
      id: `${lessonId}-quiz-2`,
      lessonId,
      question: `When applying ${topic.title.toLowerCase()} in ${moduleSeed.title.toLowerCase()}, what should you optimize for first?`,
      options: [
        "Clarity of the contract and correctness of the behavior",
        "Making the file as long as possible",
        "Using advanced syntax even when it hides the intent",
        "Skipping validation to save time",
      ],
      correctAnswer: "Clarity of the contract and correctness of the behavior",
      explanation:
        "Junior-friendly backend code is easier to review and debug when the contract is obvious and the behavior is correct.",
    },
  ];
}

function buildWhyItMatters(moduleSeed: ModuleSeed, topic: TopicSeed) {
  return `${topic.title} matters because backend developers work with moving parts: input, rules, data, logs, and other services. When you understand ${topic.title.toLowerCase()}, you stop memorizing magic steps and start seeing why a system behaves the way it does. That helps you debug faster, explain your code in code review, and make safer changes.`;
}

function buildSimpleExplanation(moduleSeed: ModuleSeed, topic: TopicSeed) {
  return `${topic.title} is a practical rule inside ${moduleSeed.title.toLowerCase()}. Think of it as a way to keep your code honest: the backend should do the right thing, expose the right information, and make the next step obvious for the developer reading it.`;
}

function buildDeepExplanation(moduleSeed: ModuleSeed, topic: TopicSeed) {
  return `${topic.title} becomes important once a project has real users, real data, and real teammates. In a tiny demo, you can often get away with vague naming or skipping structure. In a real backend, that usually creates hidden bugs, inconsistent responses, or code that only the original author understands. A strong junior developer learns to connect the topic to request flow, state changes, validation, and maintainability. That is the deeper goal here: not only knowing the definition, but understanding how ${topic.title.toLowerCase()} changes the way you design and review code in ${moduleSeed.title.toLowerCase()}.`;
}

function buildRealWorldUsage(moduleSeed: ModuleSeed, topic: TopicSeed) {
  const scenario =
    topic.scenario ??
    `a customer-facing service where the team needs predictable behavior, readable logs, and clear API contracts`;

  return `In a real project, ${topic.title.toLowerCase()} shows up when you are working on ${scenario}. The team is rarely asking for theory alone. They need code that another developer can debug next week, test next month, and extend next quarter. That is why good backend developers connect ${topic.title.toLowerCase()} to concrete workflows instead of treating it like vocabulary practice.`;
}

function buildBeginnerExplanation(topic: TopicSeed) {
  return `If you explain ${topic.title.toLowerCase()} to a beginner, keep it simple: what is the rule, where do you see it in code, and what problem does it prevent? If the answer feels abstract, bring it back to one request, one class, one query, or one command.`;
}

function buildMistakes(topic: TopicSeed) {
  return [
    `Using ${topic.title.toLowerCase()} by name without understanding how it changes the code flow.`,
    "Skipping validation, naming, or structure because the example looked simple in a tutorial.",
    "Copying patterns from another project without checking whether they fit the current requirement.",
  ];
}

function buildBestPractices(topic: TopicSeed) {
  return [
    `State the goal of ${topic.title.toLowerCase()} in plain English before you write code.`,
    "Keep the example small enough that every line has a reason to exist.",
    "Show the expected output so the learner can confirm the idea worked.",
  ];
}

function buildSummary(topic: TopicSeed) {
  return [
    `${topic.title} is easier to remember when you connect it to a real backend problem.`,
    "The strongest solutions make the rule visible in code and easy to explain out loud.",
    "If you can explain the output and the common mistakes, you probably understand the topic well.",
  ];
}

function buildLesson(moduleSeed: ModuleSeed, topic: TopicSeed, moduleOrder: number, order: number): Lesson {
  const id = toId(moduleSeed.id, topic.slug);
  const codeExample = buildCodeExample(moduleSeed, topic, id);
  const overrides = specialLessonIntros[topic.slug] ?? {};

  return {
    id,
    slug: topic.slug,
    moduleId: moduleSeed.id,
    moduleSlug: moduleSeed.slug,
    moduleTitle: moduleSeed.title,
    title: topic.title,
    description:
      `${topic.title} explained in simple English with backend examples, expected outputs, common mistakes, interview framing, and guided practice.`,
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
        ...(overrides.tags ?? []),
      ]),
    ),
    outcomes: [
      `Explain ${topic.title.toLowerCase()} in simple words.`,
      `Recognize ${topic.title.toLowerCase()} in a backend codebase.`,
      `Apply ${topic.title.toLowerCase()} in a small practical task.`,
    ],
    whyItMatters: buildWhyItMatters(moduleSeed, topic),
    simpleExplanation:
      overrides.simpleExplanation ?? buildSimpleExplanation(moduleSeed, topic),
    deepExplanation:
      overrides.deepExplanation ?? buildDeepExplanation(moduleSeed, topic),
    realWorldUsage: buildRealWorldUsage(moduleSeed, topic),
    explainLikeBeginner: buildBeginnerExplanation(topic),
    interviewAnswer:
      overrides.interviewAnswer ??
      `${topic.title} is important because it helps backend teams keep behavior predictable, maintainable, and easier to reason about. A good answer ties the concept to validation, request flow, data safety, and teamwork instead of only repeating the textbook definition.`,
    commonMistakes: buildMistakes(topic),
    bestPractices: buildBestPractices(topic),
    summary: buildSummary(topic),
    diagram: buildDiagram(moduleSeed, topic),
    codeExamples: [codeExample],
    practiceTasks: [buildPracticeTask(id, moduleSeed, topic)],
    quiz: buildQuiz(id, topic, moduleSeed),
  };
}

let cachedCurriculum: Curriculum | null = null;

export function buildCurriculum(): Curriculum {
  if (cachedCurriculum) {
    return cachedCurriculum;
  }

  const lessons: Lesson[] = [];
  const modules: ModuleSummary[] = moduleSeeds.map((moduleSeed, moduleIndex) => {
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
      order: moduleOrder,
      expectedOutcomes: moduleSeed.expectedOutcomes,
      lessonCount: moduleLessons.length,
      lessons: moduleLessons,
    };
  });

  cachedCurriculum = { modules, lessons };
  return cachedCurriculum;
}

export function getModuleBySlug(moduleSlug: string) {
  return buildCurriculum().modules.find((module) => module.slug === moduleSlug) ?? null;
}

export function getLessonsForModule(moduleSlug: string) {
  return buildCurriculum().lessons.filter((lesson) => lesson.moduleSlug === moduleSlug);
}

export function getLessonBySlugs(moduleSlug: string, lessonSlug: string) {
  return (
    buildCurriculum().lessons.find(
      (lesson) => lesson.moduleSlug === moduleSlug && lesson.slug === lessonSlug,
    ) ?? null
  );
}

export function getNeighborLessons(moduleSlug: string, lessonSlug: string) {
  const moduleLessons = getLessonsForModule(moduleSlug).sort((a, b) => a.order - b.order);
  const currentIndex = moduleLessons.findIndex((lesson) => lesson.slug === lessonSlug);

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
