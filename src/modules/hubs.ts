export const gitCommandCards = [
  {
    command: "git status",
    explanation: "Shows what changed, what is staged, and which branch you are on.",
    example: "git status",
    whenToUse: "Before commit, before pull, and anytime the repo feels confusing.",
    mistakes: "Assuming files are committed just because you edited them.",
  },
  {
    command: "git add",
    explanation: "Moves selected changes into the staging area for the next commit.",
    example: "git add src/CustomerService.cs",
    whenToUse: "After reviewing the exact files you want in the next commit.",
    mistakes: "Using `git add .` without checking for accidental files.",
  },
  {
    command: "git commit",
    explanation: "Saves a named snapshot in local history.",
    example: "git commit -m \"Add DTO validation for customer create endpoint\"",
    whenToUse: "After a small, coherent change is finished and reviewed locally.",
    mistakes: "Writing vague messages like `fix stuff`.",
  },
  {
    command: "git pull --rebase",
    explanation: "Brings remote changes on top of your local work with a linear history.",
    example: "git pull --rebase origin main",
    whenToUse: "Before opening a PR or when your branch is behind.",
    mistakes: "Pulling blindly while you still have uncommitted changes.",
  },
  {
    command: "git stash",
    explanation: "Temporarily stores local changes when you need to switch tasks quickly.",
    example: "git stash push -m \"WIP: customer search filters\"",
    whenToUse: "When you must change branches without losing unfinished work.",
    mistakes: "Forgetting what is inside the stash or leaving stashes forever.",
  },
  {
    command: "git diff",
    explanation: "Shows the exact line-by-line changes before you commit or review.",
    example: "git diff --staged",
    whenToUse: "Before commit, before PR review, and while debugging regressions.",
    mistakes: "Skipping the diff and committing accidental formatting or debug code.",
  },
];

export const apiHubSections = [
  {
    title: "REST API basics",
    body: "A REST API exposes resources through clear URLs, consistent HTTP methods, predictable status codes, and JSON contracts that frontend or mobile clients can trust.",
  },
  {
    title: "Request / response structure",
    body: "A backend request usually includes the method, path, headers, route values, query parameters, and sometimes a JSON body. The response returns a status code plus either data or an error shape.",
  },
  {
    title: "Postman examples",
    body: "Use Postman collections to save common requests, environment variables, auth tokens, and regression checks for the endpoints you use every day.",
  },
  {
    title: "curl examples",
    body: "curl is perfect when you want to reproduce an HTTP request from the terminal, share it in chat, or document the exact request in a runbook.",
  },
  {
    title: "Swagger examples",
    body: "Swagger UI is useful for discovering endpoints, reading DTO contracts, and making quick manual test calls without writing extra client code.",
  },
];

export const databaseHubSections = [
  {
    title: "Entity basics",
    body: "An entity represents one meaningful record in your backend domain such as a customer, order, product, invoice, or support ticket.",
  },
  {
    title: "Simple SQL queries",
    body: "Start with `SELECT`, `WHERE`, `ORDER BY`, `INSERT`, `UPDATE`, and `DELETE`. Junior backend developers should be able to read these before relying on an ORM.",
  },
  {
    title: "EF Core migrations",
    body: "Migrations keep the database schema versioned beside the code so the team can evolve tables safely over time.",
  },
  {
    title: "Repository pattern",
    body: "A repository can hide data access details from service logic, but it should stay focused and not become a giant second ORM.",
  },
  {
    title: "DTO usage",
    body: "DTOs are a protection layer between tables/entities and external API contracts so you do not accidentally leak internal fields.",
  },
];

export const debuggingHubSections = [
  {
    title: "Reading error messages",
    body: "Start with the first meaningful line, not the loudest line. Read the exception type, message, and where the failure began.",
  },
  {
    title: "Reading logs",
    body: "Structured logs help you follow request IDs, user IDs, and decision points without re-running the code immediately.",
  },
  {
    title: "Debugging local backend service",
    body: "Reproduce, set a breakpoint near the suspicious branch, inspect inputs, and confirm where the state stops matching your expectation.",
  },
  {
    title: "Common .NET backend errors",
    body: "Null reference exceptions, bad configuration values, DI resolution errors, failed EF Core queries, and validation mismatches are great beginner debugging exercises.",
  },
];
