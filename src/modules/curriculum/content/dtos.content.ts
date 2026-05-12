import type { ModuleContent } from "./types";

export const dtosContent: ModuleContent = {
  "what-is-dto": {
    whyItMatters:
      "Returning a raw EF Core entity from an API leaks your database schema to every consumer and couples your wire format to internal naming. DTOs are the inexpensive fix.",
    simpleExplanation:
      "A DTO is a plain shape used to move data across a boundary — typically between your API and a client. It carries data and nothing else.",
    deepExplanation:
      "Entities are tied to your persistence model: navigation properties, foreign keys, computed columns. DTOs are tied to the contract you want to publish. Mixing them means every database rename becomes a public API change. Keep two shapes — `CreateOrderRequest`, `OrderResponse` — and map between them in one place. The mapping itself becomes the only file that changes when storage and API evolve at different speeds.",
    realWorldUsage:
      "`POST /orders` accepts `CreateOrderRequest`, the service translates that to an `Order` entity, persists it, and returns `OrderResponse`. Database migrations no longer break the client.",
    explainLikeBeginner:
      "Think of a DTO as the envelope you mail. The letter inside (your entity) stays in your house; only what fits in the envelope gets sent.",
    interviewAnswer:
      "A DTO is a Data Transfer Object — a class whose only job is to move data across a boundary. In a .NET API we use DTOs to decouple the wire format from the persistence model so each can evolve without breaking the other.",
    commonMistakes: [
      "Returning EF Core entities directly from controllers, exposing internal columns and forcing JSON serialiser quirks.",
      "Reusing one DTO for both request and response when their needed fields are different.",
      "Letting DTOs carry behaviour — they should be data-only.",
    ],
    bestPractices: [
      "Separate request and response DTOs even when fields overlap; their lifecycles differ.",
      "Use `record` for immutable DTOs — they get value equality and concise syntax.",
      "Centralise mapping in a `Mapper` or extension method rather than scattering it.",
    ],
    summary: [
      "DTOs decouple wire format from persistence.",
      "Keep request and response DTOs separate.",
      "Use records for safe, value-equal data carriers.",
    ],
    codeExample: {
      title: "Request and response DTOs",
      code: `public record CreateOrderRequest(string CustomerEmail, List<OrderLineRequest> Lines);
public record OrderLineRequest(string Sku, int Quantity);

public record OrderResponse(Guid Id, string Status, decimal Total);

[HttpPost]
public async Task<ActionResult<OrderResponse>> Create(CreateOrderRequest req)
{
    var id = await _orders.CreateAsync(req);
    var response = await _orders.GetAsync(id);
    return CreatedAtAction(nameof(Get), new { id }, response);
}`,
      output: `HTTP/1.1 201 Created
Location: /orders/8f3...
{"id":"8f3...","status":"Pending","total":42.50}`,
      walkthrough: [
        "Request DTO captures only the input — no entity Id, no timestamps.",
        "Response DTO publishes what the client needs — no navigation properties.",
        "Controller stays thin: parse, call service, map, return.",
      ],
    },
    practice: {
      prompt:
        "Build a `CreateCustomerRequest(string Name, string Email)` and a `CustomerResponse(Guid Id, string Name, string Email, DateTimeOffset CreatedAt)`. Wire them through a `CustomersController.Create` endpoint that returns `201 Created` with the response body.",
      expectedResult:
        "The wire format is explicit, validation can be added to the request, and the response never exposes internal fields.",
      hints: [
        "Use `record` for both types.",
        "Return `CreatedAtAction(nameof(Get), new { id }, response)`.",
        "Map inside the service, not the controller.",
      ],
      solution:
        "Request and response are immutable records with focused fields. The service performs the mapping; the controller is purely an adapter that returns the right HTTP status code.",
    },
    quiz: [
      {
        kind: "concept",
        question: "Which best describes the role of a DTO?",
        options: [
          "A class that contains business rules for a domain concept.",
          "A data-only carrier used to move state across a boundary such as HTTP.",
          "A persistence model managed by EF Core.",
          "A helper for dependency injection.",
        ],
        correctAnswer:
          "A data-only carrier used to move state across a boundary such as HTTP.",
        explanation:
          "DTOs hold data and nothing else; rules belong to entities or services, and persistence is a separate concern.",
      },
      {
        kind: "code-reading",
        question:
          "What does this DTO declaration give you in C#?\n```csharp\npublic record OrderResponse(Guid Id, string Status, decimal Total);\n```",
        options: [
          "Mutable properties with setters.",
          "An immutable type with value equality, deconstruction, and a concise constructor.",
          "A class that EF Core will treat as an entity.",
          "Nothing — records require explicit properties.",
        ],
        correctAnswer:
          "An immutable type with value equality, deconstruction, and a concise constructor.",
        explanation:
          "Positional records generate read-only properties, `Equals`/`GetHashCode`, and `Deconstruct`. Perfect for DTOs.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is wrong with this endpoint?\n```csharp\n[HttpGet(\"{id:guid}\")]\npublic async Task<Order> Get(Guid id) => await _db.Orders.Include(o => o.Customer).FirstAsync(o => o.Id == id);\n```",
        options: [
          "Nothing — returning entities is recommended.",
          "It returns an EF Core entity with navigation properties, leaking the schema and risking circular JSON serialisation.",
          "`FirstAsync` is not async.",
          "`Include` requires an explicit `using`.",
        ],
        correctAnswer:
          "It returns an EF Core entity with navigation properties, leaking the schema and risking circular JSON serialisation.",
        explanation:
          "Return an `OrderResponse` DTO with only the fields clients need. Entities are an implementation detail.",
      },
      {
        kind: "interview",
        question:
          "An interviewer asks: 'Why not use the same class for both requests and responses?'",
        options: [
          "There is no reason.",
          "Their fields, validation rules, and lifecycles differ — one carries client input, the other carries server-computed state.",
          "C# does not allow it.",
          "Performance.",
        ],
        correctAnswer:
          "Their fields, validation rules, and lifecycles differ — one carries client input, the other carries server-computed state.",
        explanation:
          "Sharing one DTO usually means either the request accepts fields it should not, or the response omits fields it should expose.",
      },
    ],
  },

  "why-dtos-are-used": {
    whyItMatters:
      "Junior developers often resist DTOs as 'extra plumbing'. Knowing the concrete reasons saves a painful refactor when the database changes and every consumer breaks.",
    simpleExplanation:
      "DTOs exist to decouple your API contract from your database, control what is exposed, and let validation live at the boundary.",
    deepExplanation:
      "Three forces push you toward DTOs. (1) Security: entities often carry fields you do not want to expose (`PasswordHash`, `IsAdmin`). (2) Stability: when your schema changes, the wire format should not silently change with it. (3) Validation: request DTOs are the natural home for `[Required]`, `[Range]`, and FluentValidation rules — close to where the data enters the system.",
    realWorldUsage:
      "A login endpoint accepts `LoginRequest(Email, Password)` and returns `LoginResponse(AccessToken, ExpiresAt)`. The `User` entity — with hashed password and roles — never leaves the service.",
    explainLikeBeginner:
      "DTOs are the security gate at the airport: they decide what is allowed through in either direction and protect what is inside.",
    interviewAnswer:
      "We use DTOs to decouple the public API from the persistence model, to control exactly which fields are exposed, and to attach input validation right where data enters the service.",
    commonMistakes: [
      "Treating DTOs as ceremony and skipping them — then leaking `PasswordHash` in a hot fix.",
      "Adding `[JsonIgnore]` on entities to 'fix' exposure — fragile and easy to forget on new properties.",
      "Letting controllers do the mapping inline, scattering it across the codebase.",
    ],
    bestPractices: [
      "Default to DTOs at every public endpoint, even when fields match the entity 1:1.",
      "Put validation attributes on request DTOs, not on entities.",
      "Make response DTOs immutable; clients should not assume they can mutate them.",
    ],
    summary: [
      "DTOs protect what is exposed, decouple schema from contract, and host validation.",
      "Use them at every API boundary by default.",
      "Skipping them creates a future migration headache.",
    ],
    codeExample: {
      title: "Login DTO pair",
      code: `public record LoginRequest([Required, EmailAddress] string Email,
                           [Required, MinLength(8)] string Password);

public record LoginResponse(string AccessToken, DateTimeOffset ExpiresAt);

[HttpPost("login")]
public async Task<ActionResult<LoginResponse>> Login(LoginRequest req)
{
    if (!ModelState.IsValid) return ValidationProblem();
    return await _auth.IssueAsync(req);
}`,
      output: `HTTP/1.1 200 OK
{"accessToken":"eyJhbGc...","expiresAt":"2025-05-12T14:00:00Z"}`,
      walkthrough: [
        "Request DTO carries validation attributes for free `ModelState` integration.",
        "Response DTO exposes only what the client needs; `User` never appears.",
        "Mapping happens inside `_auth.IssueAsync`, hidden from the controller.",
      ],
    },
    practice: {
      prompt:
        "Take an existing endpoint that returns a `User` entity and split it into `UserResponse` (Id, Name, Email) plus a service-level mapper. Confirm that `PasswordHash` no longer appears in the JSON response.",
      expectedResult:
        "Network inspector shows only Id, Name, Email; the password hash is invisible to clients.",
      hints: [
        "Add a `ToResponse(this User user)` extension method.",
        "Update the controller to call `user.ToResponse()`.",
        "Write an integration test asserting no `passwordHash` key in the JSON.",
      ],
      solution:
        "After the split, all paths from controller to client go through `UserResponse`. Adding a new internal field on `User` cannot accidentally leak — the DTO is the gate.",
    },
    quiz: [
      {
        kind: "concept",
        question: "Which is NOT a reason to use DTOs?",
        options: [
          "Decoupling the API contract from the database schema.",
          "Hiding sensitive fields like password hashes from responses.",
          "Speeding up garbage collection at runtime.",
          "Hosting request validation in one place.",
        ],
        correctAnswer: "Speeding up garbage collection at runtime.",
        explanation:
          "Performance is not the driver — design and security are. The other three are the textbook reasons.",
      },
      {
        kind: "code-reading",
        question:
          "What does the `[Required, EmailAddress]` pair do on the DTO record?",
        options: [
          "Tells EF Core to create a unique index.",
          "Drives ASP.NET Core model validation so invalid requests fail with a 400 before reaching the action body.",
          "Encrypts the email at rest.",
          "Generates a SQL constraint.",
        ],
        correctAnswer:
          "Drives ASP.NET Core model validation so invalid requests fail with a 400 before reaching the action body.",
        explanation:
          "Validation attributes on the request DTO are checked during model binding; `ModelState.IsValid` reflects the result.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What risk does this controller carry?\n```csharp\n[HttpGet]\npublic ActionResult<User> Me() => _users.Current();\n```\n(`User` includes `PasswordHash`.)",
        options: [
          "None.",
          "It serialises `PasswordHash` to the client because there is no DTO between the entity and the response.",
          "`ActionResult<User>` is not valid C#.",
          "`_users.Current()` cannot be synchronous.",
        ],
        correctAnswer:
          "It serialises `PasswordHash` to the client because there is no DTO between the entity and the response.",
        explanation:
          "`[JsonIgnore]` on `PasswordHash` would patch this, but a `UserResponse` DTO is the safer default.",
      },
      {
        kind: "interview",
        question:
          "What single benefit of DTOs would you mention first to a sceptical teammate?",
        options: [
          "They reduce the number of files in the project.",
          "They let the database and the API evolve independently, which is the main source of pain when they share types.",
          "They make the code shorter overall.",
          "They are required by ASP.NET Core.",
        ],
        correctAnswer:
          "They let the database and the API evolve independently, which is the main source of pain when they share types.",
        explanation:
          "Independent evolution is the practical win — most other benefits follow from this.",
      },
    ],
  },

  "request-dto": {
    whyItMatters:
      "Request DTOs are your input boundary. Every validation rule and every shape constraint should live here so the rest of the service can trust its inputs.",
    simpleExplanation:
      "A request DTO defines exactly what fields the API accepts from a client and the rules each must satisfy.",
    deepExplanation:
      "Keep request DTOs minimal — only fields the client supplies. Do not include `Id` on create requests; the server generates it. Use validation attributes (or FluentValidation rules) so model binding rejects malformed input automatically. Return `400 Bad Request` with a `ProblemDetails` body when validation fails — that is the standard contract ASP.NET Core gives you for free.",
    realWorldUsage:
      "`POST /customers` accepts `CreateCustomerRequest(Name, Email)`. Invalid email returns 400 with `{ errors: { email: [\"valid email required\"] } }`.",
    explainLikeBeginner:
      "A form on a website: only the boxes you fill in are sent. The form is your request DTO.",
    interviewAnswer:
      "A request DTO is a shape the API binds incoming data into. It carries only the fields the client should supply and the validation rules each must satisfy, so the service layer never sees invalid input.",
    commonMistakes: [
      "Including server-generated fields (`Id`, `CreatedAt`) on create requests — clients can spoof them.",
      "Validating inside the service instead of on the request DTO, duplicating logic across endpoints.",
      "Returning vague `400 Bad Request` without details — clients cannot fix what they cannot see.",
    ],
    bestPractices: [
      "Include only the fields the client genuinely supplies.",
      "Attach validation attributes and use `ApiController` so `400` is automatic.",
      "Return `ProblemDetails` with per-field errors.",
    ],
    summary: [
      "Request DTOs define inputs precisely.",
      "Validation belongs on the DTO, not in the service.",
      "ASP.NET Core handles the 400 + ProblemDetails plumbing.",
    ],
    codeExample: {
      title: "Create-customer request DTO",
      code: `public record CreateCustomerRequest(
    [Required, MaxLength(100)] string Name,
    [Required, EmailAddress] string Email);

[ApiController, Route("customers")]
public class CustomersController : ControllerBase
{
    private readonly ICustomerService _customers;
    public CustomersController(ICustomerService c) => _customers = c;

    [HttpPost]
    public async Task<IActionResult> Create(CreateCustomerRequest req)
    {
        var id = await _customers.CreateAsync(req);
        return CreatedAtAction(nameof(Get), new { id }, null);
    }
}`,
      output: `HTTP/1.1 400 Bad Request
{"errors":{"email":["The Email field is not a valid e-mail address."]}}`,
      walkthrough: [
        "Validation attributes guard each field.",
        "`[ApiController]` auto-returns 400 + ProblemDetails when binding fails.",
        "Inside the action, the DTO is guaranteed valid.",
      ],
    },
    practice: {
      prompt:
        "Write a `CreateProductRequest` with `Name` (required, max 80 chars), `Price` (range 0.01 to 1,000,000), and `Sku` (required, regex `^[A-Z]{3}-\\d{3}$`). Verify that invalid payloads return 400 with per-field errors.",
      expectedResult:
        "Posting `{ \"name\": \"\", \"price\": -1, \"sku\": \"bad\" }` returns 400 with three field-level error entries.",
      hints: [
        "Use `[RegularExpression]` for SKU.",
        "Use `[Range(0.01, 1_000_000)]` for price.",
        "Annotate the controller with `[ApiController]` to get automatic ProblemDetails.",
      ],
      solution:
        "All three fields validated declaratively. The action body is reached only with valid input, so service logic stays focused on the rule, not on defensive checks.",
    },
    quiz: [
      {
        kind: "concept",
        question: "Why omit `Id` from a create-request DTO?",
        options: [
          "It would not fit in JSON.",
          "The server assigns the identifier, so accepting it from clients invites spoofing and breaks idempotency assumptions.",
          "EF Core does not support it.",
          "There is no reason.",
        ],
        correctAnswer:
          "The server assigns the identifier, so accepting it from clients invites spoofing and breaks idempotency assumptions.",
        explanation:
          "Identity is server-controlled. Use route parameters for updates, never an `Id` field inside the request body.",
      },
      {
        kind: "code-reading",
        question:
          "Given `[ApiController]` on the controller, what happens when binding `CreateCustomerRequest` fails validation?",
        options: [
          "The action body runs and decides what to do.",
          "ASP.NET Core short-circuits with `400 Bad Request` and a `ProblemDetails` body — the action never executes.",
          "The request silently succeeds.",
          "A `500 Internal Server Error` is returned.",
        ],
        correctAnswer:
          "ASP.NET Core short-circuits with `400 Bad Request` and a `ProblemDetails` body — the action never executes.",
        explanation:
          "`[ApiController]` adds the automatic 400 + ProblemDetails behaviour; without it, you would have to check `ModelState.IsValid` yourself.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is the risk?\n```csharp\npublic record CreateOrderRequest(Guid Id, Guid CustomerId, decimal Total);\n```",
        options: [
          "It will not compile.",
          "Accepting `Id` and `Total` from the client lets them set the order id and bypass server-side total calculation.",
          "`Guid` cannot be a record parameter.",
          "`decimal` should be `double`.",
        ],
        correctAnswer:
          "Accepting `Id` and `Total` from the client lets them set the order id and bypass server-side total calculation.",
        explanation:
          "Identity and computed values must originate on the server. Request DTOs should carry only client-supplied input.",
      },
      {
        kind: "interview",
        question:
          "Where should validation live for an incoming POST body?",
        options: [
          "Scattered across services and repositories.",
          "On the request DTO via attributes (or FluentValidation), so model binding rejects bad input automatically.",
          "Inside the database constraints only.",
          "Validation is unnecessary if the client is your own.",
        ],
        correctAnswer:
          "On the request DTO via attributes (or FluentValidation), so model binding rejects bad input automatically.",
        explanation:
          "Validation at the boundary keeps services pure and aligns errors with the field clients can fix.",
      },
    ],
  },

  "response-dto": {
    whyItMatters:
      "Whatever you return becomes a contract. Once a client depends on a field, you cannot change it. Response DTOs let you publish a deliberate shape rather than whatever your entity happens to look like.",
    simpleExplanation:
      "A response DTO is a shape you control, sent back to the client, with only the fields they need.",
    deepExplanation:
      "Two questions to ask before returning anything: who is the audience, and what will they break if you change this? Response DTOs let you answer both deliberately. They also let you adapt the same entity to multiple consumers (a public partner API, an internal admin UI) with different fields exposed.",
    realWorldUsage:
      "`GET /orders/{id}` returns `OrderResponse(Id, Status, Total, Lines)`. The internal admin endpoint returns `OrderAdminResponse(..., InternalNotes, AuditTrail)`. Same entity, two contracts.",
    explainLikeBeginner:
      "A response DTO is what is printed on the receipt: only the customer-facing details, not the inventory codes.",
    interviewAnswer:
      "A response DTO is a server-controlled shape returned to clients. We design it deliberately so the API contract evolves independently of the persistence model and so each consumer sees only the fields it should.",
    commonMistakes: [
      "Returning entities directly, then being unable to rename a column without breaking clients.",
      "Including `null`-heavy navigation properties that cause cycles in JSON serialisation.",
      "Versioning the API by adding fields to one DTO until it carries every variant.",
    ],
    bestPractices: [
      "Make response DTOs immutable (records).",
      "Use `null` deliberately: missing means missing, not 'we forgot to map this'.",
      "When the contract changes meaningfully, version the DTO (`OrderResponseV2`) rather than mutate the original.",
    ],
    summary: [
      "Response DTOs publish a deliberate API shape.",
      "Use records to make them immutable.",
      "Version them when the contract changes meaningfully.",
    ],
    codeExample: {
      title: "Two response DTOs for one entity",
      code: `public record OrderResponse(Guid Id, string Status, decimal Total);
public record OrderAdminResponse(Guid Id, string Status, decimal Total,
    string? InternalNotes, DateTimeOffset CreatedAt);

[HttpGet("{id:guid}")]
public async Task<ActionResult<OrderResponse>> Get(Guid id)
    => Ok(await _orders.GetAsync(id));

[HttpGet("admin/{id:guid}"), Authorize(Roles = "Admin")]
public async Task<ActionResult<OrderAdminResponse>> GetForAdmin(Guid id)
    => Ok(await _orders.GetForAdminAsync(id));`,
      output: `GET /orders/8f3...    -> {"id":"8f3...","status":"Confirmed","total":42.5}
GET /orders/admin/... -> {"id":"8f3...","status":"Confirmed","total":42.5,"internalNotes":"VIP","createdAt":"..."}`,
      walkthrough: [
        "Two consumers, two response DTOs.",
        "Authorisation is enforced at the endpoint; the DTO shape reflects what each audience may see.",
        "Same underlying `Order` entity.",
      ],
    },
    practice: {
      prompt:
        "Add a `ProductPublicResponse` (Id, Name, Price) and `ProductInternalResponse` (Id, Name, Price, Cost, Margin) for the same `Product` entity. Expose them on `/products/{id}` and `/admin/products/{id}` respectively.",
      expectedResult:
        "Public clients never see `Cost` or `Margin`; admin endpoints do.",
      hints: [
        "Use `[Authorize]` on the admin endpoint.",
        "Project to each DTO in the service, not in the controller.",
        "Add a test asserting `Cost` is absent in the public JSON.",
      ],
      solution:
        "The service exposes `GetPublicAsync` and `GetInternalAsync`, each returning the corresponding DTO. The contract for each audience is explicit and enforced by the endpoint.",
    },
    quiz: [
      {
        kind: "concept",
        question: "Why prefer multiple response DTOs over one fat DTO with nullable fields?",
        options: [
          "It uses less memory.",
          "Each consumer sees a contract scoped to its needs, and changing one does not silently affect the others.",
          "C# does not allow nullable record fields.",
          "There is no reason.",
        ],
        correctAnswer:
          "Each consumer sees a contract scoped to its needs, and changing one does not silently affect the others.",
        explanation:
          "Fat DTOs blur audiences and make it unclear which fields are safe to remove or rename.",
      },
      {
        kind: "code-reading",
        question:
          "Why is `OrderAdminResponse` separated from `OrderResponse`?",
        options: [
          "EF Core requires it.",
          "Admins see additional fields (`InternalNotes`, `CreatedAt`) that should not be in the public contract.",
          "Records cannot be combined.",
          "Performance.",
        ],
        correctAnswer:
          "Admins see additional fields (`InternalNotes`, `CreatedAt`) that should not be in the public contract.",
        explanation:
          "Different audiences, different contracts. Keeping them as separate DTOs prevents accidental leaks.",
      },
      {
        kind: "spot-the-bug",
        question:
          "Spot the problem:\n```csharp\n[HttpGet]\npublic ActionResult<List<Order>> List() => Ok(_db.Orders.Include(o => o.Customer).ToList());\n```",
        options: [
          "Returns entities with eager-loaded navigation properties, leaking the schema and risking serialisation cycles between `Order` and `Customer`.",
          "Nothing — it is idiomatic.",
          "`List<Order>` cannot be returned from an action.",
          "`Include` is not allowed.",
        ],
        correctAnswer:
          "Returns entities with eager-loaded navigation properties, leaking the schema and risking serialisation cycles between `Order` and `Customer`.",
        explanation:
          "Project to a response DTO. `Include` is fine for queries but never for outbound JSON.",
      },
      {
        kind: "interview",
        question:
          "How do you handle a breaking change in an existing response DTO?",
        options: [
          "Mutate the DTO and tell clients to upgrade.",
          "Introduce `OrderResponseV2` on a new versioned route while keeping the original until clients migrate.",
          "Delete the old endpoint.",
          "Add the new field as nullable and hope.",
        ],
        correctAnswer:
          "Introduce `OrderResponseV2` on a new versioned route while keeping the original until clients migrate.",
        explanation:
          "API versioning preserves backward compatibility while giving you room to evolve the contract.",
      },
    ],
  },

  "entity-vs-dto": {
    whyItMatters:
      "Confusing the two is how production schemas leak into public APIs. The job titles are different, even when the field lists overlap by 90%.",
    simpleExplanation:
      "An entity is your persistence model — what is stored. A DTO is your transfer model — what is sent over the wire.",
    deepExplanation:
      "Entities live close to the database: they may have navigation properties, change tracking, lazy-loading, attributes for EF Core. DTOs live close to the wire: they are immutable, validated, and shaped to a consumer. They look similar because they describe the same domain, but they answer different questions ('how do I store an order?' vs 'how do I send an order to a client?'). Keep them separate even when it feels like duplication; their evolution rates differ.",
    realWorldUsage:
      "`Order` entity has `OrderLines` (EF navigation), `Customer` (FK + navigation), `RowVersion` for concurrency. `OrderResponse` DTO has only `Id, Status, Total, Lines` — none of the EF concerns.",
    explainLikeBeginner:
      "The entity is the cabinet where you store the file. The DTO is the photocopy you give to someone outside.",
    interviewAnswer:
      "An entity is the persistence model — close to the database, owned by EF Core. A DTO is the transfer model — close to the API, owned by the contract. They look similar because they describe the same domain but have different responsibilities.",
    commonMistakes: [
      "Skipping the DTO and exposing the entity, then dealing with serialisation cycles and accidental field leaks.",
      "Adding `[JsonIgnore]` to entities to 'fix' API leaks — fragile.",
      "Putting validation attributes on entities so EF Core constraints and API rules tangle.",
    ],
    bestPractices: [
      "Keep entities free of API concerns (no `[JsonIgnore]`, no `[Required]`).",
      "Project to DTOs at the boundary, ideally in the service layer.",
      "Use AutoMapper or a hand-written mapper — whichever is clearer for your team.",
    ],
    summary: [
      "Entity = stored, DTO = sent.",
      "Their evolution rates differ.",
      "Keep API concerns off entities.",
    ],
    codeExample: {
      title: "Entity vs DTO, side by side",
      code: `public class Order
{
    public Guid Id { get; set; }
    public Guid CustomerId { get; set; }
    public Customer Customer { get; set; } = null!;
    public List<OrderLine> Lines { get; set; } = new();
    public string Status { get; set; } = "Pending";
    [Timestamp] public byte[]? RowVersion { get; set; }
}

public record OrderResponse(Guid Id, string Status, decimal Total,
    IReadOnlyList<OrderLineResponse> Lines);
public record OrderLineResponse(string Sku, int Quantity);`,
      output: "(no runtime output — illustrates two shapes for the same domain)",
      walkthrough: [
        "`Order` entity carries EF concerns: navigation properties, `RowVersion`.",
        "`OrderResponse` DTO is a flat shape for the wire.",
        "A mapper translates between the two; nothing else needs to know about both worlds.",
      ],
    },
    practice: {
      prompt:
        "Take a `Customer` entity with `Id`, `Name`, `Email`, `PasswordHash`, `ICollection<Order> Orders` and write a `CustomerResponse(Id, Name, Email)`. Add a `ToResponse` extension method and use it in the controller.",
      expectedResult:
        "`PasswordHash` and `Orders` no longer leak in JSON responses; the mapping is one method, easy to test.",
      hints: [
        "Place the extension method in a `Mapping` static class.",
        "Use it in every controller path that returns a customer.",
        "Add a test asserting the JSON has only three keys.",
      ],
      solution:
        "Extension method centralises the projection. The controller returns `customer.ToResponse()` and the contract is explicit.",
    },
    quiz: [
      {
        kind: "concept",
        question: "Which statement is correct?",
        options: [
          "Entities and DTOs are interchangeable.",
          "Entities are persistence-focused; DTOs are transfer-focused. They describe the same domain but have different responsibilities.",
          "DTOs replace entities entirely.",
          "Only DTOs are used by EF Core.",
        ],
        correctAnswer:
          "Entities are persistence-focused; DTOs are transfer-focused. They describe the same domain but have different responsibilities.",
        explanation:
          "Two shapes, two jobs. They overlap in fields but not in concerns.",
      },
      {
        kind: "code-reading",
        question:
          "Why is `[Timestamp] byte[]? RowVersion` on the entity but not on the DTO?",
        options: [
          "Because DTOs cannot have byte arrays.",
          "Because `RowVersion` is an EF Core concurrency token — a persistence detail clients have no reason to see.",
          "Because records cannot have nullable fields.",
          "Performance.",
        ],
        correctAnswer:
          "Because `RowVersion` is an EF Core concurrency token — a persistence detail clients have no reason to see.",
        explanation:
          "Concurrency control belongs in the persistence layer; it has no place in the public API.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What rule does this break?\n```csharp\npublic class Customer\n{\n    [Required, EmailAddress, JsonIgnore]\n    public string Email { get; set; } = \"\";\n}\n```",
        options: [
          "Nothing.",
          "It tangles persistence (`Customer` is an entity), API validation (`[Required, EmailAddress]`), and serialisation (`[JsonIgnore]`) on one type — making each harder to evolve independently.",
          "`[Required]` cannot coexist with `[JsonIgnore]`.",
          "`string Email` should be `Email?`.",
        ],
        correctAnswer:
          "It tangles persistence (`Customer` is an entity), API validation (`[Required, EmailAddress]`), and serialisation (`[JsonIgnore]`) on one type — making each harder to evolve independently.",
        explanation:
          "Move validation to the request DTO and serialisation choices to the response DTO. The entity stays focused on storage.",
      },
      {
        kind: "interview",
        question:
          "An interviewer asks: 'My entity has every field my DTO needs. Why not just return the entity?'",
        options: [
          "It is fine to do so.",
          "Because that couples your wire contract to your schema; the next database refactor will silently change the API and the field-level decisions stop being explicit.",
          "Because entities do not serialise to JSON.",
          "Because EF Core forbids it.",
        ],
        correctAnswer:
          "Because that couples your wire contract to your schema; the next database refactor will silently change the API and the field-level decisions stop being explicit.",
        explanation:
          "Today's accidental match becomes tomorrow's broken contract. Keep the boundary explicit.",
      },
    ],
  },

  "mapping-dto-to-entity": {
    whyItMatters:
      "Mapping is where the two shapes meet. Done well, it lives in one place; done poorly, it spreads across every controller and breaks every time the schema changes.",
    simpleExplanation:
      "Mapping is the function that translates a DTO to an entity (or back). It is plain code, even if libraries exist to generate it.",
    deepExplanation:
      "Two approaches dominate. Hand-written: an extension method or a dedicated `IMapper` class. It is explicit, debuggable, and refactor-safe. Auto-generated: AutoMapper or Mapperly. Less typing, but failures are harder to trace and field renames silently break runtime mappings. Either way, centralise mapping logic. A junior reader should be able to find every place an `Order` is mapped to an `OrderResponse` in seconds.",
    realWorldUsage:
      "`OrderService.GetAsync(id)` loads the entity, calls `order.ToResponse()`, returns the DTO. The mapping is one file; if `Total` calculation changes, you change it in one place.",
    explainLikeBeginner:
      "Mapping is the translator at a meeting: the speaker (entity) talks, the translator turns it into the other language (DTO) for the listener.",
    interviewAnswer:
      "Mapping translates between entities and DTOs at the boundary. We prefer to centralise it — either in hand-written extension methods or in a tool like Mapperly — so each shape has exactly one place that knows how to turn it into the other.",
    commonMistakes: [
      "Inlining mapping in controllers, so the same `Order -> OrderResponse` translation lives in three actions and drifts.",
      "Using AutoMapper with implicit conventions and discovering at runtime that a field silently mapped to the wrong value.",
      "Mapping forwards in the service and backwards in the controller — inconsistent direction.",
    ],
    bestPractices: [
      "One file per pair of shapes, with `ToResponse` and `ToEntity` methods.",
      "Prefer explicit field-by-field mapping for small projects.",
      "Add a unit test that exercises every field of the mapping.",
    ],
    summary: [
      "Centralise mapping in one place per shape pair.",
      "Hand-written is explicit; tools are concise — pick deliberately.",
      "Test mapping: it is plain code and easy to cover.",
    ],
    codeExample: {
      title: "Hand-written mapping",
      code: `public static class OrderMapping
{
    public static OrderResponse ToResponse(this Order order) => new(
        Id: order.Id,
        Status: order.Status,
        Total: order.Lines.Sum(l => l.Quantity * l.UnitPrice),
        Lines: order.Lines.Select(l => new OrderLineResponse(l.Sku, l.Quantity)).ToList());

    public static Order ToEntity(this CreateOrderRequest req) => new()
    {
        Id = Guid.NewGuid(),
        CustomerId = req.CustomerId,
        Lines = req.Lines.Select(l => new OrderLine(l.Sku, l.Quantity, 0m)).ToList(),
    };
}`,
      output: "(static mapper called inside services / controllers)",
      walkthrough: [
        "Explicit field-by-field mapping makes intent obvious.",
        "Computed values (`Total`) live in the mapper, not in the entity or the DTO.",
        "A single unit test can exercise every field for both directions.",
      ],
    },
    practice: {
      prompt:
        "Write `CustomerMapping` with `ToResponse(this Customer)` and `ToEntity(this CreateCustomerRequest)`. Cover every field. Add a test asserting that round-tripping a customer through both directions preserves all client-supplied data.",
      expectedResult:
        "Mapping is centralised; controllers and services use the extension methods only.",
      hints: [
        "Place the mapper in `Application/Mapping/CustomerMapping.cs`.",
        "Make `ToEntity` set server-generated values (`Id`, `CreatedAt`).",
        "Test direction-by-direction.",
      ],
      solution:
        "After the refactor, searching for `new CustomerResponse(` returns one hit — the mapper. Any future change to fields touches that file only.",
    },
    quiz: [
      {
        kind: "concept",
        question: "Where should DTO ↔ entity mapping logic live?",
        options: [
          "Wherever you happen to need it — inline in controllers is fine.",
          "In one centralised file per shape pair so the translation is explicit and easy to test.",
          "In the entity itself.",
          "In the database via stored procedures.",
        ],
        correctAnswer:
          "In one centralised file per shape pair so the translation is explicit and easy to test.",
        explanation:
          "Centralised mapping prevents drift across endpoints and gives you one place to update when fields change.",
      },
      {
        kind: "code-reading",
        question:
          "What does this mapping do?\n```csharp\nTotal: order.Lines.Sum(l => l.Quantity * l.UnitPrice)\n```",
        options: [
          "Reads `Total` from the entity.",
          "Computes the total on the fly from the line items, so the DTO always reflects the current state of the order.",
          "Calls the database.",
          "Caches the value statically.",
        ],
        correctAnswer:
          "Computes the total on the fly from the line items, so the DTO always reflects the current state of the order.",
        explanation:
          "Computing in the mapper avoids stale fields on the entity and makes the rule visible.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is the risk of this AutoMapper configuration?\n```csharp\nCreateMap<Order, OrderResponse>(); // convention-based\n```",
        options: [
          "It will not compile.",
          "Field renames or removed properties become silent runtime bugs because there is no compile-time check that every DTO field has a source.",
          "AutoMapper does not support records.",
          "Nothing — it is recommended.",
        ],
        correctAnswer:
          "Field renames or removed properties become silent runtime bugs because there is no compile-time check that every DTO field has a source.",
        explanation:
          "Convention-based mapping looks clean until a refactor breaks it silently. Use `AssertConfigurationIsValid` in tests, or prefer explicit mapping.",
      },
      {
        kind: "interview",
        question:
          "How would you defend a hand-written mapper in a code review against 'just use AutoMapper'?",
        options: [
          "It is faster at runtime by a wide margin.",
          "Explicit code is debuggable and refactor-safe: 'Find usages' actually finds them, and a renamed field is a compile error rather than a runtime null.",
          "AutoMapper does not work in .NET.",
          "There is no good reason; AutoMapper is always right.",
        ],
        correctAnswer:
          "Explicit code is debuggable and refactor-safe: 'Find usages' actually finds them, and a renamed field is a compile error rather than a runtime null.",
        explanation:
          "Both approaches are valid; pick the one with the failure mode your team handles best.",
      },
    ],
  },

  "simple-api-with-dtos": {
    whyItMatters:
      "Wiring request DTO → service → entity → response DTO end-to-end is the building block of every CRUD endpoint you will write. Doing it once correctly templates the next ten.",
    simpleExplanation:
      "A 'simple API with DTOs' means: controller accepts a request DTO, validates it, hands it to a service, the service touches entities, and returns a response DTO.",
    deepExplanation:
      "Aim for thin controllers, explicit mapping, and a service that exposes intent. The controller's job is to translate HTTP into a method call; everything else is the service's. Persist via a repository so the rule layer can be tested without a real database. Use `CreatedAtAction` for `POST`, `Ok` for `GET`, `NoContent` for `DELETE`/`PUT`. That consistency is what makes an API feel professional.",
    realWorldUsage:
      "A `/customers` resource with `POST` (create), `GET /{id}` (read), `PUT /{id}` (update), `DELETE /{id}` (delete) — each routes through a DTO at the boundary.",
    explainLikeBeginner:
      "Build the assembly line: paperwork comes in (request), the worker (service) acts on the product (entity), and a receipt (response) goes back out.",
    interviewAnswer:
      "I structure CRUD endpoints with request DTOs at the boundary, a service that calls into a repository, and response DTOs on the way out. Controllers are thin adapters; mapping is centralised; HTTP status codes follow REST conventions.",
    commonMistakes: [
      "Returning `200 OK` for everything — `201` for create, `204` for delete carry information.",
      "Inlining mapping and validation in the controller.",
      "Skipping the service layer 'for simplicity' and hitting `DbContext` directly.",
    ],
    bestPractices: [
      "Keep controllers two-to-five lines per action.",
      "Use `ActionResult<T>` for typed responses.",
      "Centralise mapping; centralise repository interfaces.",
    ],
    summary: [
      "Controller → service → repository → entity.",
      "Request DTO and response DTO bookend the flow.",
      "HTTP status codes are part of the contract.",
    ],
    codeExample: {
      title: "Full CRUD slice",
      code: `[ApiController, Route("customers")]
public class CustomersController : ControllerBase
{
    private readonly ICustomerService _customers;
    public CustomersController(ICustomerService c) => _customers = c;

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<CustomerResponse>> Get(Guid id) =>
        Ok(await _customers.GetAsync(id));

    [HttpPost]
    public async Task<ActionResult<CustomerResponse>> Create(CreateCustomerRequest req)
    {
        var created = await _customers.CreateAsync(req);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _customers.DeleteAsync(id);
        return NoContent();
    }
}`,
      output: `POST /customers   201 Created  Location: /customers/8f3...
GET  /customers/8f3...  200 OK  {"id":"8f3...","name":"Ada","email":"ada@x.com"}
DELETE /customers/8f3...  204 No Content`,
      walkthrough: [
        "Each action is two-to-five lines; logic lives in the service.",
        "DTOs at boundary; entities never reach the controller.",
        "Status codes follow REST conventions.",
      ],
    },
    practice: {
      prompt:
        "Build a `/products` resource with create, read-by-id, list, and delete. Use `ProductRequest` and `ProductResponse`. Persist via an `IProductRepository` (in-memory is fine).",
      expectedResult:
        "Four endpoints with proper status codes, DTOs at the boundary, and a service that is independently testable.",
      hints: [
        "Use `CreatedAtAction` for create.",
        "Return `404 Not Found` (via exception or `Problem`) when the id is unknown.",
        "Test the service with an in-memory repository fake.",
      ],
      solution:
        "Endpoints are thin; the service has the rules; the repository is the only place that talks to storage. Three layers, each testable in isolation.",
    },
    quiz: [
      {
        kind: "concept",
        question: "What status code should a successful `POST /customers` return?",
        options: ["200 OK", "201 Created", "204 No Content", "202 Accepted"],
        correctAnswer: "201 Created",
        explanation:
          "`201 Created` with a `Location` header is the REST convention for resource creation. ASP.NET Core's `CreatedAtAction` produces both for free.",
      },
      {
        kind: "code-reading",
        question:
          "What does `CreatedAtAction(nameof(Get), new { id }, created)` produce?",
        options: [
          "A 200 OK with no body.",
          "A 204 No Content.",
          "A 201 Created with a Location header pointing at the `Get` action for the new id, and the created DTO in the body.",
          "A 302 redirect.",
        ],
        correctAnswer:
          "A 201 Created with a Location header pointing at the `Get` action for the new id, and the created DTO in the body.",
        explanation:
          "`CreatedAtAction` is the canonical helper for `POST` responses — status code, location, body all wired up.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is wrong with this controller?\n```csharp\n[HttpPost]\npublic async Task<IActionResult> Create(CreateCustomerRequest req)\n{\n    var c = new Customer { Name = req.Name, Email = req.Email };\n    _db.Customers.Add(c);\n    await _db.SaveChangesAsync();\n    return Ok(c);\n}\n```",
        options: [
          "Nothing — it works.",
          "It puts persistence and entity construction directly in the controller, returns the entity (not a DTO), and uses 200 instead of 201.",
          "`_db.Customers.Add` is not async.",
          "`req.Name` should be `req.NameValue`.",
        ],
        correctAnswer:
          "It puts persistence and entity construction directly in the controller, returns the entity (not a DTO), and uses 200 instead of 201.",
        explanation:
          "Three violations: leaked persistence, leaked entity, wrong status code. Refactor through a service and DTO mapping.",
      },
      {
        kind: "interview",
        question: "What does a 'thin controller' look like in practice?",
        options: [
          "A class with many private helpers.",
          "An adapter whose actions parse the route and request, delegate to a service, and translate the result to an HTTP response — typically two-to-five lines per action.",
          "A controller without any DI.",
          "A controller with no `[HttpGet]` attributes.",
        ],
        correctAnswer:
          "An adapter whose actions parse the route and request, delegate to a service, and translate the result to an HTTP response — typically two-to-five lines per action.",
        explanation:
          "Thin controllers are the deliberate goal: they make the service the seam where rules live and tests run.",
      },
    ],
  },

  "validation-basics": {
    whyItMatters:
      "Most production bugs are bad input passing as good. Validation at the boundary stops the rest of your service from being a defensive minefield.",
    simpleExplanation:
      "Validation rejects invalid input as close to the boundary as possible — before it can corrupt your domain.",
    deepExplanation:
      "Two layers work together. Declarative validation on the request DTO catches the shape (required fields, ranges, regex). Domain validation on the entity catches the rules (an order with no lines cannot be confirmed). Together they give defence in depth without leaking either concern into the other layer. Use ASP.NET Core's `ModelState` (auto-handled by `[ApiController]`) for the first, and exceptions on the entity for the second.",
    realWorldUsage:
      "`POST /orders` rejects an empty payload with 400 + ProblemDetails. Even if a malformed call slips through, `order.Confirm()` throws because the entity refuses to confirm zero-line orders.",
    explainLikeBeginner:
      "Two security guards. The first checks your ID at the door (shape). The second checks you have a ticket inside (rules).",
    interviewAnswer:
      "We validate at two layers. Request DTOs use attributes or FluentValidation for shape and bound checks, automatically returning 400 with ProblemDetails. Entities enforce domain invariants by throwing on invalid operations. The boundary catches the easy errors, the entity guarantees correctness.",
    commonMistakes: [
      "Skipping shape validation and writing manual `if (req.Name == null) ...` in every action.",
      "Putting business rules on the DTO with `[Required]`, conflating shape with domain.",
      "Returning `500 Internal Server Error` for invalid input — that is a 400.",
    ],
    bestPractices: [
      "Use `[ApiController]` so 400 + ProblemDetails is automatic.",
      "Layer shape validation on the DTO, domain validation on the entity.",
      "For complex rules, switch to FluentValidation rather than overload attributes.",
    ],
    summary: [
      "Shape validation on the DTO; domain validation on the entity.",
      "ASP.NET Core gives you the 400 + ProblemDetails plumbing.",
      "Two layers, two concerns, both cheap to add early.",
    ],
    codeExample: {
      title: "Shape and domain validation working together",
      code: `public record CreateOrderRequest(
    [Required] Guid CustomerId,
    [MinLength(1)] List<OrderLineRequest> Lines);

public sealed class Order
{
    private readonly List<OrderLine> _lines = new();
    public IReadOnlyList<OrderLine> Lines => _lines;
    public void Confirm()
    {
        if (_lines.Count == 0)
            throw new InvalidOperationException("Cannot confirm an empty order.");
        // ...
    }
}`,
      output: `POST /orders   400 Bad Request  (DTO: Lines requires at least 1)
order.Confirm()  InvalidOperationException: Cannot confirm an empty order.`,
      walkthrough: [
        "DTO catches the easy case: empty list rejected at binding.",
        "Even if the DTO check is bypassed, the entity refuses to confirm.",
        "Two layers of defence; neither alone is enough.",
      ],
    },
    practice: {
      prompt:
        "On `CreateProductRequest`, validate that `Name` is non-empty and `Price` is positive. On the `Product` entity, refuse to publish a product whose `Price` is below `MinimumPrice`. Verify with two tests: invalid request → 400; published below minimum → exception.",
      expectedResult:
        "Both layers reject their respective failures; the API behaviour is predictable.",
      hints: [
        "`[Required]` and `[Range(0.01, double.MaxValue)]` on the DTO.",
        "`InvalidOperationException` on the entity.",
        "Test each layer in isolation.",
      ],
      solution:
        "The DTO test posts a bad payload and asserts 400. The entity test calls `Publish` with a price below minimum and asserts the exception. Each layer's contract is explicit.",
    },
    quiz: [
      {
        kind: "concept",
        question:
          "Where should domain invariants like 'an order cannot be confirmed without items' live?",
        options: [
          "On the request DTO.",
          "On the entity, enforced by the method that performs the operation.",
          "In the database constraints only.",
          "On the controller.",
        ],
        correctAnswer:
          "On the entity, enforced by the method that performs the operation.",
        explanation:
          "Domain rules belong to the type that owns the invariant. The DTO catches shape; the entity guards meaning.",
      },
      {
        kind: "code-reading",
        question:
          "Given `[ApiController]`, what does posting `{ \"customerId\": null, \"lines\": [] }` to the endpoint produce?",
        options: [
          "200 OK with an empty order.",
          "400 Bad Request with a ProblemDetails body listing the failing fields.",
          "500 Internal Server Error.",
          "204 No Content.",
        ],
        correctAnswer:
          "400 Bad Request with a ProblemDetails body listing the failing fields.",
        explanation:
          "`[ApiController]` short-circuits invalid model binding into a standardised 400 response — no manual `ModelState.IsValid` check needed.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is wrong with this validation strategy?\n```csharp\npublic async Task<IActionResult> Create(CreateOrderRequest req)\n{\n    if (req.Lines.Count == 0)\n        throw new Exception(\"No lines\");\n    // ...\n}\n```",
        options: [
          "Nothing.",
          "Manual shape validation duplicates what attributes would do; throwing `Exception` produces a 500 instead of the correct 400.",
          "`req.Lines.Count` should be `req.Lines.Size`.",
          "`async` is unnecessary.",
        ],
        correctAnswer:
          "Manual shape validation duplicates what attributes would do; throwing `Exception` produces a 500 instead of the correct 400.",
        explanation:
          "Use `[MinLength(1)]` on the DTO; the framework returns 400 with the right shape automatically.",
      },
      {
        kind: "interview",
        question:
          "When would you prefer FluentValidation over data annotations?",
        options: [
          "When you have complex rules — cross-field comparisons, async checks, conditional validation — that are awkward to express as attributes.",
          "Always; attributes are deprecated.",
          "Never; attributes cover everything.",
          "Only in console applications.",
        ],
        correctAnswer:
          "When you have complex rules — cross-field comparisons, async checks, conditional validation — that are awkward to express as attributes.",
        explanation:
          "Attributes are great for simple shape checks; FluentValidation shines when the rule set grows.",
      },
    ],
  },
};
