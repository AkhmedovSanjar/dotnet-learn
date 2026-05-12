import type { ModuleContent } from "./types";

export const frameworkContent: ModuleContent = {
  "console-application-basics": {
    whyItMatters:
      "Every .NET service starts as a `Main` method. Understanding the console entry point demystifies how the framework actually starts.",
    simpleExplanation:
      "A console app has a single entry point — `Main` (or top-level statements). It runs to completion and exits with a status code.",
    deepExplanation:
      "Modern .NET supports top-level statements: `Program.cs` can be a few lines without an explicit `Main`. Under the hood the compiler still generates a `Main` method. Use `args` for command-line input, `Environment.Exit` (or returning an int) for the exit code, and `Console.WriteLine` for output. Async `Main` lets you await tasks directly at the entry point.",
    realWorldUsage:
      "A small CLI tool that processes a CSV file: `dotnet run -- input.csv` invokes `Main(string[] args)` with the file path, the tool processes the file, and exits 0 on success or 1 on failure.",
    explainLikeBeginner:
      "A console app is a program that runs once: starts, does its thing, prints to the terminal, and stops.",
    interviewAnswer:
      "A console application starts at `Main` (or a top-level statements file), processes inputs via `args`, prints to `Console`, and returns an exit code. It is the simplest .NET program shape and the foundation for both CLI tools and long-running services.",
    commonMistakes: [
      "Forgetting to return a non-zero exit code on failure, breaking shell pipelines.",
      "Reading `args[0]` without checking length and crashing on missing arguments.",
      "Mixing console output with structured logging in production CLI tools.",
    ],
    bestPractices: [
      "Use `System.CommandLine` or `CommandLineParser` for non-trivial CLI tools.",
      "Return clear exit codes: 0 success, non-zero failure with a message.",
      "Honour cancellation tokens for long-running CLI work.",
    ],
    summary: [
      "Console apps start at `Main`.",
      "Top-level statements modernise the shape.",
      "Exit codes are the contract with the shell.",
    ],
    codeExample: {
      title: "Top-level statements",
      code: `// Program.cs
if (args.Length < 1)
{
    Console.Error.WriteLine("Usage: tool <path>");
    return 1;
}

var path = args[0];
Console.WriteLine($"Processing {path}...");
return 0;`,
      output: `> dotnet run -- input.csv
Processing input.csv...
(exit code 0)`,
      walkthrough: [
        "Top-level statements compile to a generated `Main`.",
        "Returning an integer sets the process exit code.",
        "`Console.Error` keeps usage/errors on stderr, separate from stdout.",
      ],
    },
    practice: {
      prompt:
        "Build a CLI that reads a file path from `args`, counts the lines, and prints the result. Exit non-zero if the file is missing.",
      expectedResult:
        "`dotnet run -- file.txt` prints the count; `dotnet run -- missing.txt` exits 1 with an error.",
      hints: [
        "Use `File.Exists` before reading.",
        "Use `File.ReadLines` for memory efficiency.",
        "Write the error to `Console.Error`.",
      ],
      solution:
        "A tiny CLI that respects shell conventions — stdout for data, stderr for errors, exit codes for status.",
    },
    quiz: [
      {
        kind: "concept",
        question: "What does returning a non-zero exit code from `Main` communicate?",
        options: [
          "Nothing.",
          "Failure — shell scripts and CI systems read the exit code to decide what to do next.",
          "Memory usage.",
          "The build mode.",
        ],
        correctAnswer:
          "Failure — shell scripts and CI systems read the exit code to decide what to do next.",
        explanation: "0 = success, non-zero = something went wrong. It is the universal Unix-style contract.",
      },
      {
        kind: "code-reading",
        question:
          "Why does the example use `Console.Error.WriteLine` instead of `Console.WriteLine` for the usage message?",
        options: [
          "Style.",
          "It sends the message to stderr, keeping stdout clean for data so shell pipelines work correctly.",
          "It is faster.",
          "Stderr is the only option for errors in C#.",
        ],
        correctAnswer:
          "It sends the message to stderr, keeping stdout clean for data so shell pipelines work correctly.",
        explanation: "Separating streams is what makes Unix-style composition possible.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is wrong?\n```csharp\nvar path = args[0];\n// crashes if args is empty\n```",
        options: [
          "Nothing.",
          "Reading `args[0]` without checking `args.Length` throws `IndexOutOfRangeException` when no argument is supplied.",
          "`args` is read-only.",
          "Variables cannot be assigned from `args`.",
        ],
        correctAnswer:
          "Reading `args[0]` without checking `args.Length` throws `IndexOutOfRangeException` when no argument is supplied.",
        explanation: "Guard against missing input and surface a clear usage message.",
      },
      {
        kind: "interview",
        question: "When would you reach for `System.CommandLine` instead of parsing `args` by hand?",
        options: [
          "Never — manual parsing is preferred.",
          "When the CLI has more than a couple of flags or sub-commands; the library handles parsing, help text, validation, and tab-completion uniformly.",
          "Always.",
          "Only for GUI apps.",
        ],
        correctAnswer:
          "When the CLI has more than a couple of flags or sub-commands; the library handles parsing, help text, validation, and tab-completion uniformly.",
        explanation: "Beyond a single positional arg, libraries save real work.",
      },
    ],
  },

  "web-api-basics": {
    whyItMatters:
      "Web APIs are the most common .NET service shape. Knowing what 'WebApplication' wires up and where the seams are is what lets you debug routing or DI issues.",
    simpleExplanation:
      "A .NET Web API exposes HTTP endpoints. `WebApplication.CreateBuilder` produces a builder; you add services and middleware, then `Run()`.",
    deepExplanation:
      "The minimal hosting model in .NET 6+ collapses startup into `Program.cs`. The builder configures DI, configuration, and logging; the `app` configures middleware and endpoints. `MapControllers` wires up `[ApiController]` classes; `MapGet` registers minimal-API endpoints. Both can coexist. Middleware order matters: auth before authorization before endpoints.",
    realWorldUsage:
      "A `/orders` resource served by an `OrdersController`, fronted by routing, authentication, and exception-handling middleware.",
    explainLikeBeginner:
      "A web API is a program that waits for HTTP requests and answers them. Inside, it is the same C# you write anywhere — just hooked up to the network.",
    interviewAnswer:
      "A .NET Web API is built around `WebApplication`. The builder configures services (DI, options, logging); the application configures middleware and routes endpoints. Controllers handle conventional MVC-style routing; minimal APIs offer concise endpoint definitions for small services.",
    commonMistakes: [
      "Calling `app.UseRouting` after `app.UseEndpoints` (legacy) or forgetting to register controllers entirely.",
      "Mixing `app.UseAuthentication` after `MapControllers` — auth has no chance to run.",
      "Treating `Program.cs` like a dumping ground for business logic.",
    ],
    bestPractices: [
      "Group service registration into extension methods (`AddInfrastructure`, `AddDomain`).",
      "Keep middleware order explicit and minimal.",
      "Prefer `Microsoft.AspNetCore.OpenApi` for OpenAPI generation.",
    ],
    summary: [
      "Builder configures DI; application configures middleware and endpoints.",
      "Middleware order matters.",
      "Group registration into extension methods as the project grows.",
    ],
    codeExample: {
      title: "Minimal Program.cs",
      code: `var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddScoped<IOrderRepository, EfOrderRepository>();

var app = builder.Build();

app.UseExceptionHandler("/error");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapOpenApi();

app.Run();`,
      output: "Listening on http://localhost:5000 (and 5001 for HTTPS)",
      walkthrough: [
        "Services registered before `Build()`.",
        "Middleware ordered deliberately: errors → auth → endpoints.",
        "`MapControllers` wires up every `[ApiController]` in the assembly.",
      ],
    },
    practice: {
      prompt:
        "Bootstrap a Web API with one `/health` minimal-API endpoint and one `WeatherController` with a `[HttpGet]` action. Confirm both routes via curl.",
      expectedResult:
        "Two endpoints, two routing styles, both reachable.",
      hints: [
        "Use `app.MapGet(\"/health\", () => \"OK\");`.",
        "Add the controller class with `[ApiController, Route(\"weather\")]`.",
        "Test both with curl.",
      ],
      solution:
        "Minimal APIs and controllers coexist. The build-and-run loop is your daily routine.",
    },
    quiz: [
      {
        kind: "concept",
        question:
          "Which order is correct in `Program.cs` for a typical Web API?",
        options: [
          "MapControllers → UseAuthentication → UseAuthorization.",
          "UseAuthentication → UseAuthorization → MapControllers.",
          "Order does not matter.",
          "UseAuthorization → UseAuthentication → MapControllers.",
        ],
        correctAnswer:
          "UseAuthentication → UseAuthorization → MapControllers.",
        explanation: "Authentication identifies; authorisation decides; the endpoint runs last.",
      },
      {
        kind: "code-reading",
        question:
          "What does `builder.Services.AddScoped<IOrderRepository, EfOrderRepository>()` configure?",
        options: [
          "A singleton instance of the repository.",
          "A new repository instance per HTTP request, resolved when `IOrderRepository` is requested.",
          "A transient instance per call.",
          "Nothing — it is illegal.",
        ],
        correctAnswer:
          "A new repository instance per HTTP request, resolved when `IOrderRepository` is requested.",
        explanation: "Scoped is the right lifetime for repositories that own per-request state.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is wrong?\n```csharp\napp.MapControllers();\napp.UseAuthentication();\n```",
        options: [
          "Nothing.",
          "Authentication middleware is added after the endpoints are mapped, so it never runs for those requests.",
          "`MapControllers` is illegal.",
          "Authentication must be in the builder.",
        ],
        correctAnswer:
          "Authentication middleware is added after the endpoints are mapped, so it never runs for those requests.",
        explanation: "Middleware order is the contract; auth must precede endpoints.",
      },
      {
        kind: "interview",
        question:
          "Why split service registration into `AddInfrastructure`, `AddDomain` extension methods?",
        options: [
          "It is required.",
          "It keeps `Program.cs` readable, groups related registrations together, and lets a feature module ship its own composition logic.",
          "It is faster.",
          "There is no reason.",
        ],
        correctAnswer:
          "It keeps `Program.cs` readable, groups related registrations together, and lets a feature module ship its own composition logic.",
        explanation: "Composition-root hygiene becomes important quickly.",
      },
    ],
  },

  controllers: {
    whyItMatters:
      "Controllers are the front door to your API. Patterns you set here — routing, model binding, response shape — apply to every endpoint.",
    simpleExplanation:
      "A controller is a C# class with action methods. Each action handles one HTTP route + method combination.",
    deepExplanation:
      "Mark the class `[ApiController, Route(\"resource\")]`. Each action is `[HttpGet]`/`[HttpPost]`/etc. Action parameters bind from route, query, header, body, form, or services. `IActionResult` (or `ActionResult<T>`) lets you return any status code with a body. Keep controllers thin: parse the request, call the service, translate the result.",
    realWorldUsage:
      "`OrdersController` exposes `GET /orders/{id}`, `POST /orders`, `DELETE /orders/{id}`. Each action is 2-5 lines.",
    explainLikeBeginner:
      "A controller is the menu at a restaurant. Each item on the menu is an action. You point at one, the kitchen (service) does the work.",
    interviewAnswer:
      "Controllers are HTTP adapters. Each action binds the request, calls a service, and translates the result into an HTTP response. We keep them thin so the rules live in services and the HTTP layer is purely a translation step.",
    commonMistakes: [
      "Putting business logic in action methods.",
      "Returning entities instead of DTOs.",
      "Forgetting `[ApiController]` and losing automatic ModelState validation.",
    ],
    bestPractices: [
      "One controller per resource.",
      "Use `ActionResult<T>` for typed responses.",
      "Centralise mapping; controllers only translate.",
    ],
    summary: [
      "Controllers are thin HTTP adapters.",
      "`[ApiController]` enables automatic validation.",
      "Push logic into services.",
    ],
    codeExample: {
      title: "Thin controller",
      code: `[ApiController, Route("orders")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orders;
    public OrdersController(IOrderService orders) => _orders = orders;

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<OrderResponse>> Get(Guid id)
    {
        var order = await _orders.GetAsync(id);
        return order is null ? NotFound() : Ok(order);
    }

    [HttpPost]
    public async Task<ActionResult<OrderResponse>> Create(CreateOrderRequest req)
    {
        var created = await _orders.CreateAsync(req);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }
}`,
      output: "GET 200/404 • POST 201 with Location header • automatic 400 on bad payload.",
      walkthrough: [
        "Each action is a small adapter, not a logic dumping ground.",
        "Route constraint `{id:guid}` rejects malformed ids at routing time.",
        "`CreatedAtAction` builds the canonical 201 + Location response.",
      ],
    },
    practice: {
      prompt:
        "Build a `CustomersController` with all five CRUD actions. Verify each via curl and confirm the status codes match REST conventions.",
      expectedResult: "Predictable status codes, DTOs at the boundary, services do the work.",
      hints: [
        "Use `IActionResult` for delete (`NoContent`).",
        "Use `ActionResult<T>` for typed reads.",
        "Test the happy and unhappy paths.",
      ],
      solution:
        "Five-action controller, three layers, one set of conventions. Replicating this shape across resources is the daily routine.",
    },
    quiz: [
      {
        kind: "concept",
        question:
          "What does `[ApiController]` add beyond plain `ControllerBase`?",
        options: [
          "Nothing.",
          "Automatic ModelState validation (400 + ProblemDetails on invalid input), `[FromBody]` inference, and structured error responses by default.",
          "Faster routing.",
          "Database access.",
        ],
        correctAnswer:
          "Automatic ModelState validation (400 + ProblemDetails on invalid input), `[FromBody]` inference, and structured error responses by default.",
        explanation: "`[ApiController]` is a convenience that bakes in best-practice behaviour for HTTP APIs.",
      },
      {
        kind: "code-reading",
        question:
          "What does `Ok(order)` return when `order` is `null` (in the example)?",
        options: [
          "200 OK with `null` body.",
          "404 Not Found — the example never reaches `Ok(order)` if `order` is null; the ternary returns `NotFound()`.",
          "500 Internal Server Error.",
          "Nothing.",
        ],
        correctAnswer:
          "404 Not Found — the example never reaches `Ok(order)` if `order` is null; the ternary returns `NotFound()`.",
        explanation: "Read the control flow, not just the helper name.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is wrong?\n```csharp\n[HttpGet]\npublic async Task<IActionResult> List([FromBody] ListQuery q) => Ok(await _service.ListAsync(q));\n```",
        options: [
          "Nothing.",
          "GET requests typically have no body; binding from body for a GET is unusual and many clients/proxies strip the payload.",
          "`IActionResult` cannot be used here.",
          "`async` is illegal.",
        ],
        correctAnswer:
          "GET requests typically have no body; binding from body for a GET is unusual and many clients/proxies strip the payload.",
        explanation: "Use `[FromQuery]` for GET filters; bodies belong to POST/PUT/PATCH.",
      },
      {
        kind: "interview",
        question:
          "Why is a thin controller a good default?",
        options: [
          "Performance.",
          "Because it keeps HTTP concerns separate from business rules — services are testable in isolation, and routing-time changes do not require reasoning about logic.",
          "It is required.",
          "There is no reason.",
        ],
        correctAnswer:
          "Because it keeps HTTP concerns separate from business rules — services are testable in isolation, and routing-time changes do not require reasoning about logic.",
        explanation: "Layering pays off the first time you write a unit test for a service.",
      },
    ],
  },

  services: {
    whyItMatters:
      "Services hold the business rules. Done well, they make controllers thin and tests fast. Done poorly, every controller becomes a god class.",
    simpleExplanation:
      "A service is a C# class that contains business logic and is injected into controllers via DI.",
    deepExplanation:
      "Service methods describe operations in domain language (`ConfirmOrderAsync`, `IssueRefundAsync`), not CRUD primitives. They orchestrate: load via a repository, mutate an entity, save, possibly publish an event. Keep them stateless beyond their injected dependencies; lifetime is usually scoped per request.",
    realWorldUsage:
      "`OrderService` exposes `ConfirmAsync(id)`. Internally it loads, calls `order.Confirm()`, saves, and emits an `OrderConfirmed` event.",
    explainLikeBeginner:
      "A service is the worker who actually does the task. The controller hands them the request; they do the work; they hand back a result.",
    interviewAnswer:
      "A service holds business rules and orchestrates entities, repositories, and events. It is the seam where the domain meets infrastructure. Services are usually scoped per request, depend on abstractions, and expose methods named after operations.",
    commonMistakes: [
      "Returning `IQueryable` from services — leaks ORM through the abstraction.",
      "Letting services depend on `HttpContext` — couples them to the web layer.",
      "Spreading the same orchestration across many services — duplication that drifts.",
    ],
    bestPractices: [
      "Name methods after operations, not CRUD shapes.",
      "Depend only on abstractions in constructors.",
      "Keep services focused; split when they grow beyond one cohesive responsibility.",
    ],
    summary: [
      "Services are the home of business rules.",
      "They orchestrate entities and infrastructure.",
      "They never depend on HTTP types.",
    ],
    codeExample: {
      title: "OrderService.ConfirmAsync",
      code: `public interface IOrderService
{
    Task<OrderResponse> GetAsync(Guid id);
    Task ConfirmAsync(Guid id);
}

public sealed class OrderService(IOrderRepository repo, IEventPublisher events) : IOrderService
{
    public async Task<OrderResponse> GetAsync(Guid id) =>
        (await repo.FindAsync(id) ?? throw new NotFoundException("Order", id.ToString()))
            .ToResponse();

    public async Task ConfirmAsync(Guid id)
    {
        var order = await repo.FindAsync(id) ?? throw new NotFoundException("Order", id.ToString());
        order.Confirm();
        await repo.SaveAsync(order);
        await events.PublishAsync(new OrderConfirmed(order.Id));
    }
}`,
      output: "Service orchestrates load → mutate → save → publish, all in one method.",
      walkthrough: [
        "Methods named after operations, not CRUD.",
        "Dependencies are abstractions injected via constructor.",
        "Events let other parts of the system react without coupling.",
      ],
    },
    practice: {
      prompt:
        "Refactor a controller that contains business logic into a thin controller + a service. Move every `if` and rule into the service; controller becomes 3-5 lines per action.",
      expectedResult: "Controller shrinks; service can be unit-tested without the framework.",
      hints: [
        "Start by writing a unit test for the new service.",
        "Inject the service via constructor.",
        "Use exceptions or result types to communicate failure.",
      ],
      solution:
        "After the refactor, services own the rules and are independently testable; controllers translate HTTP. The pattern scales.",
    },
    quiz: [
      {
        kind: "concept",
        question:
          "Which is a domain-shaped service method name?",
        options: [
          "`UpdateOrder(Order o)`",
          "`ConfirmAsync(Guid orderId)`",
          "`DoStuff()`",
          "`Save(object x)`",
        ],
        correctAnswer: "`ConfirmAsync(Guid orderId)`",
        explanation: "Names that describe the operation in domain language are stable as the implementation changes.",
      },
      {
        kind: "code-reading",
        question:
          "Why does `OrderService` depend on `IOrderRepository` instead of `AppDbContext` directly?",
        options: [
          "EF Core forbids it.",
          "Depending on the abstraction lets the service be unit-tested with an in-memory implementation, and shields it from ORM choices.",
          "Performance.",
          "It is shorter to type.",
        ],
        correctAnswer:
          "Depending on the abstraction lets the service be unit-tested with an in-memory implementation, and shields it from ORM choices.",
        explanation: "Two implementations of one interface unlock fast tests.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is wrong?\n```csharp\npublic class OrderService { public OrderService(HttpContext ctx) { ... } }\n```",
        options: [
          "Nothing.",
          "Depending on `HttpContext` couples a service to the web layer; it cannot be unit-tested without faking ASP.NET Core.",
          "`HttpContext` is not real.",
          "Services must not have constructors.",
        ],
        correctAnswer:
          "Depending on `HttpContext` couples a service to the web layer; it cannot be unit-tested without faking ASP.NET Core.",
        explanation: "Pass the data you need explicitly via parameters or DTOs.",
      },
      {
        kind: "interview",
        question:
          "How do you keep a service focused as it grows?",
        options: [
          "Add more methods.",
          "Split it along cohesive responsibilities: when one service has two unrelated reasons to change, those are two services.",
          "Never split.",
          "Move logic to controllers.",
        ],
        correctAnswer:
          "Split it along cohesive responsibilities: when one service has two unrelated reasons to change, those are two services.",
        explanation: "Single Responsibility Principle in everyday clothing.",
      },
    ],
  },

  "dependency-injection": {
    whyItMatters:
      "DI is how every .NET service gets the components it needs. Without understanding it, lifetimes and registration become magic.",
    simpleExplanation:
      "Dependency Injection means the framework constructs your classes and supplies their dependencies via constructor parameters.",
    deepExplanation:
      "Three lifetimes: `Singleton` (one for the whole app), `Scoped` (one per request), `Transient` (one per resolution). Register in `Program.cs` via `builder.Services.Add{Lifetime}<TInterface, TImpl>()`. Lifetime mismatches (a singleton depending on a scoped service) are the most common bug — the singleton captures one scoped instance forever.",
    realWorldUsage:
      "`OrderService` depends on `IOrderRepository`; `Program.cs` registers `AddScoped<IOrderRepository, EfOrderRepository>()`; the controller injects `IOrderService` and the container hands back a fully-constructed instance.",
    explainLikeBeginner:
      "DI is asking 'give me a tool' instead of building the tool yourself. The toolbox (container) hands it to you assembled.",
    interviewAnswer:
      "Dependency Injection is the pattern of supplying a class's collaborators through its constructor instead of constructing them inside. In .NET, the built-in DI container resolves them based on registered lifetimes — singleton, scoped, transient — at the composition root.",
    commonMistakes: [
      "Capturing a scoped service inside a singleton (lifetime mismatch).",
      "Forgetting to register a service and seeing `Unable to resolve service for type X`.",
      "Newing up dependencies inside a class, defeating the point of DI.",
    ],
    bestPractices: [
      "Register dependencies in extension methods that live with the feature.",
      "Use `AddScoped` as the default for repositories and services.",
      "Use `IOptions<T>` for configuration instead of injecting `IConfiguration` widely.",
    ],
    summary: [
      "DI supplies collaborators via constructor.",
      "Three lifetimes: singleton, scoped, transient.",
      "Lifetime mismatch is the classic bug.",
    ],
    codeExample: {
      title: "Three lifetimes",
      code: `// Program.cs
builder.Services.AddSingleton<IClock, SystemClock>();          // shared everywhere
builder.Services.AddScoped<IOrderRepository, EfOrderRepository>(); // per request
builder.Services.AddTransient<IEmailFormatter, EmailFormatter>(); // per call

// usage
public class OrderService(IOrderRepository repo, IClock clock, IEmailFormatter fmt)
{
    // ...
}`,
      output: "Lifetimes resolved per the registration; constructor injection wires everything.",
      walkthrough: [
        "`Singleton` for stateless services with no per-request data.",
        "`Scoped` for things that hold a DbContext or per-request state.",
        "`Transient` when a fresh instance is cheap and convenient.",
      ],
    },
    practice: {
      prompt:
        "Register `IClock`, `IOrderRepository`, `IOrderService` in `Program.cs` with appropriate lifetimes. Inject them into a controller and prove via a test that the registration works.",
      expectedResult:
        "All dependencies resolve correctly; lifetime choices are deliberate.",
      hints: [
        "Use `AddSingleton` for stateless utilities.",
        "Use `AddScoped` for anything that touches a DbContext.",
        "Test resolution with `services.BuildServiceProvider().GetRequiredService<...>()`.",
      ],
      solution:
        "After registration, the container can hand any consumer a fully-wired graph. That is the value DI delivers.",
    },
    quiz: [
      {
        kind: "concept",
        question:
          "Which lifetime fits a service that holds a `DbContext`?",
        options: ["Singleton", "Scoped", "Transient", "It does not matter"],
        correctAnswer: "Scoped",
        explanation: "`DbContext` is scoped per request; services that depend on it must match.",
      },
      {
        kind: "code-reading",
        question:
          "Why does `OrderService(IOrderRepository, IClock, IEmailFormatter)` work in the example?",
        options: [
          "Magic.",
          "Each dependency is registered with the container; the framework resolves them by type when constructing `OrderService`.",
          "C# auto-injects all classes.",
          "The constructor has special syntax.",
        ],
        correctAnswer:
          "Each dependency is registered with the container; the framework resolves them by type when constructing `OrderService`.",
        explanation: "Constructor injection is the DI container's default pattern.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What lifetime mismatch is this?\n```csharp\nbuilder.Services.AddSingleton<EmailService>();\n// EmailService depends on IOrderRepository (scoped)\n```",
        options: [
          "No mismatch.",
          "A singleton captures the first scoped `IOrderRepository` resolution and reuses it forever — across all requests — corrupting per-request state.",
          "`AddSingleton` is illegal.",
          "Scoped and singleton are the same.",
        ],
        correctAnswer:
          "A singleton captures the first scoped `IOrderRepository` resolution and reuses it forever — across all requests — corrupting per-request state.",
        explanation: "Either make `EmailService` scoped, or inject `IServiceScopeFactory` and create a scope on demand.",
      },
      {
        kind: "interview",
        question: "What is the composition root?",
        options: [
          "The first controller.",
          "The place where the application's object graph is wired up — usually `Program.cs` and DI registration extension methods.",
          "The database.",
          "The static `Main`.",
        ],
        correctAnswer:
          "The place where the application's object graph is wired up — usually `Program.cs` and DI registration extension methods.",
        explanation: "Wiring lives in one place; the rest of the code consumes the result.",
      },
    ],
  },

  configuration: {
    whyItMatters:
      "Every environment needs different config. Doing this with `IConfiguration` and `IOptions<T>` is what keeps secrets out of code and lets the same binary run anywhere.",
    simpleExplanation:
      "Configuration is environment-specific values (connection strings, feature flags) loaded from sources like `appsettings.json`, environment variables, or Azure Key Vault.",
    deepExplanation:
      "ASP.NET Core builds a hierarchical configuration from multiple sources, layered: `appsettings.json` → `appsettings.{Environment}.json` → environment variables → command-line args. The last source wins. Bind sections to strongly-typed POCOs via `services.Configure<MyOptions>(Configuration.GetSection(\"My\"))` and inject `IOptions<MyOptions>` rather than reading `IConfiguration` everywhere.",
    realWorldUsage:
      "`ConnectionStrings:Default` lives in `appsettings.json` with a placeholder; production overrides it via an env var or Key Vault reference. The code reads it via `IConfiguration.GetConnectionString` once at startup.",
    explainLikeBeginner:
      "Configuration is the set of dials on the outside of your program: change them, and the program behaves differently without rebuilding.",
    interviewAnswer:
      "Configuration in .NET is a layered system that loads values from files, environment variables, and user secrets. We bind sections into strongly-typed POCOs via `IOptions<T>` and avoid passing `IConfiguration` deep into the code. Secrets live in environment-specific sources, not in committed files.",
    commonMistakes: [
      "Hard-coding values in code 'temporarily'.",
      "Committing real secrets to `appsettings.Production.json`.",
      "Injecting `IConfiguration` everywhere and stringly-typing access.",
    ],
    bestPractices: [
      "Define a POCO per logical config section.",
      "Validate options at startup with `ValidateOnStart` / `ValidateDataAnnotations`.",
      "Use user secrets in dev, env vars / Key Vault in prod.",
    ],
    summary: [
      "Config is layered and overridable.",
      "Bind to POCOs, inject `IOptions<T>`.",
      "Secrets never live in the repo.",
    ],
    codeExample: {
      title: "Bind, validate, inject",
      code: `public class EmailOptions
{
    public required string Host { get; init; }
    public int Port { get; init; } = 587;
    public required string User { get; init; }
}

builder.Services
    .AddOptions<EmailOptions>()
    .Bind(builder.Configuration.GetSection("Email"))
    .ValidateDataAnnotations()
    .ValidateOnStart();

public class EmailService(IOptions<EmailOptions> opts)
{
    private readonly EmailOptions _config = opts.Value;
}`,
      output: "Invalid config -> startup fails fast with a clear message.",
      walkthrough: [
        "Bind the section to a POCO with required properties.",
        "Validate at startup so misconfigurations never reach a request.",
        "Inject `IOptions<EmailOptions>` for safe, typed access.",
      ],
    },
    practice: {
      prompt:
        "Add an `EmailOptions` section, bind it, validate it, and use it inside a service. Misconfigure on purpose and confirm the app refuses to start.",
      expectedResult:
        "Valid config starts; invalid config fails at startup with a useful error.",
      hints: [
        "Use `[Required]` on `Host` and `User`.",
        "Call `ValidateOnStart()`.",
        "Try setting `Host` to an empty string.",
      ],
      solution:
        "Fail-fast configuration validation means production never silently runs with broken settings.",
    },
    quiz: [
      {
        kind: "concept",
        question:
          "Which configuration source typically wins in the default layering?",
        options: [
          "`appsettings.json`",
          "`appsettings.{Environment}.json`",
          "Environment variables",
          "Command-line arguments",
        ],
        correctAnswer: "Command-line arguments",
        explanation: "Default precedence: files → env-specific files → env vars → command line. The last source wins.",
      },
      {
        kind: "code-reading",
        question:
          "What does `ValidateOnStart` add to the configuration?",
        options: [
          "Nothing meaningful.",
          "Runs validation when the host starts so misconfigurations fail immediately instead of when an `IOptions<T>` is first read.",
          "Disables validation.",
          "Logs each value.",
        ],
        correctAnswer:
          "Runs validation when the host starts so misconfigurations fail immediately instead of when an `IOptions<T>` is first read.",
        explanation: "Fail fast at startup, not in the middle of serving a request.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is wrong?\n```json\n// appsettings.Production.json\n{ \"ConnectionStrings\": { \"Default\": \"Server=...;Password=hunter2\" } }\n```",
        options: [
          "Nothing.",
          "Production secrets are committed to source control — any contributor with repo access can read them.",
          "JSON is not allowed.",
          "`Default` is a reserved word.",
        ],
        correctAnswer:
          "Production secrets are committed to source control — any contributor with repo access can read them.",
        explanation: "Use env vars, Key Vault, or another secret store; the JSON file should hold placeholders or non-secrets.",
      },
      {
        kind: "interview",
        question:
          "Why use `IOptions<T>` instead of reading `IConfiguration` directly inside a service?",
        options: [
          "Style.",
          "It binds once into a typed POCO at startup, makes the dependency on configuration explicit, and avoids stringly-typed access scattered through the code.",
          "It is faster.",
          "There is no reason.",
        ],
        correctAnswer:
          "It binds once into a typed POCO at startup, makes the dependency on configuration explicit, and avoids stringly-typed access scattered through the code.",
        explanation: "Typed options are refactor-safe and discoverable.",
      },
    ],
  },

  "middleware-basics": {
    whyItMatters:
      "Middleware is the pipeline every request passes through. Knowing how to add, order, and short-circuit middleware is what lets you implement cross-cutting concerns cleanly.",
    simpleExplanation:
      "Middleware is a function that takes an `HttpContext`, optionally calls the next middleware, and may modify the request or response.",
    deepExplanation:
      "The pipeline is built in `Program.cs` with `app.Use...` calls. Each piece runs in order on the way in and reverse order on the way out. Built-in middleware handles authentication, authorisation, routing, error handling, CORS, response compression. Custom middleware is easy: an `async (context, next) => ...` lambda or a class with an `InvokeAsync` method.",
    realWorldUsage:
      "A correlation-id middleware reads `X-Correlation-Id` or generates one, attaches it to `HttpContext.Items`, sets the response header, and invokes the next component.",
    explainLikeBeginner:
      "Middleware is an assembly line. Each station can inspect or modify the package on the way through.",
    interviewAnswer:
      "Middleware is the request-pipeline abstraction in ASP.NET Core. Each component receives the `HttpContext`, can do work, and either calls `next` or short-circuits the response. Built-in middleware covers auth, routing, error handling; custom middleware handles cross-cutting concerns like correlation ids and structured logging.",
    commonMistakes: [
      "Forgetting to call `await next()` and silently 200ing every request with an empty body.",
      "Adding middleware after `MapControllers` and being surprised it never runs.",
      "Writing the same logic across many controllers when middleware would centralise it.",
    ],
    bestPractices: [
      "Keep each piece focused on one concern.",
      "Place middleware before endpoints in the pipeline.",
      "For complex middleware, write a class with `InvokeAsync` for testability.",
    ],
    summary: [
      "Middleware = pipeline of `(context, next)` functions.",
      "Order matters; place before endpoints.",
      "Use it for cross-cutting concerns, not business logic.",
    ],
    codeExample: {
      title: "Correlation-id middleware",
      code: `app.Use(async (ctx, next) =>
{
    var id = ctx.Request.Headers["X-Correlation-Id"].FirstOrDefault()
        ?? Guid.NewGuid().ToString("N");
    ctx.Items["CorrelationId"] = id;
    ctx.Response.Headers["X-Correlation-Id"] = id;
    await next();
});`,
      output: "Every response includes X-Correlation-Id, traceable in logs.",
      walkthrough: [
        "Reads or generates an id.",
        "Stores it in `HttpContext.Items` for downstream code.",
        "Calls `next()` so the rest of the pipeline runs.",
      ],
    },
    practice: {
      prompt:
        "Write a middleware that logs every request's method, path, status code, and elapsed milliseconds. Use `ILogger`. Confirm via a sample run that every request produces a log line.",
      expectedResult:
        "Logs show method/path/status/ms for every request, including errors.",
      hints: [
        "Use `Stopwatch.StartNew()`.",
        "Wrap `next()` in `try`/`finally` so timing is always logged.",
        "Log structured fields for searching.",
      ],
      solution:
        "A focused middleware adds observability with one file. Centralising the pattern beats scattering log lines across controllers.",
    },
    quiz: [
      {
        kind: "concept",
        question:
          "What does omitting `await next()` in a middleware cause?",
        options: [
          "Nothing.",
          "The pipeline short-circuits at that middleware — subsequent middleware and the endpoint never run.",
          "An exception.",
          "A 500 error.",
        ],
        correctAnswer:
          "The pipeline short-circuits at that middleware — subsequent middleware and the endpoint never run.",
        explanation: "Forgetting `next` is the easiest middleware bug to make — silent and total.",
      },
      {
        kind: "code-reading",
        question:
          "What does `ctx.Items[\"CorrelationId\"] = id` enable?",
        options: [
          "Nothing.",
          "Downstream middleware and the action can read the id via `HttpContext.Items` to enrich logs or pass it to outbound calls.",
          "Database storage.",
          "Authentication.",
        ],
        correctAnswer:
          "Downstream middleware and the action can read the id via `HttpContext.Items` to enrich logs or pass it to outbound calls.",
        explanation: "`Items` is a per-request bag for cross-component metadata.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is wrong?\n```csharp\napp.MapControllers();\napp.Use(async (ctx, next) => { /* logging */ await next(); });\n```",
        options: [
          "Nothing.",
          "The logging middleware is added after `MapControllers`, so it never runs for controller endpoints.",
          "Logging cannot be in middleware.",
          "`MapControllers` is illegal.",
        ],
        correctAnswer:
          "The logging middleware is added after `MapControllers`, so it never runs for controller endpoints.",
        explanation: "Place middleware before endpoint mapping for it to participate in the pipeline.",
      },
      {
        kind: "interview",
        question:
          "When would you prefer a middleware class with `InvokeAsync` over a lambda?",
        options: [
          "Style.",
          "When the middleware has dependencies (loggers, services) it should obtain via constructor injection, or when the logic is large enough to warrant testing in isolation.",
          "Lambdas are illegal.",
          "Classes are faster.",
        ],
        correctAnswer:
          "When the middleware has dependencies (loggers, services) it should obtain via constructor injection, or when the logic is large enough to warrant testing in isolation.",
        explanation: "Classes give DI and unit-testability for non-trivial middleware.",
      },
    ],
  },

  "simple-dotnet-web-api-example": {
    whyItMatters:
      "Putting the pieces together — controller, service, repository, DTO, DI, middleware — in one small example makes the relationships concrete.",
    simpleExplanation:
      "A simple Web API exposes an endpoint that hands a request to a service, which uses a repository, and returns a DTO.",
    deepExplanation:
      "The smallest version of a production-grade API: `Program.cs` registers DI; `OrdersController` exposes endpoints; `OrderService` enforces rules; `IOrderRepository` abstracts storage; DTOs at the boundary; middleware for cross-cutting concerns. Each piece is small, named after its job, and replaceable.",
    realWorldUsage:
      "A small `/orders` service with `GET /orders/{id}` and `POST /orders` is essentially this skeleton scaled up.",
    explainLikeBeginner:
      "Think of a tiny pizza shop: the customer (client) places an order (POST), the cashier (controller) hands it to the kitchen (service), the kitchen pulls supplies from the pantry (repository), and a receipt (DTO) comes back.",
    interviewAnswer:
      "A canonical small Web API has a thin controller, a service with the rules, a repository abstraction, DTOs at the boundary, and DI wiring it all together. Even at 100 lines, the layout scales to thousands without restructuring.",
    commonMistakes: [
      "Mixing the layers in a hurry and losing the separation.",
      "Skipping the repository so the service ends up coupled to the ORM.",
      "Returning entities and discovering the contract is too coupled to the schema later.",
    ],
    bestPractices: [
      "Start with the layout from day one; it costs nothing.",
      "Add a unit test for the service before adding more endpoints.",
      "Keep the composition root in `Program.cs` concise.",
    ],
    summary: [
      "Controller → service → repository → entity.",
      "DTOs at the boundary, DI wiring everything.",
      "The layout scales without refactoring.",
    ],
    codeExample: {
      title: "End-to-end orders API",
      code: `// Program.cs
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddScoped<IOrderRepository, EfOrderRepository>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddDbContext<AppDbContext>(o =>
    o.UseSqlServer(builder.Configuration.GetConnectionString("Default")));
var app = builder.Build();
app.UseExceptionHandler("/error");
app.MapControllers();
app.Run();

// OrdersController.cs
[ApiController, Route("orders")]
public class OrdersController(IOrderService orders) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<OrderResponse>> Create(CreateOrderRequest req)
    {
        var created = await orders.CreateAsync(req);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<OrderResponse>> Get(Guid id) =>
        Ok(await orders.GetAsync(id));
}`,
      output: `POST /orders   201 Created   Location: /orders/8f3...
GET  /orders/8f3...   200 OK   {"id":"8f3...","status":"Pending","total":42.5}`,
      walkthrough: [
        "DI configured once in `Program.cs`.",
        "Controller is two short actions.",
        "Service + repository are testable independently of HTTP.",
      ],
    },
    practice: {
      prompt:
        "Clone this skeleton for `/products`: controller, service, repository, DTOs, DI. Run it locally and confirm the CRUD endpoints work end-to-end via curl.",
      expectedResult: "Same shape, different resource. The layout is internalised.",
      hints: [
        "Copy the existing structure and rename.",
        "Verify with curl for all five HTTP methods.",
        "Add a unit test for one service method.",
      ],
      solution:
        "Repeating the pattern across resources is how you internalise it. Each new feature lands in a predictable place.",
    },
    quiz: [
      {
        kind: "concept",
        question:
          "Which layer enforces business rules in the canonical small Web API?",
        options: [
          "The controller.",
          "The service.",
          "The repository.",
          "Middleware.",
        ],
        correctAnswer: "The service.",
        explanation: "Controllers translate HTTP; services hold the rules.",
      },
      {
        kind: "code-reading",
        question:
          "Where does the example wire `IOrderRepository` to `EfOrderRepository`?",
        options: [
          "In the controller.",
          "In `Program.cs` via `AddScoped<IOrderRepository, EfOrderRepository>()`.",
          "In `OrderService`.",
          "Nowhere; DI auto-discovers it.",
        ],
        correctAnswer:
          "In `Program.cs` via `AddScoped<IOrderRepository, EfOrderRepository>()`.",
        explanation: "The composition root is the only place that knows both sides.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is wrong?\n```csharp\n[HttpPost]\npublic async Task<IActionResult> Create(CreateOrderRequest req)\n{\n    var order = new Order(Guid.NewGuid(), req.CustomerId);\n    _db.Orders.Add(order);\n    await _db.SaveChangesAsync();\n    return Ok(order);\n}\n```",
        options: [
          "Nothing.",
          "Controller touches `DbContext` directly, returns the entity instead of a DTO, and uses 200 instead of 201.",
          "`Add` does not exist.",
          "`Guid.NewGuid` is illegal.",
        ],
        correctAnswer:
          "Controller touches `DbContext` directly, returns the entity instead of a DTO, and uses 200 instead of 201.",
        explanation: "Refactor through the service and DTO; layering pays off the first time the schema changes.",
      },
      {
        kind: "interview",
        question:
          "Why is the small-API layout still worth adopting even for a single-feature project?",
        options: [
          "It is required.",
          "The cost of the layout is tiny and the pay-off is immediate: services unit-testable, repositories swappable, contracts stable. Skipping it tends to become a 'we'll refactor later' that never lands.",
          "It is faster.",
          "There is no benefit.",
        ],
        correctAnswer:
          "The cost of the layout is tiny and the pay-off is immediate: services unit-testable, repositories swappable, contracts stable. Skipping it tends to become a 'we'll refactor later' that never lands.",
        explanation: "Get the layering right early; it compounds.",
      },
    ],
  },
};
