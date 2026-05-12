import type { CodeLanguage, Difficulty } from "@/lessons/contracts";

interface TopicSeed {
  slug: string;
  title: string;
  keywords: string[];
  difficulty?: Difficulty;
  language?: CodeLanguage;
  scenario?: string;
}

interface ModuleSeed {
  id: string;
  slug: string;
  title: string;
  description: string;
  expectedOutcomes: string[];
  defaultLanguage: CodeLanguage;
  lessons: TopicSeed[];
}

export const moduleSeeds: ModuleSeed[] = [
  {
    id: "oop",
    slug: "object-oriented-programming",
    title: "Object-Oriented Programming",
    description:
      "Build the thinking model behind classes, objects, clean object state, and reusable backend design.",
    expectedOutcomes: [
      "Understand the four core OOP principles in practical backend code.",
      "Model simple domain objects in C# with safe state changes.",
      "Explain how OOP helps service, entity, and DTO design.",
    ],
    defaultLanguage: "csharp",
    lessons: [
      { slug: "what-is-oop", title: "What is OOP?", keywords: ["oop", "objects", "design"] },
      { slug: "class-vs-object", title: "Class vs Object", keywords: ["class", "object"] },
      { slug: "encapsulation", title: "Encapsulation", keywords: ["private", "state", "guard clauses"] },
      { slug: "inheritance", title: "Inheritance", keywords: ["base class", "reuse"] },
      { slug: "polymorphism", title: "Polymorphism", keywords: ["override", "interface"] },
      { slug: "abstraction", title: "Abstraction", keywords: ["hide complexity", "contract"] },
      { slug: "interface-vs-abstract-class", title: "Interface vs Abstract Class", keywords: ["interface", "abstract class"] },
      { slug: "constructor", title: "Constructor", keywords: ["initialization", "dependencies"] },
      { slug: "access-modifiers", title: "Access Modifiers", keywords: ["public", "private", "internal"] },
      { slug: "simple-oop-coding-tasks", title: "Simple OOP Coding Tasks", keywords: ["practice", "oop tasks"] },
      { slug: "oop-in-real-backend-projects", title: "How OOP Is Used in Real Backend Projects", keywords: ["service layer", "entities", "real project"] },
    ],
  },
  {
    id: "git",
    slug: "git-basics",
    title: "Git Basics",
    description:
      "Learn the daily Git workflow junior backend developers need for branches, reviews, fixes, and safe collaboration.",
    expectedOutcomes: [
      "Use common Git commands with confidence from the terminal.",
      "Understand how local work, remote branches, and pull requests connect.",
      "Fix everyday mistakes without losing work.",
    ],
    defaultLanguage: "bash",
    lessons: [
      { slug: "what-is-git", title: "What is Git?", keywords: ["version control", "history"] },
      { slug: "repository", title: "Repository", keywords: ["repo", "project history"] },
      { slug: "branch", title: "Branch", keywords: ["feature branch", "parallel work"] },
      { slug: "git-add", title: "add", keywords: ["staging area", "git add"] },
      { slug: "git-commit", title: "commit", keywords: ["save snapshot", "message"] },
      { slug: "git-push", title: "push", keywords: ["remote", "origin"] },
      { slug: "git-pull", title: "pull", keywords: ["sync", "merge remote"] },
      { slug: "git-fetch", title: "fetch", keywords: ["download refs", "safe sync"] },
      { slug: "git-merge", title: "merge", keywords: ["merge branch", "history"] },
      { slug: "git-revert", title: "revert", keywords: ["undo safely", "history"] },
      { slug: "git-reset", title: "reset", keywords: ["move HEAD", "reset index"] },
      { slug: "git-stash", title: "stash", keywords: ["temporary work", "stash"] },
      { slug: "git-log", title: "log", keywords: ["history", "commits"] },
      { slug: "git-diff", title: "diff", keywords: ["changes", "review"] },
      { slug: "git-tag", title: "tag", keywords: ["release tag", "versions"] },
      { slug: "pull-request", title: "Pull Request", keywords: ["pr", "review"] },
      { slug: "merge-conflict", title: "Merge Conflict", keywords: ["conflict", "resolve"] },
      { slug: "resolving-simple-merge-conflicts", title: "Resolving Simple Merge Conflicts", keywords: ["conflict resolution", "markers"] },
      { slug: "git-from-command-line", title: "Using Git from Command Line", keywords: ["terminal", "cli"] },
      { slug: "git-from-ui-tools", title: "Using Git from UI Tools", keywords: ["github desktop", "rider", "vs code"] },
    ],
  },
  {
    id: "docs",
    slug: "reading-technical-documentation",
    title: "Reading Technical Documentation",
    description:
      "Turn confusing framework docs into clear actions, notes, examples, and working experiments.",
    expectedOutcomes: [
      "Navigate docs with a repeatable reading strategy.",
      "Extract install steps and working examples quickly.",
      "Translate documentation into local experiments and notes.",
    ],
    defaultLanguage: "plaintext",
    lessons: [
      { slug: "explore-new-documentation", title: "How to Explore New Documentation", keywords: ["docs", "overview", "navigation"] },
      { slug: "identify-installation-steps", title: "How to Identify Installation Steps", keywords: ["install", "prerequisites"] },
      { slug: "find-basic-examples", title: "How to Find Basic Examples", keywords: ["examples", "quickstart"] },
      { slug: "test-a-new-backend-framework", title: "How to Test a New Backend Framework", keywords: ["experiment", "local test"] },
      { slug: "read-api-docs", title: "How to Read API Docs", keywords: ["api docs", "request", "response"] },
      { slug: "create-notes-from-documentation", title: "How to Create Notes from Documentation", keywords: ["notes", "learning loop"] },
    ],
  },
  {
    id: "api-requests",
    slug: "api-requests",
    title: "API Requests",
    description:
      "Understand HTTP communication so you can call, inspect, and debug backend APIs with confidence.",
    expectedOutcomes: [
      "Explain client-server communication using real HTTP examples.",
      "Read and build request/response messages.",
      "Use Postman, curl, and Swagger to test endpoints.",
    ],
    defaultLanguage: "json",
    lessons: [
      { slug: "client-server-communication", title: "Client-Server Communication", keywords: ["request", "response", "server"] },
      { slug: "http-methods", title: "HTTP Methods: GET, POST, PUT, PATCH, DELETE", keywords: ["get", "post", "patch", "delete"] },
      { slug: "headers", title: "Headers", keywords: ["authorization", "content-type"] },
      { slug: "body", title: "Body", keywords: ["payload", "json body"] },
      { slug: "query-parameters", title: "Query Parameters", keywords: ["query string", "filter"] },
      { slug: "route-parameters", title: "Route Parameters", keywords: ["route param", "id"] },
      { slug: "status-codes", title: "Status Codes", keywords: ["200", "404", "500"] },
      { slug: "json-request-and-response", title: "JSON Request and Response", keywords: ["json", "serialization"] },
      { slug: "postman-examples", title: "Postman Examples", keywords: ["postman", "collections"] },
      { slug: "curl-examples", title: "curl Examples", keywords: ["curl", "terminal request"] },
      { slug: "swagger-examples", title: "Swagger Examples", keywords: ["swagger", "openapi", "ui"] },
    ],
  },
  {
    id: "dtos",
    slug: "dtos-and-api-implementation",
    title: "DTOs and API Implementation",
    description:
      "Learn how clean request and response shapes protect your API and keep your backend maintainable.",
    expectedOutcomes: [
      "Explain what a DTO is and why it matters.",
      "Separate entities from API contracts.",
      "Map and validate API input safely.",
    ],
    defaultLanguage: "csharp",
    lessons: [
      { slug: "what-is-dto", title: "What is DTO?", keywords: ["dto", "contract", "shape"] },
      { slug: "why-dtos-are-used", title: "Why DTOs Are Used", keywords: ["dto benefits", "security"] },
      { slug: "request-dto", title: "Request DTO", keywords: ["request body", "input model"] },
      { slug: "response-dto", title: "Response DTO", keywords: ["response model", "api output"] },
      { slug: "entity-vs-dto", title: "Entity vs DTO", keywords: ["entity", "dto mapping"] },
      { slug: "mapping-dto-to-entity", title: "Mapping DTO to Entity", keywords: ["mapper", "conversion"] },
      { slug: "simple-api-with-dtos", title: "Simple API with DTOs", keywords: ["controller", "dto example"] },
      { slug: "validation-basics", title: "Validation Basics", keywords: ["validation", "required"] },
    ],
  },
  {
    id: "mocking",
    slug: "api-simulation-and-mocking",
    title: "API Simulation and Mocking",
    description:
      "Practice backend workflows even when the real service is missing, unstable, or not ready yet.",
    expectedOutcomes: [
      "Explain why mocking helps backend development.",
      "Create simple fake endpoints and response payloads.",
      "Test client or service behavior with predictable data.",
    ],
    defaultLanguage: "typescript",
    lessons: [
      { slug: "what-is-api-mocking", title: "What is API Mocking?", keywords: ["mock", "stub", "fake api"] },
      { slug: "why-mock-endpoints-are-useful", title: "Why Mock Endpoints Are Useful", keywords: ["frontend-backend sync", "testing"] },
      { slug: "mock-api-with-simple-node-server", title: "Mock API with Simple Node.js Server", keywords: ["node", "express", "mock server"] },
      { slug: "mock-api-with-postman", title: "Mock API with Postman", keywords: ["postman mock", "collections"] },
      { slug: "mock-response-examples", title: "Mock Response Examples", keywords: ["sample response", "payload"] },
      { slug: "testing-api-behavior-with-mock-data", title: "Testing API Behavior with Mock Data", keywords: ["mock data", "edge cases"] },
    ],
  },
  {
    id: "local-debugging",
    slug: "local-backend-service-setup-and-debugging",
    title: "Local Backend Service Setup and Debugging",
    description:
      "Run .NET services locally, wire config safely, and debug step by step without panic.",
    expectedOutcomes: [
      "Run a local backend with the right environment settings.",
      "Use breakpoints and stack traces effectively.",
      "Diagnose common local service problems.",
    ],
    defaultLanguage: "csharp",
    lessons: [
      { slug: "run-backend-service-locally", title: "How to Run Backend Service Locally", keywords: ["dotnet run", "local service"] },
      { slug: "environment-variables", title: "Environment Variables", keywords: ["env vars", "configuration"] },
      { slug: "appsettings-json", title: "appsettings.json", keywords: ["appsettings", "config file"] },
      { slug: "debugging-in-ides", title: "Debugging in Visual Studio / Rider / VS Code", keywords: ["visual studio", "rider", "vscode"] },
      { slug: "breakpoints", title: "Breakpoints", keywords: ["breakpoint", "pause"] },
      { slug: "step-over-step-into-step-out", title: "Step Over / Step Into / Step Out", keywords: ["step into", "step over"] },
      { slug: "reading-stack-traces", title: "Reading Stack Traces", keywords: ["stack trace", "exception"] },
      { slug: "fixing-simple-bugs", title: "Fixing Simple Bugs", keywords: ["bugfix", "debug"] },
      { slug: "customer-application-service-example", title: "Example: Customer Application Service", keywords: ["customer service", "application service"] },
    ],
  },
  {
    id: "framework",
    slug: "framework-basics",
    title: "Framework Basics",
    description:
      "See how a .NET backend is assembled from controllers, services, DI, config, and middleware.",
    expectedOutcomes: [
      "Understand the structure of a small .NET Web API.",
      "Describe how controllers, services, and DI work together.",
      "Trace a request through the framework pipeline.",
    ],
    defaultLanguage: "csharp",
    lessons: [
      { slug: "console-application-basics", title: "Console Application Basics", keywords: ["console app", "program cs"] },
      { slug: "web-api-basics", title: "Web API Basics", keywords: ["web api", "http endpoint"] },
      { slug: "controllers", title: "Controllers", keywords: ["controller", "action"] },
      { slug: "services", title: "Services", keywords: ["service class", "business logic"] },
      { slug: "dependency-injection", title: "Dependency Injection", keywords: ["di", "injection"] },
      { slug: "configuration", title: "Configuration", keywords: ["configuration", "options"] },
      { slug: "middleware-basics", title: "Middleware Basics", keywords: ["middleware", "pipeline"] },
      { slug: "simple-dotnet-web-api-example", title: "Simple .NET Web API Example", keywords: ["api example", "minimal api"] },
    ],
  },
  {
    id: "database",
    slug: "database-basics",
    title: "Database Basics",
    description:
      "Connect the language of relational databases to the code you write in services, repositories, and EF Core.",
    expectedOutcomes: [
      "Understand core relational database concepts.",
      "Read and write beginner SQL queries.",
      "Explain how EF Core and repositories work with your database.",
    ],
    defaultLanguage: "sql",
    lessons: [
      { slug: "entity", title: "Entity", keywords: ["entity", "domain record"] },
      { slug: "table", title: "Table", keywords: ["table", "rows"] },
      { slug: "primary-key", title: "Primary Key", keywords: ["pk", "identifier"] },
      { slug: "foreign-key", title: "Foreign Key", keywords: ["fk", "relationship"] },
      { slug: "simple-sql-queries", title: "Simple SQL Queries", keywords: ["select", "where", "sql"] },
      { slug: "insert", title: "Insert", keywords: ["insert into", "create row"] },
      { slug: "update", title: "Update", keywords: ["update table", "modify row"] },
      { slug: "delete", title: "Delete", keywords: ["delete from", "remove row"] },
      { slug: "select", title: "Select", keywords: ["select", "read data"] },
      { slug: "ef-core-basics", title: "EF Core Basics", keywords: ["ef core", "orm"] },
      { slug: "dbcontext", title: "DbContext", keywords: ["dbcontext", "unit of work"] },
      { slug: "migrations", title: "Migrations", keywords: ["migration", "schema"] },
      { slug: "repository-pattern-with-database", title: "Repository Pattern with Database", keywords: ["repository", "database"] },
    ],
  },
  {
    id: "patterns",
    slug: "design-patterns-and-principles",
    title: "Design Patterns and Principles",
    description:
      "Use simple patterns and maintainability rules to keep backend code readable as it grows.",
    expectedOutcomes: [
      "Recognize common patterns used in backend services.",
      "Apply separation of concerns to avoid tangled code.",
      "Explain why maintainability matters to a team.",
    ],
    defaultLanguage: "csharp",
    lessons: [
      { slug: "why-code-organization-matters", title: "Why Code Organization Matters", keywords: ["organization", "maintainability"] },
      { slug: "singleton-pattern", title: "Singleton Pattern", keywords: ["singleton", "lifetime"] },
      { slug: "repository-pattern", title: "Repository Pattern", keywords: ["repository", "data access"] },
      { slug: "dependency-injection-pattern", title: "Dependency Injection", keywords: ["dependency injection", "composition root"] },
      { slug: "separation-of-concerns", title: "Separation of Concerns", keywords: ["soc", "responsibility"] },
      { slug: "clean-code-basics", title: "Clean Code Basics", keywords: ["clean code", "readability"] },
      { slug: "maintainable-code-examples", title: "Maintainable Code Examples", keywords: ["refactor", "readable code"] },
    ],
  },
  {
    id: "rest",
    slug: "restful-services",
    title: "RESTful Services",
    description:
      "Learn the conventions that make APIs predictable for frontend developers, testers, and other services.",
    expectedOutcomes: [
      "Describe what makes an API RESTful.",
      "Design cleaner endpoints and validation flows.",
      "Test REST APIs using familiar backend tools.",
    ],
    defaultLanguage: "json",
    lessons: [
      { slug: "what-is-rest", title: "What is REST?", keywords: ["rest", "resources"] },
      { slug: "resource-naming", title: "Resource Naming", keywords: ["resource names", "plural nouns"] },
      { slug: "api-endpoints", title: "API Endpoints", keywords: ["endpoint", "route"] },
      { slug: "rest-status-codes", title: "Status Codes", keywords: ["status code", "api response"] },
      { slug: "request-validation", title: "Request Validation", keywords: ["validation", "bad request"] },
      { slug: "error-response-format", title: "Error Response Format", keywords: ["problem details", "error body"] },
      { slug: "consuming-rest-api", title: "Consuming REST API", keywords: ["client", "api consumer"] },
      { slug: "testing-rest-api-postman-swagger", title: "Testing REST API Using Postman and Swagger", keywords: ["postman", "swagger", "rest testing"] },
    ],
  },
  {
    id: "testing",
    slug: "unit-testing",
    title: "Unit Testing",
    description:
      "Learn how to prove business logic works before bugs reach code review, QA, or production.",
    expectedOutcomes: [
      "Explain the goal of unit testing in simple terms.",
      "Write basic Arrange-Act-Assert tests in .NET tools.",
      "Mock dependencies only when it helps isolate behavior.",
    ],
    defaultLanguage: "csharp",
    lessons: [
      { slug: "what-is-unit-testing", title: "What is Unit Testing?", keywords: ["unit test", "automated tests"] },
      { slug: "why-unit-tests-are-important", title: "Why Unit Tests Are Important", keywords: ["confidence", "regression"] },
      { slug: "arrange-act-assert", title: "Arrange, Act, Assert", keywords: ["aaa", "test structure"] },
      { slug: "xunit-basics", title: "xUnit Basics", keywords: ["xunit", "fact"] },
      { slug: "nunit-basics", title: "NUnit Basics", keywords: ["nunit", "test"] },
      { slug: "mstest-basics", title: "MSTest Basics", keywords: ["mstest", "visual studio"] },
      { slug: "testing-services", title: "Testing Services", keywords: ["service tests", "business logic"] },
      { slug: "testing-simple-business-logic", title: "Testing Simple Business Logic", keywords: ["rules", "validation"] },
      { slug: "mocking-dependencies-basics", title: "Mocking Dependencies Basics", keywords: ["mock", "dependency"] },
    ],
  },
  {
    id: "deployment",
    slug: "deployment-basics",
    title: "Deployment Basics",
    description:
      "Understand how code moves from your machine to a shared environment in a safe, repeatable way.",
    expectedOutcomes: [
      "Explain staging, builds, and deployment checklists.",
      "Understand environment-specific configuration.",
      "Avoid common release mistakes as a junior developer.",
    ],
    defaultLanguage: "yaml",
    lessons: [
      { slug: "what-is-staging-environment", title: "What is Staging Environment?", keywords: ["staging", "pre-production"] },
      { slug: "build-process", title: "Build Process", keywords: ["build", "pipeline"] },
      { slug: "environment-configuration", title: "Environment Configuration", keywords: ["environment", "config"] },
      { slug: "deployment-checklist", title: "Deployment Checklist", keywords: ["checklist", "release"] },
      { slug: "reading-deployment-documentation", title: "Reading Deployment Documentation", keywords: ["deployment docs", "release notes"] },
      { slug: "simple-deployment-flow", title: "Simple Deployment Flow", keywords: ["deploy flow", "pipeline"] },
      { slug: "common-deployment-mistakes", title: "Common Deployment Mistakes", keywords: ["deploy bugs", "rollback"] },
    ],
  },
  {
    id: "best-practices",
    slug: "backend-best-practices",
    title: "Backend Best Practices",
    description:
      "Adopt habits that keep your backend easier to debug, extend, and explain to teammates.",
    expectedOutcomes: [
      "Apply naming, validation, logging, and organization patterns consistently.",
      "Write service methods that are easier to read and test.",
      "Recognize beginner mistakes before they grow.",
    ],
    defaultLanguage: "csharp",
    lessons: [
      { slug: "code-organization", title: "Code Organization", keywords: ["folders", "layers"] },
      { slug: "error-handling", title: "Error Handling", keywords: ["exceptions", "problem details"] },
      { slug: "logging", title: "Logging", keywords: ["logs", "structured logging"] },
      { slug: "validation", title: "Validation", keywords: ["validation", "guards"] },
      { slug: "configuration-best-practices", title: "Configuration", keywords: ["config", "options"] },
      { slug: "naming-conventions", title: "Naming Conventions", keywords: ["naming", "readability"] },
      { slug: "folder-structure", title: "Folder Structure", keywords: ["structure", "project organization"] },
      { slug: "clean-service-methods", title: "Clean Service Methods", keywords: ["service methods", "clean code"] },
    ],
  },
  {
    id: "troubleshooting",
    slug: "troubleshooting",
    title: "Troubleshooting",
    description:
      "Build the mindset to investigate problems calmly, read signals correctly, and fix one thing at a time.",
    expectedOutcomes: [
      "Read error output and stack traces with more confidence.",
      "Search effectively and isolate the real cause of problems.",
      "Use a repeatable debugging flow under pressure.",
    ],
    defaultLanguage: "plaintext",
    lessons: [
      { slug: "reading-error-messages", title: "Reading Error Messages", keywords: ["errors", "messages"] },
      { slug: "reading-logs", title: "Reading Logs", keywords: ["logs", "tracing"] },
      { slug: "understanding-stack-traces", title: "Understanding Stack Traces", keywords: ["stack trace", "call stack"] },
      { slug: "common-development-errors", title: "Common Development Errors", keywords: ["common bugs", "mistakes"] },
      { slug: "debug-step-by-step", title: "How to Debug Step by Step", keywords: ["debug process", "isolation"] },
      { slug: "search-errors-correctly", title: "How to Search Errors Correctly", keywords: ["search", "google", "docs"] },
      { slug: "fix-simple-environment-issues", title: "How to Fix Simple Environment Issues", keywords: ["environment", "setup"] },
    ],
  },
];
