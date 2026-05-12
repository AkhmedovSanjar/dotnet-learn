import type { ModuleContent } from "./types";

export const apiRequestsContent: ModuleContent = {
  "client-server-communication": {
    whyItMatters:
      "Almost every bug a junior backend dev investigates is some form of 'the client and the server disagreed'. Understanding the request/response cycle is how you stop guessing.",
    simpleExplanation:
      "A client sends a request over HTTP. The server reads it, decides what to do, and sends back a response. That round-trip is the entire conversation.",
    deepExplanation:
      "Every HTTP exchange has the same shape: method + path + headers + body in the request; status + headers + body in the response. The wire format is text (with optional binary bodies), which is why curl can speak it directly. ASP.NET Core models the request as `HttpContext.Request` and the response as `HttpContext.Response`; the controller is a higher-level wrapper, but those primitives are what is actually on the wire.",
    realWorldUsage:
      "A browser POSTs JSON to `/api/orders`, your service deserialises it, persists an order, and returns 201 with the created resource. Every endpoint you write is one round-trip.",
    explainLikeBeginner:
      "It is like asking a question and getting an answer. The client asks; the server answers. Each side speaks the same language (HTTP).",
    interviewAnswer:
      "Client-server communication over HTTP is a stateless request/response cycle. The client sends a method, path, headers, and optional body; the server responds with a status, headers, and body. Statelessness means each request must carry everything it needs to be understood — there is no implicit session unless we add one.",
    commonMistakes: [
      "Assuming the server can remember the previous request without a session or token.",
      "Confusing status code 200 with 'no error': the body may still describe a domain failure.",
      "Forgetting that HTTP is stateless — each request must authenticate itself.",
    ],
    bestPractices: [
      "Treat the request as the only source of truth for what the server must do.",
      "Be explicit about state: cookies, tokens, or headers — but never silent assumptions.",
      "Log enough of the request (method, path, status) to reconstruct a failing call.",
    ],
    summary: [
      "HTTP is request → response, nothing more.",
      "Both sides have method/path/headers/body and status/headers/body.",
      "Statelessness forces every request to be self-contained.",
    ],
    codeExample: {
      title: "A round trip from curl to controller",
      code: `# curl
curl -X POST http://localhost:5000/api/orders \\
  -H "Content-Type: application/json" \\
  -d '{"customerId":"...","lines":[{"sku":"A","quantity":1}]}'

// minimal controller
[HttpPost]
public async Task<IActionResult> Create(CreateOrderRequest req)
{
    var id = await _orders.CreateAsync(req);
    return Created($"/api/orders/{id}", new { id });
}`,
      output: `HTTP/1.1 201 Created
Location: /api/orders/8f3...
Content-Type: application/json
{"id":"8f3..."}`,
      walkthrough: [
        "Client sends method (POST), path, content-type, body.",
        "Server runs the matching action, persists, returns 201.",
        "Status, Location header, and body are all part of the response contract.",
      ],
    },
    practice: {
      prompt:
        "Hit `GET /weatherforecast` (the default ASP.NET template endpoint) with curl. Inspect the response: status code, content-type header, body. Then POST to a non-existent endpoint and observe the 404 response.",
      expectedResult: "You can describe every part of both responses without guessing.",
      hints: [
        "Use `curl -v` to see headers.",
        "Use a tool like Postman or VS Code REST Client to save the exchange.",
        "Inspect the response in the Network tab of your browser dev tools.",
      ],
      solution:
        "200 with `application/json` body for the GET; 404 (often with a ProblemDetails body in `[ApiController]`-decorated apps) for the bad path. The shape is identical regardless of endpoint.",
    },
    quiz: [
      {
        kind: "concept",
        question: "What does HTTP being 'stateless' mean for a backend developer?",
        options: [
          "The server cannot return any state in responses.",
          "Each request must carry the information needed to authorise and process it; the server does not remember previous requests unless we add explicit state.",
          "The server has no memory at all.",
          "Statelessness only applies to GET requests.",
        ],
        correctAnswer:
          "Each request must carry the information needed to authorise and process it; the server does not remember previous requests unless we add explicit state.",
        explanation:
          "State (cookies, tokens, sessions) must be carried by the client or stored on the server explicitly — never assumed.",
      },
      {
        kind: "code-reading",
        question:
          "Given the curl command in the example, which HTTP method does the server receive?",
        options: ["GET", "POST", "PUT", "DELETE"],
        correctAnswer: "POST",
        explanation: "`-X POST` sets the method; the body is sent as JSON.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is wrong with this server-side reasoning?\n```csharp\npublic IActionResult Get()\n{\n    // 'this is the second request from the user, so they must be authenticated'\n    return Ok(_user.Profile);\n}\n```",
        options: [
          "Nothing.",
          "It assumes state across requests; HTTP is stateless, so 'second request' is meaningless without a token, cookie, or session.",
          "`Ok` cannot return profile data.",
          "`Get` should be `Post`.",
        ],
        correctAnswer:
          "It assumes state across requests; HTTP is stateless, so 'second request' is meaningless without a token, cookie, or session.",
        explanation:
          "Identity must come from the request — `Authorization` header, cookie, etc. — not from inferred ordering.",
      },
      {
        kind: "interview",
        question:
          "How would you describe HTTP to a non-technical stakeholder?",
        options: [
          "A programming language for web browsers.",
          "A simple ask-and-answer protocol: the client makes a request, the server replies; both sides speak the same agreed format.",
          "A type of database.",
          "A JavaScript library.",
        ],
        correctAnswer:
          "A simple ask-and-answer protocol: the client makes a request, the server replies; both sides speak the same agreed format.",
        explanation:
          "Keep the analogy concrete and stay away from jargon — that is what stakeholders need.",
      },
    ],
  },

  "http-methods": {
    whyItMatters:
      "Pick the wrong method and your endpoint behaves correctly but plays badly with caches, proxies, retries, and CSRF protection. The method is part of the contract.",
    simpleExplanation:
      "HTTP methods describe intent: GET reads, POST creates, PUT replaces, PATCH updates, DELETE removes.",
    deepExplanation:
      "Two properties matter beyond intent. Safety: GET, HEAD, OPTIONS must not change state — a proxy can call them freely. Idempotency: PUT and DELETE called twice should have the same effect as once. POST is neither safe nor idempotent. Choosing methods deliberately means your API plays well with retries, caches, and any infrastructure that treats methods as semantic hints.",
    realWorldUsage:
      "`GET /orders/{id}` reads. `POST /orders` creates and returns 201 + Location. `PUT /orders/{id}` replaces the order with the supplied body. `PATCH /orders/{id}` applies a partial update. `DELETE /orders/{id}` removes.",
    explainLikeBeginner:
      "The method is the verb. 'I want to read' = GET. 'I want to add' = POST. 'I want to remove' = DELETE.",
    interviewAnswer:
      "HTTP methods communicate intent and carry contract properties: GET is safe, PUT and DELETE are idempotent, POST is neither. Choosing the right method aligns the endpoint with what proxies, retries, and tooling expect.",
    commonMistakes: [
      "Using POST for everything, including reads — caches and CDNs ignore the response.",
      "Making GET mutate state — proxies and prefetchers will fire it without consent.",
      "Treating PUT and PATCH as interchangeable.",
    ],
    bestPractices: [
      "Use the method that matches the operation's semantics.",
      "Keep GET safe; never mutate state inside one.",
      "Document whether PUT replaces fully or partially (use PATCH for partial).",
    ],
    summary: [
      "GET reads, POST creates, PUT replaces, PATCH partial-updates, DELETE removes.",
      "Safety and idempotency are first-class properties.",
      "The method is a contract, not a label.",
    ],
    codeExample: {
      title: "Five methods on a resource",
      code: `[ApiController, Route("orders")]
public class OrdersController : ControllerBase
{
    [HttpGet("{id:guid}")]    public Task<ActionResult<OrderResponse>> Get(Guid id) => /* read */;
    [HttpPost]                public Task<ActionResult<OrderResponse>> Create(CreateOrderRequest r) => /* create */;
    [HttpPut("{id:guid}")]    public Task<IActionResult> Replace(Guid id, ReplaceOrderRequest r) => /* full replace */;
    [HttpPatch("{id:guid}")]  public Task<IActionResult> Patch(Guid id, PatchOrderRequest r) => /* partial */;
    [HttpDelete("{id:guid}")] public Task<IActionResult> Delete(Guid id) => /* remove */;
}`,
      output: "(five distinct routes, each matching the HTTP method to its purpose)",
      walkthrough: [
        "Each attribute pins the method to one action.",
        "PUT replaces the whole resource; PATCH updates the fields supplied.",
        "DELETE returns 204 on success; GET returns 200 with body; POST returns 201.",
      ],
    },
    practice: {
      prompt:
        "On a `/customers` resource implement all five methods. Verify that GET is safe (calling it twice never changes data) and that DELETE is idempotent (calling it twice yields the same end state).",
      expectedResult: "Each method behaves as the contract demands.",
      hints: [
        "Capture before/after state for GET.",
        "DELETE twice should yield 204 then 204 (or 404 depending on convention).",
        "Test PUT replaces and PATCH does not.",
      ],
      solution:
        "After verification you can articulate the contract for each method, not just the syntax. That difference is what an interview is checking for.",
    },
    quiz: [
      {
        kind: "concept",
        question: "Which methods are idempotent according to the HTTP spec?",
        options: ["GET, POST, DELETE", "GET, PUT, DELETE", "POST, PATCH", "All of them"],
        correctAnswer: "GET, PUT, DELETE",
        explanation:
          "GET is safe and idempotent; PUT and DELETE are idempotent. POST and PATCH are generally not.",
      },
      {
        kind: "code-reading",
        question:
          "What status code does the example's POST action typically return for a successful create?",
        options: ["200 OK", "201 Created", "204 No Content", "202 Accepted"],
        correctAnswer: "201 Created",
        explanation:
          "Resource creation returns 201 with a Location header pointing at the new resource.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is wrong with this endpoint?\n```csharp\n[HttpGet(\"orders/{id}/cancel\")]\npublic IActionResult Cancel(Guid id) { _orders.Cancel(id); return Ok(); }\n```",
        options: [
          "Nothing.",
          "It uses GET to mutate state — prefetchers, link previews, and proxies may call this URL without consent.",
          "`Cancel` should be `async`.",
          "The route is wrong.",
        ],
        correctAnswer:
          "It uses GET to mutate state — prefetchers, link previews, and proxies may call this URL without consent.",
        explanation:
          "Use POST or DELETE for actions that change state; GET must be safe.",
      },
      {
        kind: "interview",
        question: "Why is the difference between PUT and PATCH worth caring about?",
        options: [
          "There is no real difference.",
          "PUT semantically replaces the entire resource with the supplied body; PATCH applies a partial update. Mixing them leads to silently lost fields on PUT or rejected requests on PATCH.",
          "PATCH is faster.",
          "PUT is older.",
        ],
        correctAnswer:
          "PUT semantically replaces the entire resource with the supplied body; PATCH applies a partial update. Mixing them leads to silently lost fields on PUT or rejected requests on PATCH.",
        explanation:
          "Pick one per endpoint and document the contract. JSON Patch or JSON Merge Patch formalise PATCH bodies.",
      },
    ],
  },

  headers: {
    whyItMatters:
      "Headers carry the meta-information that turns a blob of bytes into a meaningful request: who is calling, what format the body uses, what the caller will accept back.",
    simpleExplanation:
      "Headers are key-value pairs attached to a request or response. They describe content, authorisation, caching, tracing, and more.",
    deepExplanation:
      'A handful of headers matter most as a junior. `Content-Type` says how to parse the body. `Accept` says what the client will accept back. `Authorization` carries a token. `Cache-Control` controls caching. `Idempotency-Key` lets clients retry safely. Custom `X-*` headers carry app-specific metadata. ASP.NET Core exposes them as `Request.Headers["..."]`, and `[FromHeader]` binds them onto action parameters.',
    realWorldUsage:
      "An API consumer sends `Authorization: Bearer eyJhbGc...` and `Content-Type: application/json`. The server validates the token, parses the JSON, and returns `Content-Type: application/json` with the response body.",
    explainLikeBeginner:
      "Headers are the labels on a package: who it is from, how to open it, where it is going. The contents are in the body.",
    interviewAnswer:
      "Headers carry meta-information about a request or response — content negotiation, authentication, caching, tracing. Many infrastructure pieces (proxies, gateways, CDNs) decide what to do based on headers alone, so getting them right is as important as the body.",
    commonMistakes: [
      "Reading headers case-sensitively — HTTP headers are case-insensitive.",
      "Forgetting `Content-Type` and being surprised when JSON binding fails.",
      "Putting credentials in the URL instead of the `Authorization` header (they end up in logs).",
    ],
    bestPractices: [
      "Use `[FromHeader(Name = \"X-Idempotency-Key\")]` to bind headers explicitly.",
      "Treat `Authorization` as the only secret-bearing header; never log it raw.",
      "Set `Cache-Control` deliberately on responses that should not be cached.",
    ],
    summary: [
      "Headers describe; the body carries data.",
      "Content negotiation, auth, caching all live in headers.",
      "Bind headers explicitly with `[FromHeader]` for clarity.",
    ],
    codeExample: {
      title: "Reading a custom header",
      code: `[HttpPost]
public async Task<IActionResult> Create(
    CreateOrderRequest req,
    [FromHeader(Name = "X-Idempotency-Key")] string? idempotencyKey)
{
    if (string.IsNullOrWhiteSpace(idempotencyKey))
        return BadRequest("X-Idempotency-Key required.");

    var id = await _orders.CreateAsync(req, idempotencyKey);
    return Created($"/orders/{id}", new { id });
}`,
      output: `POST /orders   with X-Idempotency-Key: abc-123   ->   201 Created
POST /orders   without that header               ->   400 Bad Request`,
      walkthrough: [
        "`[FromHeader]` binds the header into a parameter.",
        "Missing header → explicit 400, not a NullReferenceException later.",
        "Header-driven idempotency is a common pattern for safe retries.",
      ],
    },
    practice: {
      prompt:
        "Add `X-Correlation-Id` support: read it from the request via `[FromHeader]`, generate one if missing, store it in `HttpContext.Items`, and echo it back on the response.",
      expectedResult:
        "Every request has a correlation id you can grep in logs across services.",
      hints: [
        "Use middleware to set the response header before the body is written.",
        "Generate with `Guid.NewGuid().ToString(\"N\")`.",
        "Test with curl `-H \"X-Correlation-Id: 123\"` and without it.",
      ],
      solution:
        "Middleware reads or generates the id, attaches it to logs and response headers. Distributed tracing becomes possible with a one-file change.",
    },
    quiz: [
      {
        kind: "concept",
        question: "Which header tells the server how to parse the request body?",
        options: ["Accept", "Authorization", "Content-Type", "Cache-Control"],
        correctAnswer: "Content-Type",
        explanation:
          "`Content-Type` says what the body is. `Accept` says what the client will accept back. Both matter, but only `Content-Type` answers this question.",
      },
      {
        kind: "code-reading",
        question:
          "Given `[FromHeader(Name = \"X-Idempotency-Key\")] string? idempotencyKey`, what is the value when the client omits the header?",
        options: [
          "An empty string.",
          "`null`.",
          "A 400 Bad Request is returned automatically.",
          "A random Guid.",
        ],
        correctAnswer: "`null`.",
        explanation:
          "Optional headers bind to `null` (or the type's default). Make the policy explicit yourself, as the example does.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is wrong here?\n```csharp\nvar token = Request.Headers[\"AUTHORIZATION\"].ToString();\n```",
        options: [
          "Headers are case-insensitive, so this works, but using the casing `\"Authorization\"` is the convention; the real bug is logging or returning `token` could leak credentials.",
          "Nothing.",
          "`Request.Headers` cannot be indexed.",
          "`.ToString()` is illegal here.",
        ],
        correctAnswer:
          "Headers are case-insensitive, so this works, but using the casing `\"Authorization\"` is the convention; the real bug is logging or returning `token` could leak credentials.",
        explanation:
          "The code reads correctly, but credentials must never appear in logs or telemetry.",
      },
      {
        kind: "interview",
        question:
          "Why prefer `[FromHeader]` binding over reading `Request.Headers` directly?",
        options: [
          "It is faster.",
          "It is explicit at the action signature, gets validation/binding for free, and surfaces missing headers as a model-binding error rather than a `NullReferenceException` deeper inside the code.",
          "It is required by ASP.NET Core.",
          "There is no real benefit.",
        ],
        correctAnswer:
          "It is explicit at the action signature, gets validation/binding for free, and surfaces missing headers as a model-binding error rather than a `NullReferenceException` deeper inside the code.",
        explanation:
          "Explicit binding makes the API contract visible at the method signature.",
      },
    ],
  },

  body: {
    whyItMatters:
      "The body is where most real data lives. Misreading it — wrong content type, wrong encoding, wrong shape — is a daily source of bugs at the API boundary.",
    simpleExplanation:
      "The request body is the payload sent with POST/PUT/PATCH. It is typically JSON for modern APIs.",
    deepExplanation:
      "ASP.NET Core binds the body to a parameter marked `[FromBody]` (implicit on `[ApiController]` actions). The framework uses `System.Text.Json` to deserialise, which means property names must match the JSON casing (camelCase by default in newer versions). Large bodies stream; binary bodies bypass JSON. Always set `Content-Type` correctly on the client side or the binder will reject the payload.",
    realWorldUsage:
      "A POST `/orders` carries `{ \"customerId\": \"...\", \"lines\": [...] }`. ASP.NET Core deserialises it into `CreateOrderRequest` automatically.",
    explainLikeBeginner:
      "The body is the contents of the letter; the headers are the envelope.",
    interviewAnswer:
      "The body carries the request payload, typically JSON in modern APIs. ASP.NET Core uses `System.Text.Json` by default; properties bind by name with camelCase convention. For large or binary content we stream rather than buffer.",
    commonMistakes: [
      "Posting JSON without `Content-Type: application/json` and getting a 415 Unsupported Media Type.",
      "Using PascalCase on the wire and being surprised it does not bind.",
      "Buffering large bodies fully into memory instead of streaming.",
    ],
    bestPractices: [
      "Validate body shape via the DTO; reject early.",
      "Use streaming for large uploads (`PipeReader`, `IFormFile`).",
      "Be explicit about the JSON casing policy in `Program.cs`.",
    ],
    summary: [
      "The body carries payload; the framework deserialises into your DTO.",
      "Content-Type must match the body format.",
      "Stream large bodies; do not buffer everything.",
    ],
    codeExample: {
      title: "Reading a JSON body via a DTO",
      code: `public record CreateOrderRequest(Guid CustomerId, List<OrderLineRequest> Lines);

[HttpPost]
public async Task<IActionResult> Create([FromBody] CreateOrderRequest req)
{
    var id = await _orders.CreateAsync(req);
    return Created($"/orders/{id}", new { id });
}`,
      output: `POST /orders
Content-Type: application/json
{"customerId":"...","lines":[{"sku":"A","quantity":1}]}

-> 201 Created  Location: /orders/8f3...`,
      walkthrough: [
        "`[FromBody]` (implicit with `[ApiController]`) binds the JSON to the DTO.",
        "Property names are case-insensitive by default; conventionally camelCase on the wire.",
        "Missing or malformed JSON returns 400 with ProblemDetails.",
      ],
    },
    practice: {
      prompt:
        "Build a POST endpoint that accepts a JSON body with `title` and `tags` (an array of strings). Reject if `tags` is missing or empty. Verify with two curl calls: one valid, one invalid.",
      expectedResult: "Validation rejects bad shape with 400; valid payloads succeed.",
      hints: [
        "Use `[MinLength(1)]` on `tags`.",
        "Set `Content-Type: application/json` in curl.",
        "Try both with and without `[ApiController]` to see automatic vs manual ModelState.",
      ],
      solution:
        "Declarative validation handles the easy case; the action body trusts the input. Status codes follow the convention.",
    },
    quiz: [
      {
        kind: "concept",
        question: "What does the server need to deserialise a JSON request body?",
        options: [
          "Only the body bytes.",
          "The body plus a `Content-Type: application/json` header so the framework selects the JSON formatter.",
          "An `Authorization` header.",
          "Nothing — the framework guesses.",
        ],
        correctAnswer:
          "The body plus a `Content-Type: application/json` header so the framework selects the JSON formatter.",
        explanation:
          "Without the right content type, ASP.NET Core returns 415 Unsupported Media Type.",
      },
      {
        kind: "code-reading",
        question:
          "Given the DTO `record CreateOrderRequest(Guid CustomerId, ...)`, which JSON binds correctly by default in modern .NET?",
        options: [
          `{"CustomerId":"..."}`,
          `{"customer_id":"..."}`,
          `{"customerId":"..."}`,
          `{"CUSTOMERID":"..."}`,
        ],
        correctAnswer: `{"customerId":"..."}`,
        explanation:
          "`System.Text.Json` defaults to camelCase property name policy; the binding is case-insensitive but the convention is camelCase.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is wrong with this code?\n```csharp\n[HttpPost]\npublic async Task<IActionResult> Upload(IFormFile file)\n{\n    using var ms = new MemoryStream();\n    await file.CopyToAsync(ms); // 200MB file\n    var bytes = ms.ToArray();\n    return Ok();\n}\n```",
        options: [
          "Nothing.",
          "It buffers a 200MB upload fully into memory before processing — a memory-exhaustion risk under load.",
          "`CopyToAsync` does not exist.",
          "`IFormFile` cannot be a parameter.",
        ],
        correctAnswer:
          "It buffers a 200MB upload fully into memory before processing — a memory-exhaustion risk under load.",
        explanation:
          "Stream large uploads to disk or blob storage via `file.OpenReadStream()` instead of buffering.",
      },
      {
        kind: "interview",
        question:
          "How would you handle a `415 Unsupported Media Type` returned from your API?",
        options: [
          "Restart the service.",
          "Check that the client is sending the correct `Content-Type` header for the body format — usually `application/json` for JSON APIs.",
          "Disable model binding.",
          "Switch to XML.",
        ],
        correctAnswer:
          "Check that the client is sending the correct `Content-Type` header for the body format — usually `application/json` for JSON APIs.",
        explanation:
          "415 is the server saying 'I do not have a formatter for this content type'. The fix is on the client.",
      },
    ],
  },

  "query-parameters": {
    whyItMatters:
      "Query parameters power filtering, paging, and sorting — the daily ergonomics of a usable API. Misuse them and your URLs become opaque, your endpoints over-specified, and your cache keys explode.",
    simpleExplanation:
      "Query parameters are the `?key=value&key=value` part of a URL. They are part of the GET request and visible in logs.",
    deepExplanation:
      "Use them for filtering, sorting, and pagination — anything that refines a GET. Do not use them for credentials or large payloads (they appear in browser history, server logs, and reverse proxies). ASP.NET Core binds them automatically by parameter name, or explicitly with `[FromQuery]`. Pagination conventions: `?page=2&pageSize=20` or cursor-based (`?cursor=...&limit=20`). Pick one and stick with it.",
    realWorldUsage:
      "`GET /orders?status=Confirmed&page=2&pageSize=20` returns confirmed orders, second page, 20 per page.",
    explainLikeBeginner:
      "The query string is like extra notes on a request: 'and show me only the ones from this week'.",
    interviewAnswer:
      "Query parameters are the URL's `?key=value` segment, used for filtering, sorting, and pagination on safe GET requests. They bind automatically in ASP.NET Core via parameter names or `[FromQuery]`, and they should never carry credentials because they end up in logs.",
    commonMistakes: [
      "Putting secrets in the query string — they appear in browser history, server logs, and CDN traces.",
      "Inconsistent paging conventions across endpoints.",
      "Building giant query strings of 50+ filters instead of accepting a POST + search DTO for complex queries.",
    ],
    bestPractices: [
      "Bind a single `[FromQuery]` DTO for endpoints with many filters.",
      "Apply a server-side max on `pageSize` to prevent abuse.",
      "Document each parameter; treat the URL as part of the public contract.",
    ],
    summary: [
      "Query strings filter, sort, and paginate GETs.",
      "Never carry credentials in them.",
      "Bind to a DTO when you have more than a couple of parameters.",
    ],
    codeExample: {
      title: "Filter + page via a query DTO",
      code: `public record OrderListQuery(string? Status, int Page = 1, int PageSize = 20);

[HttpGet]
public async Task<ActionResult<PagedResponse<OrderResponse>>> List(
    [FromQuery] OrderListQuery query)
{
    var size = Math.Min(query.PageSize, 100); // cap
    return Ok(await _orders.ListAsync(query.Status, query.Page, size));
}`,
      output: `GET /orders?status=Confirmed&page=2&pageSize=20

{"items":[...],"page":2,"pageSize":20,"total":143}`,
      walkthrough: [
        "All filters bind from the query string into one DTO.",
        "A server-side cap defends against `pageSize=10000` abuse.",
        "The response embeds paging metadata.",
      ],
    },
    practice: {
      prompt:
        "Build `GET /products` supporting `?category=...&minPrice=...&maxPrice=...&page=...&pageSize=...`. Return a paged response with items and total count.",
      expectedResult: "Filters compose, paging works, and `pageSize` cannot exceed a server cap.",
      hints: [
        "Bind a `ProductListQuery` DTO with `[FromQuery]`.",
        "Cap `pageSize` server-side.",
        "Test with combinations of filters via curl.",
      ],
      solution:
        "One DTO, one action, server-side cap, paged response. The endpoint is composable and safe under abuse.",
    },
    quiz: [
      {
        kind: "concept",
        question: "Where should pagination parameters live?",
        options: [
          "In the request body.",
          "In headers.",
          "In the query string of a GET request, conventionally as `?page=...&pageSize=...` or via a cursor.",
          "In a cookie.",
        ],
        correctAnswer:
          "In the query string of a GET request, conventionally as `?page=...&pageSize=...` or via a cursor.",
        explanation:
          "GETs are safe and cacheable; query parameters are the canonical place for filters.",
      },
      {
        kind: "code-reading",
        question:
          "Why is `[FromQuery] OrderListQuery query` better than five separate parameters?",
        options: [
          "It binds faster.",
          "It groups related filters, documents them as one type, and lets you evolve the query (defaults, validation) without changing the action signature.",
          "It is the only legal form.",
          "It avoids `[ApiController]`.",
        ],
        correctAnswer:
          "It groups related filters, documents them as one type, and lets you evolve the query (defaults, validation) without changing the action signature.",
        explanation:
          "Grouping into a DTO scales as the filter list grows.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is the risk?\n```csharp\n[HttpGet]\npublic async Task<...> List([FromQuery] int pageSize = 20)\n{\n    return Ok(await _orders.ListAsync(pageSize));\n}\n```",
        options: [
          "Nothing.",
          "The endpoint accepts `?pageSize=1000000` and tries to fetch a million rows — a DoS vector.",
          "`pageSize` cannot have a default.",
          "`async` is illegal here.",
        ],
        correctAnswer:
          "The endpoint accepts `?pageSize=1000000` and tries to fetch a million rows — a DoS vector.",
        explanation:
          "Cap `pageSize` server-side. Never trust the client to choose the bound.",
      },
      {
        kind: "interview",
        question: "Why should credentials never appear in a query string?",
        options: [
          "They have a maximum length.",
          "Because URLs end up in browser history, server access logs, and proxy/CDN traces — any of which could later leak the credential.",
          "Because GET is faster.",
          "There is no good reason.",
        ],
        correctAnswer:
          "Because URLs end up in browser history, server access logs, and proxy/CDN traces — any of which could later leak the credential.",
        explanation:
          "Use the `Authorization` header for tokens, never the URL.",
      },
    ],
  },

  "route-parameters": {
    whyItMatters:
      "Route parameters identify which resource is being acted on. Sloppy routes lead to ambiguous endpoints and 404s that look like 500s.",
    simpleExplanation:
      "Route parameters are the `/{id}` segments in a URL. They identify a specific resource.",
    deepExplanation:
      "Use route parameters for identifiers: `/orders/{id}`, `/customers/{customerId}/orders/{orderId}`. Apply type constraints (`{id:guid}`, `{id:int}`) so malformed values produce a 404 at route matching time rather than failing inside the action. Keep route segments stable; route parameters are part of the public contract just as much as query strings.",
    realWorldUsage:
      "`GET /orders/8f3a...` reads order `8f3a...`. `GET /customers/{customerId}/orders` lists orders for that customer.",
    explainLikeBeginner:
      "Route parameters are like room numbers in a hotel. The path tells you which exact room you want.",
    interviewAnswer:
      "Route parameters identify specific resources by placing the identifier in the URL path. We use type constraints to validate them at route-matching time, and we model nested resources by chaining segments (`/customers/{cid}/orders/{oid}`).",
    commonMistakes: [
      "Forgetting type constraints, so non-Guid values match the route and the action throws on parsing.",
      "Mixing identifiers and search filters in the path.",
      "Building deeply nested routes for unrelated relationships.",
    ],
    bestPractices: [
      "Use type constraints (`{id:guid}`, `{id:int:min(1)}`) for identifiers.",
      "Limit nesting to one level when there is a true hierarchical relationship.",
      "Name parameters consistently across the API.",
    ],
    summary: [
      "Route parameters identify resources.",
      "Type constraints reject malformed routes early.",
      "Routes are part of the public contract.",
    ],
    codeExample: {
      title: "Typed route parameter",
      code: `[HttpGet("orders/{id:guid}")]
public async Task<ActionResult<OrderResponse>> Get(Guid id)
{
    var order = await _orders.GetAsync(id);
    return order is null ? NotFound() : Ok(order);
}`,
      output: `GET /orders/8f3...   200 OK   { ... }
GET /orders/not-a-guid   404 Not Found  (route did not match)
GET /orders/00000000-...   404 Not Found  (action returned)`,
      walkthrough: [
        "`{id:guid}` rejects non-Guid paths at routing time.",
        "Inside the action we still handle the 'valid Guid but no such record' case.",
        "Two different 404s — one from routing, one from the action — for two different reasons.",
      ],
    },
    practice: {
      prompt:
        "Define `GET /customers/{customerId:guid}/orders/{orderId:guid}` returning a single order if it belongs to that customer. Return 404 otherwise.",
      expectedResult:
        "Routing accepts only Guids; the action enforces the customer/order relationship.",
      hints: [
        "Use two `[HttpGet]` route parameters.",
        "Return `NotFound()` when the order does not belong to the customer.",
        "Test with mismatched ids.",
      ],
      solution:
        "Route constraints filter bad input early; the action body asserts the business relationship. Two layers of defence with one explicit contract.",
    },
    quiz: [
      {
        kind: "concept",
        question: "What does the `:guid` in `[HttpGet(\"orders/{id:guid}\")]` do?",
        options: [
          "It is documentation only.",
          "It is a route constraint: the route matches only when `id` parses as a Guid.",
          "It encrypts the route.",
          "It tells EF Core the column type.",
        ],
        correctAnswer:
          "It is a route constraint: the route matches only when `id` parses as a Guid.",
        explanation:
          "Constraints filter at route matching, so malformed identifiers never enter the action body.",
      },
      {
        kind: "code-reading",
        question:
          "Given the example, what does a request to `/orders/not-a-guid` return?",
        options: [
          "200 OK with an empty body.",
          "400 Bad Request from model binding.",
          "404 Not Found because the route did not match.",
          "500 Internal Server Error.",
        ],
        correctAnswer:
          "404 Not Found because the route did not match.",
        explanation:
          "Route constraints reject the path before any action runs.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is wrong with this endpoint?\n```csharp\n[HttpGet(\"orders/{id}\")]\npublic async Task<...> Get(string id)\n{\n    var g = Guid.Parse(id);\n    return Ok(await _orders.GetAsync(g));\n}\n```",
        options: [
          "Nothing.",
          "No route constraint — non-Guid values reach the action, `Guid.Parse` throws, and the user sees a 500 instead of a 404.",
          "`Guid.Parse` does not exist.",
          "`string id` should be `int`.",
        ],
        correctAnswer:
          "No route constraint — non-Guid values reach the action, `Guid.Parse` throws, and the user sees a 500 instead of a 404.",
        explanation:
          "Use `{id:guid}` and accept `Guid id` to handle this declaratively.",
      },
      {
        kind: "interview",
        question:
          "How deep should you nest routes for related resources?",
        options: [
          "As deep as the relationship goes.",
          "Usually one level: parent + child (`/customers/{id}/orders`). Deeper nesting often signals a missing query parameter or a top-level resource that should exist on its own.",
          "Never nest.",
          "Nesting is illegal.",
        ],
        correctAnswer:
          "Usually one level: parent + child (`/customers/{id}/orders`). Deeper nesting often signals a missing query parameter or a top-level resource that should exist on its own.",
        explanation:
          "Shallow nesting keeps URLs predictable; deeper hierarchies become awkward to evolve.",
      },
    ],
  },

  "status-codes": {
    whyItMatters:
      "The status code is the first thing a client checks. Wrong status codes turn every retry, alert, and dashboard into a guessing game.",
    simpleExplanation:
      "Status codes are three-digit numbers in the response that tell the client what happened: 2xx success, 3xx redirect, 4xx client error, 5xx server error.",
    deepExplanation:
      "Memorise a small set: 200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 422 Unprocessable Entity, 500 Internal Server Error, 503 Service Unavailable. The split between 401 and 403 is the one juniors most often get wrong: 401 means 'we do not know who you are', 403 means 'we know you but you are not allowed'. Use 409 for state conflicts (already exists, version conflict), 422 for semantic validation failures.",
    realWorldUsage:
      "`POST /orders` returns 201 on success, 400 on invalid shape, 409 if an `Idempotency-Key` is reused, 500 on unhandled exceptions.",
    explainLikeBeginner:
      "Status codes are like traffic lights: green (2xx) = go, yellow (3xx) = redirect, red (4xx/5xx) = something stopped.",
    interviewAnswer:
      "Status codes communicate the outcome of a request. 2xx is success, 4xx is the client's mistake, 5xx is the server's. The split between 401 and 403 is whether the client is authenticated; 409 expresses state conflicts and 422 expresses semantic validation failures.",
    commonMistakes: [
      "Returning 200 OK with an `error` field instead of a 4xx status code.",
      "Confusing 401 (not authenticated) with 403 (authenticated but unauthorised).",
      "Mapping every unhandled error to 500 instead of differentiating between client and server mistakes.",
    ],
    bestPractices: [
      "Use the most specific status code that describes the situation.",
      "Pair 4xx/5xx responses with a `ProblemDetails` body so the client can read structured error info.",
      "Never lie: do not return 200 for a failure.",
    ],
    summary: [
      "Status codes are the first signal a client reads.",
      "Pick the most specific code.",
      "401 ≠ 403, 409 ≠ 422, 400 ≠ 500.",
    ],
    codeExample: {
      title: "Status codes from a single action",
      code: `[HttpPost]
public async Task<IActionResult> Create(CreateOrderRequest req)
{
    try
    {
        var id = await _orders.CreateAsync(req);
        return Created($"/orders/{id}", new { id });        // 201
    }
    catch (DuplicateIdempotencyKeyException)
    {
        return Conflict(new ProblemDetails { Title = "Duplicate request" });  // 409
    }
    catch (DomainValidationException ex)
    {
        return UnprocessableEntity(new ProblemDetails { Title = ex.Message }); // 422
    }
}`,
      output: `Success    -> 201 Created
Replay     -> 409 Conflict
Rule fail  -> 422 Unprocessable Entity`,
      walkthrough: [
        "Each branch picks the status code that matches the situation.",
        "ProblemDetails gives the client structured info to display or log.",
        "Unhandled exceptions still produce 500 via middleware — that is the catch-all, not the default.",
      ],
    },
    practice: {
      prompt:
        "On `DELETE /products/{id}`, return 204 when found and deleted, 404 when not found. Then add an idempotent variant that returns 204 in both cases (delete is idempotent).",
      expectedResult: "You can articulate the trade-off between 404 vs 204 for delete.",
      hints: [
        "Convention varies; document your choice.",
        "Test both flows with curl.",
        "Return ProblemDetails for unexpected errors.",
      ],
      solution:
        "Idempotent delete returns 204 either way; strict delete returns 404 when the resource never existed. Either is valid — pick one and document it.",
    },
    quiz: [
      {
        kind: "concept",
        question:
          "Which status code is most appropriate when an unauthenticated client tries to access a protected endpoint?",
        options: ["400 Bad Request", "401 Unauthorized", "403 Forbidden", "404 Not Found"],
        correctAnswer: "401 Unauthorized",
        explanation:
          "401 = not authenticated; 403 = authenticated but not allowed. The standard signal is `WWW-Authenticate` on a 401.",
      },
      {
        kind: "code-reading",
        question:
          "Given the example, what does the controller return when `DuplicateIdempotencyKeyException` is thrown?",
        options: [
          "201 Created",
          "400 Bad Request",
          "409 Conflict",
          "500 Internal Server Error",
        ],
        correctAnswer: "409 Conflict",
        explanation: "`Conflict()` returns 409 with the supplied body.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is wrong with this response?\n```csharp\nreturn Ok(new { error = \"customer not found\" });\n```",
        options: [
          "Nothing.",
          "It returns 200 OK with an error payload; clients that branch on the status code will treat the failure as success.",
          "`Ok` should be `NotFound`.",
          "`new { error = ... }` is illegal.",
        ],
        correctAnswer:
          "It returns 200 OK with an error payload; clients that branch on the status code will treat the failure as success.",
        explanation:
          "Use the right status code (404 here). The body adds detail; the code carries the headline.",
      },
      {
        kind: "interview",
        question:
          "When would you choose 422 over 400?",
        options: [
          "They are interchangeable.",
          "400 = malformed request (wrong shape, wrong syntax); 422 = well-formed but semantically invalid (failed a business rule).",
          "422 is faster.",
          "422 is for redirects.",
        ],
        correctAnswer:
          "400 = malformed request (wrong shape, wrong syntax); 422 = well-formed but semantically invalid (failed a business rule).",
        explanation:
          "Splitting them helps clients tell 'I sent bad JSON' from 'I sent valid JSON but the rule rejected it'.",
      },
    ],
  },

  "json-request-and-response": {
    whyItMatters:
      "JSON is the lingua franca of HTTP APIs. Getting comfortable with how .NET serialises and deserialises it removes a daily source of friction.",
    simpleExplanation:
      "JSON is the text format used to represent request and response bodies in most APIs. .NET uses `System.Text.Json` to convert it to and from your C# types.",
    deepExplanation:
      "Defaults to know: camelCase property names on the wire, case-insensitive binding, `null` values are serialised by default, enums are numbers unless you configure otherwise. Customise via `JsonSerializerOptions` in `Program.cs` if you need PascalCase, string enums, or to ignore nulls. Records map cleanly because the constructor parameters match positional JSON.",
    realWorldUsage:
      "`POST /orders` accepts `{ \"customerId\": \"...\", \"lines\": [...] }`. The framework deserialises into `CreateOrderRequest`. The response is serialised back to JSON automatically.",
    explainLikeBeginner:
      "JSON is just text that describes data. `System.Text.Json` is the translator between that text and your C# objects.",
    interviewAnswer:
      "JSON is the default request/response format in modern .NET APIs. The framework uses `System.Text.Json` with camelCase by default; we configure it in `Program.cs` for project-wide policies like string enums or null handling.",
    commonMistakes: [
      "Setting property names PascalCase on the wire and being surprised when clients expecting camelCase break.",
      "Serialising large nested object graphs that include navigation properties — leading to cycles.",
      "Using `DateTime` everywhere and discovering ambiguous time-zone behaviour.",
    ],
    bestPractices: [
      "Use `DateTimeOffset` (or pure UTC) over `DateTime` in DTOs.",
      "Configure string-enum serialisation if your API uses enums.",
      "Be explicit about null handling (`DefaultIgnoreCondition`).",
    ],
    summary: [
      "JSON is the default wire format.",
      "`System.Text.Json` camelCase, case-insensitive, on by default.",
      "Pick `DateTimeOffset` and string enums for sanity.",
    ],
    codeExample: {
      title: "Configure JSON serialisation",
      code: `// Program.cs
builder.Services.AddControllers()
    .AddJsonOptions(opts =>
    {
        opts.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        opts.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        opts.JsonSerializerOptions.DefaultIgnoreCondition =
            JsonIgnoreCondition.WhenWritingNull;
    });

public record OrderResponse(Guid Id, OrderStatus Status, DateTimeOffset CreatedAt);
public enum OrderStatus { Pending, Confirmed, Cancelled }`,
      output: `{"id":"8f3...","status":"Confirmed","createdAt":"2025-05-12T14:00:00+00:00"}`,
      walkthrough: [
        "Project-wide policies set once, applied everywhere.",
        "Enums serialise as strings — easier for clients to read.",
        "Nulls are dropped from the wire when configured.",
      ],
    },
    practice: {
      prompt:
        "Configure a service-wide JSON policy: string enums, ignore nulls, camelCase. Verify with a tiny endpoint that returns a record with an enum and a nullable field.",
      expectedResult:
        "Enum appears as a string; null fields are absent from the response body.",
      hints: [
        "Set `JsonStringEnumConverter` in `Program.cs`.",
        "Use `JsonIgnoreCondition.WhenWritingNull`.",
        "Inspect with curl `-i` to see the serialised body.",
      ],
      solution:
        "Centralised JSON configuration makes the wire format consistent. New endpoints inherit the policy without per-action ceremony.",
    },
    quiz: [
      {
        kind: "concept",
        question:
          "By default, how does `System.Text.Json` name properties on the wire?",
        options: ["PascalCase", "camelCase", "snake_case", "kebab-case"],
        correctAnswer: "camelCase",
        explanation:
          "ASP.NET Core wires `JsonNamingPolicy.CamelCase` by default for property names.",
      },
      {
        kind: "code-reading",
        question:
          "Given the configuration in the example, how is `OrderStatus.Confirmed` serialised?",
        options: [
          "As the integer `1`.",
          "As the string `\"Confirmed\"`.",
          "As `null`.",
          "It throws.",
        ],
        correctAnswer: "As the string `\"Confirmed\"`.",
        explanation:
          "`JsonStringEnumConverter` makes enums serialise as their string names.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is the risk in this DTO?\n```csharp\npublic record AuditResponse(DateTime Occurred, string Action);\n```",
        options: [
          "Nothing.",
          "`DateTime` does not carry an offset, so the wire value can be interpreted differently by clients in different time zones; prefer `DateTimeOffset` or always-UTC `DateTime`.",
          "`Action` should be an enum.",
          "Records cannot have `DateTime` fields.",
        ],
        correctAnswer:
          "`DateTime` does not carry an offset, so the wire value can be interpreted differently by clients in different time zones; prefer `DateTimeOffset` or always-UTC `DateTime`.",
        explanation:
          "Time-zone bugs are silent until they bite. `DateTimeOffset` is the safe default for cross-system timestamps.",
      },
      {
        kind: "interview",
        question:
          "Why prefer string-serialised enums in an API?",
        options: [
          "They are faster.",
          "They are self-documenting in the wire format, survive reordering of enum members, and are easier for non-.NET clients to consume.",
          "Integer enums are not supported.",
          "It is the only legal way.",
        ],
        correctAnswer:
          "They are self-documenting in the wire format, survive reordering of enum members, and are easier for non-.NET clients to consume.",
        explanation:
          "Integer enums make wire payloads fragile to refactor: reordering values silently changes meaning.",
      },
    ],
  },

  "postman-examples": {
    whyItMatters:
      "Postman is the daily driver for testing APIs by hand. Knowing how to set up collections, environments, and tests saves hours of debugging.",
    simpleExplanation:
      "Postman is a GUI for crafting HTTP requests, organising them into collections, and running quick tests.",
    deepExplanation:
      "Build a collection per service. Use environments to switch between local, staging, and prod (`{{baseUrl}}/orders`). Use pre-request scripts to fetch a token; save it in a collection variable. Use the `Tests` tab to assert on status codes and body shape — `pm.test(\"is 200\", () => pm.response.to.have.status(200));`. A well-maintained collection is documentation that runs.",
    realWorldUsage:
      "Your team's `MyService` collection has `auth/login`, `orders/create`, `orders/get`. New hires import it, point at the dev environment, and exercise the API on day one.",
    explainLikeBeginner:
      "Postman is the spreadsheet for API calls. Each row is a request you can save, share, and rerun.",
    interviewAnswer:
      "Postman is the tool we use for ad-hoc API testing. We organise requests into collections, use environments for `baseUrl` and tokens, and write small JavaScript tests on the response to catch regressions when running the collection in CI.",
    commonMistakes: [
      "Hard-coding the host in every request — environments exist for that.",
      "Storing real tokens in shared collections — they end up in version control or screenshots.",
      "Skipping the Tests tab and never asserting against the response.",
    ],
    bestPractices: [
      "Use `{{baseUrl}}` and environment-scoped variables.",
      "Add a `Tests` block with at least a status-code assertion.",
      "Run the collection from CLI with Newman to catch contract drift.",
    ],
    summary: [
      "Postman organises requests into shareable collections.",
      "Environments and variables prevent host hard-coding.",
      "Tests make each request a tiny contract check.",
    ],
    codeExample: {
      title: "Postman: POST /orders with assertion",
      code: `// Request
POST {{baseUrl}}/orders
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "customerId": "{{customerId}}",
  "lines": [{ "sku": "SKU-001", "quantity": 1 }]
}

// Tests (JavaScript)
pm.test("status is 201", () => pm.response.to.have.status(201));
pm.test("returns an id", () => {
    const body = pm.response.json();
    pm.expect(body.id).to.be.a("string");
});`,
      output: `Status: 201 Created
Tests
  ✓ status is 201
  ✓ returns an id`,
      walkthrough: [
        "Variables (`{{baseUrl}}`, `{{token}}`) come from the active environment.",
        "The Tests tab runs after the response and reports pass/fail.",
        "These assertions are runnable as Newman jobs in CI.",
      ],
    },
    practice: {
      prompt:
        "Create a Postman collection for `/customers` with create, get, list, delete. Add a `local` environment and tests on each request asserting the expected status code.",
      expectedResult:
        "Running the collection end-to-end against a local service exits clean.",
      hints: [
        "Chain requests by using `pm.collectionVariables.set(\"id\", body.id)` in Tests.",
        "Use the runner to execute in order.",
        "Export the collection JSON into the repo.",
      ],
      solution:
        "The collection now doubles as smoke tests. Add Newman to CI and you have a contract check on every merge.",
    },
    quiz: [
      {
        kind: "concept",
        question: "What is the main purpose of Postman environments?",
        options: [
          "To replace the .NET runtime.",
          "To swap variables (base URLs, tokens) between local, staging, and production without editing each request.",
          "To deploy the API.",
          "There is no purpose.",
        ],
        correctAnswer:
          "To swap variables (base URLs, tokens) between local, staging, and production without editing each request.",
        explanation:
          "Environments separate configuration from request definitions, the same way `.env` files separate config from code.",
      },
      {
        kind: "code-reading",
        question:
          "What does `pm.response.to.have.status(201)` do inside a Postman test?",
        options: [
          "Sets the response status.",
          "Asserts that the response has HTTP status 201; the test passes when true and fails the run when false.",
          "Sends a new request.",
          "It is invalid syntax.",
        ],
        correctAnswer:
          "Asserts that the response has HTTP status 201; the test passes when true and fails the run when false.",
        explanation:
          "Postman's `chai`-style assertions read naturally and integrate into the run report.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is risky about this request in a shared collection?\n```text\nPOST https://api.production.example.com/orders\nAuthorization: Bearer eyJhbGciOi...\n```",
        options: [
          "Nothing.",
          "It hard-codes the production host and includes a real token — pushing the collection to a repo leaks both.",
          "POST cannot be used here.",
          "The body is missing.",
        ],
        correctAnswer:
          "It hard-codes the production host and includes a real token — pushing the collection to a repo leaks both.",
        explanation:
          "Use environment variables (`{{baseUrl}}`, `{{token}}`) and never commit secrets.",
      },
      {
        kind: "interview",
        question: "How would you turn a Postman collection into CI smoke tests?",
        options: [
          "You cannot.",
          "Export the collection and environment, then run them with Newman (`newman run ...`) in your CI pipeline; assertions in the Tests tab become pass/fail signals.",
          "Import them into ASP.NET Core.",
          "Rewrite them in C#.",
        ],
        correctAnswer:
          "Export the collection and environment, then run them with Newman (`newman run ...`) in your CI pipeline; assertions in the Tests tab become pass/fail signals.",
        explanation:
          "Newman is Postman's CLI; it makes collections part of your automated suite.",
      },
    ],
  },

  "curl-examples": {
    whyItMatters:
      "curl is the universal way to test an HTTP endpoint from any terminal, any machine. SSH into a server, run a curl, see what the service really returns.",
    simpleExplanation:
      "curl is a command-line HTTP client. Type the method, headers, and body; it sends the request and prints the response.",
    deepExplanation:
      "Flags to know: `-X METHOD` for the verb, `-H \"name: value\"` for a header, `-d '...'` for a JSON body (combine with `-H 'Content-Type: application/json'`), `-i` to include headers in output, `-v` for the full exchange, `--data-binary` for binary, `-u user:pass` for basic auth. Pipe through `jq` to read JSON responses.",
    realWorldUsage:
      "From a CI script: `curl -fsSL -H \"Authorization: Bearer $TOKEN\" $BASE/health` exits non-zero on 4xx/5xx, perfect for deployment smoke tests.",
    explainLikeBeginner:
      "curl is typing an HTTP request by hand. You see the wire, no GUI in the way.",
    interviewAnswer:
      "curl is the simplest HTTP client available everywhere. We use it for smoke tests, scripted health checks, and reproducing bugs because it forces an exact, copy-pasteable request.",
    commonMistakes: [
      "Forgetting `-H 'Content-Type: application/json'` and being surprised when the server returns 415.",
      "Single-quoting on Windows PowerShell and getting parsing errors — use `\"...\"` and escape inner quotes.",
      "Returning 200 silently in scripts — use `-f` so curl exits non-zero on errors.",
    ],
    bestPractices: [
      "Pair `-i` (response headers) with `-v` (full exchange) when debugging.",
      "Use `--fail` (`-f`) so curl exits non-zero on 4xx/5xx — vital in scripts.",
      "Pipe to `jq` for readable JSON output.",
    ],
    summary: [
      "curl is universal and reproducible.",
      "Flags: `-X`, `-H`, `-d`, `-i`, `-v`, `-f`.",
      "Pair with `jq` for JSON, with `-f` for scripts.",
    ],
    codeExample: {
      title: "Common curl shapes",
      code: `# GET with headers
curl -i http://localhost:5000/orders/8f3 -H "Authorization: Bearer $TOKEN"

# POST JSON
curl -i -X POST http://localhost:5000/orders \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"customerId":"...","lines":[{"sku":"A","quantity":1}]}'

# Script-safe (non-zero on 4xx/5xx)
curl -fsSL http://localhost:5000/health || echo "health check failed"`,
      output: `HTTP/1.1 201 Created
Location: /orders/8f3...
{"id":"8f3..."}`,
      walkthrough: [
        "Headers and body are explicit on the command line.",
        "`-f` makes the command honest about failures — important in CI.",
        "Mix with `jq` to extract fields: `curl ... | jq '.id'`.",
      ],
    },
    practice: {
      prompt:
        "From the terminal, exercise the GET, POST, PUT, and DELETE endpoints of your service with curl. Capture status codes by adding `-w \"%{http_code}\\n\"`.",
      expectedResult:
        "You can describe the response of each method without opening a GUI.",
      hints: [
        "Save tokens to an environment variable.",
        "Use `-X POST -d @body.json` to send a file as the body.",
        "Test the failure paths too.",
      ],
      solution:
        "After this drill curl becomes a reflex. You can copy a failing call from a teammate's terminal and reproduce it locally in seconds.",
    },
    quiz: [
      {
        kind: "concept",
        question:
          "Which flag makes curl exit with a non-zero status on 4xx/5xx responses?",
        options: ["-v", "-i", "-f (or --fail)", "-X"],
        correctAnswer: "-f (or --fail)",
        explanation:
          "Without `-f`, curl returns 0 even on a 500 — which silently passes broken health checks in scripts.",
      },
      {
        kind: "code-reading",
        question:
          "What does `curl -X POST -H \"Content-Type: application/json\" -d '{\"x\":1}'` add to the request?",
        options: [
          "Method POST, JSON content-type header, and a JSON body.",
          "Only the method.",
          "Only the body.",
          "Nothing — the syntax is wrong.",
        ],
        correctAnswer:
          "Method POST, JSON content-type header, and a JSON body.",
        explanation:
          "`-X`, `-H`, `-d` are the three flags that compose most curl invocations.",
      },
      {
        kind: "spot-the-bug",
        question:
          "Why does this often fail on PowerShell?\n```powershell\ncurl -X POST -d '{\"x\":1}' http://...\n```",
        options: [
          "It always works.",
          "PowerShell's `curl` may alias `Invoke-WebRequest`, and single quotes do not preserve the inner double quotes — use `curl.exe` and escape carefully.",
          "POST is not allowed.",
          "`http://` should be `https://`.",
        ],
        correctAnswer:
          "PowerShell's `curl` may alias `Invoke-WebRequest`, and single quotes do not preserve the inner double quotes — use `curl.exe` and escape carefully.",
        explanation:
          "On Windows, call `curl.exe` explicitly to get real curl, and prefer here-strings or files for JSON bodies.",
      },
      {
        kind: "interview",
        question: "Why is curl useful in a CI pipeline?",
        options: [
          "It is faster than other tools.",
          "It is universally available, scriptable, and with `-f` it converts HTTP failures into shell-level failures that the pipeline can fail on.",
          "It is the only way to call APIs.",
          "It has a GUI.",
        ],
        correctAnswer:
          "It is universally available, scriptable, and with `-f` it converts HTTP failures into shell-level failures that the pipeline can fail on.",
        explanation:
          "curl + `set -e` + `-f` is a robust smoke-test recipe for any deployment.",
      },
    ],
  },

  "swagger-examples": {
    whyItMatters:
      "Swagger UI is the easiest way for clients (and your future self) to discover and exercise your API. Most .NET services include it by default — knowing how to read and customise it pays off immediately.",
    simpleExplanation:
      "Swagger UI is a web page generated from your API's OpenAPI document. It lists every endpoint and lets you try them from the browser.",
    deepExplanation:
      "ASP.NET Core can expose an OpenAPI document via `Microsoft.AspNetCore.OpenApi` (or Swashbuckle in older projects). The document is generated from your controllers, attributes, and XML comments. Swagger UI consumes it and renders the interactive page at `/swagger`. Lock down the page behind auth in non-dev environments, or remove it entirely from production.",
    realWorldUsage:
      "Hit `https://localhost:5001/swagger` and you see every endpoint, every DTO, and a 'Try it out' button that posts straight to the service.",
    explainLikeBeginner:
      "Swagger is auto-generated documentation that you can click. Each endpoint has a button that fires a real request.",
    interviewAnswer:
      "Swagger UI renders an OpenAPI document into an interactive page where consumers can read endpoints and try them. In .NET we generate the document from controllers and DTOs with `Microsoft.AspNetCore.OpenApi` (or Swashbuckle) and expose `/swagger` in development.",
    commonMistakes: [
      "Leaving Swagger exposed in production without any access control.",
      "Forgetting to enable XML comments, leaving endpoints undocumented.",
      "Treating Swagger as a contract that drives the code instead of generating it from the code.",
    ],
    bestPractices: [
      "Annotate DTOs with summaries via XML comments.",
      "Gate `/swagger` to authorised users in non-dev environments.",
      "Use `[ProducesResponseType(typeof(...), StatusCodes.Status200OK)]` so responses are typed in the doc.",
    ],
    summary: [
      "Swagger UI = clickable OpenAPI doc.",
      "Generate from code, don't hand-edit.",
      "Lock down outside dev.",
    ],
    codeExample: {
      title: "Wire up Swagger in Program.cs",
      code: `var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.MapControllers();
app.Run();`,
      output: "Visit /swagger -> interactive UI with every endpoint and DTO listed",
      walkthrough: [
        "`AddSwaggerGen` builds the OpenAPI document.",
        "`UseSwagger` exposes the JSON; `UseSwaggerUI` exposes the page.",
        "Both are gated to development to keep them off prod.",
      ],
    },
    practice: {
      prompt:
        "Enable Swagger on a sample API. Add XML comments to one DTO and one action, regenerate, and confirm the descriptions show up in the UI.",
      expectedResult:
        "The Swagger page reflects your XML comments and `[ProducesResponseType]` annotations.",
      hints: [
        "Set `<GenerateDocumentationFile>true</GenerateDocumentationFile>` in the csproj.",
        "Configure `SwaggerGenOptions.IncludeXmlComments` to pick up the file.",
        "Restart the service after rebuilding.",
      ],
      solution:
        "The endpoint summary, response types, and DTO field descriptions now show up in `/swagger`. Your API doubles as its own documentation.",
    },
    quiz: [
      {
        kind: "concept",
        question: "What is Swagger UI rendering?",
        options: [
          "Your source code directly.",
          "An OpenAPI document generated from your controllers and attributes.",
          "The database schema.",
          "Static HTML written by hand.",
        ],
        correctAnswer:
          "An OpenAPI document generated from your controllers and attributes.",
        explanation:
          "The OpenAPI doc is the contract; Swagger UI is one way to render it.",
      },
      {
        kind: "code-reading",
        question:
          "Given the `Program.cs` example, where is Swagger UI available?",
        options: [
          "Always at `/swagger`.",
          "Only when the app is running in the Development environment.",
          "Only when authenticated.",
          "Only when the database is reachable.",
        ],
        correctAnswer:
          "Only when the app is running in the Development environment.",
        explanation:
          "`app.Environment.IsDevelopment()` gates the middleware to dev.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is the issue?\n```csharp\napp.UseSwagger();\napp.UseSwaggerUI();\n// in Production\n```",
        options: [
          "Nothing.",
          "Swagger is exposed in production without auth — anyone can browse your endpoints and try them.",
          "`UseSwagger` does not exist.",
          "It conflicts with `MapControllers`.",
        ],
        correctAnswer:
          "Swagger is exposed in production without auth — anyone can browse your endpoints and try them.",
        explanation:
          "Either guard it behind auth or remove it in production. The current default leaks your API surface.",
      },
      {
        kind: "interview",
        question:
          "Why is generating OpenAPI from code generally better than hand-writing it?",
        options: [
          "It is the only legal way.",
          "Hand-written OpenAPI drifts from the code immediately; generated documents stay in sync with the actual implementation and surface mismatches as build failures.",
          "Hand-writing is faster.",
          "There is no difference.",
        ],
        correctAnswer:
          "Hand-written OpenAPI drifts from the code immediately; generated documents stay in sync with the actual implementation and surface mismatches as build failures.",
        explanation:
          "If you do hand-write specs (spec-first APIs), generate code from the spec so they cannot drift.",
      },
    ],
  },
};
