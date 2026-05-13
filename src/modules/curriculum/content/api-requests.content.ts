import type { ModuleContent } from "./types";

export const apiRequestsContent: ModuleContent = {
  "client-server-communication": {
    whyItMatters:
      "Most modern .NET applications talk to other systems through HTTP. The client sends a request, the server returns a response. Understanding this conversation is the foundation of every API you will build or call.",
    simpleExplanation:
      "Client-server communication means one program (the client) sends a request to another program (the server), and the server sends back a response. In .NET, this usually happens over HTTP.",
    deepExplanation:
      "Every HTTP exchange has two parts. The request includes a method, a URL, headers, and an optional body. The response includes a status code, headers, and an optional body. The client opens a connection, sends the request, waits for the response, and then closes the connection. ASP.NET Core handles the server side. HttpClient handles the client side.",
    realWorldUsage:
      "A mobile app calls your Web API to load a list of products. A scheduled job calls a payment provider to refund a transaction. A microservice calls another microservice to fetch user data. In each case, one side is the client and the other side is the server.",
    explainLikeBeginner:
      "Client-server communication is like ordering at a counter. You ask for a coffee (request). The barista makes it and hands it over (response). When you stop asking, the barista stops serving.",
    interviewAnswer:
      "Client-server communication is how applications talk over a network. The client sends a request and the server replies with a response, usually over HTTP. In .NET, ASP.NET Core handles the server, and HttpClient handles the client.",
    commonMistakes: [
      "Creating a new HttpClient for every call, which can exhaust connections.",
      "Ignoring the response status code.",
      "Not handling network errors and timeouts.",
    ],
    bestPractices: [
      "Use IHttpClientFactory to manage HttpClient lifetime.",
      "Always check the status code before reading the body.",
      "Handle network errors and add retries for transient failures.",
    ],
    summary: [
      "Client sends a request. Server sends a response.",
      "HTTP is the protocol used most often in .NET.",
      "Both sides must agree on the contract — URL, method, headers, and body.",
    ],
    codeExample: {
      title: "A simple HTTP GET from a .NET client",
      code: `using var client = new HttpClient();
var response = await client.GetAsync("https://api.example.com/products/1");

if (!response.IsSuccessStatusCode)
{
    Console.WriteLine($"Request failed: {response.StatusCode}");
    return;
}

var body = await response.Content.ReadAsStringAsync();
Console.WriteLine(body);`,
      output: "{ \"id\": 1, \"name\": \"Laptop\", \"price\": 1200 }",
      walkthrough: [
        "HttpClient is the .NET tool for sending HTTP requests.",
        "GetAsync sends a GET request and waits for the response.",
        "The code checks the status code before reading the body.",
      ],
    },
    practice: {
      prompt:
        "Write a console program that calls https://api.example.com/users/1 and prints the response body. If the status code is not 200, print the status code instead.",
      expectedResult:
        "On success, the program prints the JSON response. On failure, it prints something like 'Request failed: 404'.",
      hints: [
        "Use HttpClient and GetAsync.",
        "Use IsSuccessStatusCode to check the response.",
        "Use ReadAsStringAsync to read the body.",
      ],
      solution:
        "Create an HttpClient, call GetAsync on the URL, check IsSuccessStatusCode. If true, read the body with ReadAsStringAsync and print it. If false, print the StatusCode.",
    },
    quiz: [
      {
        kind: "concept",
        question: "Which statement best describes client-server communication?",
        options: [
          "Two programs share memory directly.",
          "One program sends a request over the network, and another program sends a response back.",
          "The client owns the server.",
          "Both sides must run on the same machine.",
        ],
        correctAnswer:
          "One program sends a request over the network, and another program sends a response back.",
        explanation:
          "This is the basic shape of every HTTP exchange.",
      },
      {
        kind: "code-reading",
        question:
          "What does this code do?\n```csharp\nvar response = await client.GetAsync(url);\nvar body = await response.Content.ReadAsStringAsync();\n```",
        options: [
          "Sends a POST request.",
          "Sends a GET request to the URL and reads the response body as a string.",
          "Reads a local file.",
          "Writes to a database.",
        ],
        correctAnswer:
          "Sends a GET request to the URL and reads the response body as a string.",
        explanation:
          "GetAsync sends the request, ReadAsStringAsync reads the response body.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is wrong here?\n```csharp\nfor (var i = 0; i < 1000; i++)\n{\n    using var client = new HttpClient();\n    await client.GetAsync(url);\n}\n```",
        options: [
          "Nothing.",
          "Creating a new HttpClient for every call can exhaust network connections. Use IHttpClientFactory instead.",
          "It needs more threads.",
          "It is missing a return type.",
        ],
        correctAnswer:
          "Creating a new HttpClient for every call can exhaust network connections. Use IHttpClientFactory instead.",
        explanation:
          "HttpClient is meant to be reused. IHttpClientFactory manages its lifetime safely.",
      },
      {
        kind: "interview",
        question:
          "How would you describe an HTTP request in an interview?",
        options: [
          "A file on disk.",
          "A message with a method, a URL, headers, and an optional body, sent from a client to a server. The server replies with a status code, headers, and an optional body.",
          "A database query.",
          "A type of variable.",
        ],
        correctAnswer:
          "A message with a method, a URL, headers, and an optional body, sent from a client to a server. The server replies with a status code, headers, and an optional body.",
        explanation:
          "This is the standard description of an HTTP exchange.",
      },
    ],
  },

  "http-methods": {
    whyItMatters:
      "HTTP methods describe what the client wants to do. Using the right method makes the API clear and predictable. The wrong method confuses clients, breaks caching, and can even cause real damage like deleting data with a GET request.",
    simpleExplanation:
      "HTTP methods are the verbs used in a request. The most common are GET (read), POST (create), PUT (replace), PATCH (update part), and DELETE (remove).",
    deepExplanation:
      "GET reads data and should not change anything on the server. POST creates a new resource. PUT replaces an entire resource. PATCH updates part of a resource. DELETE removes a resource. Following these conventions makes your API match REST and lets tools like browsers, proxies, and gateways behave correctly. ASP.NET Core controllers use [HttpGet], [HttpPost], [HttpPut], [HttpPatch], and [HttpDelete] to map actions to the right method.",
    realWorldUsage:
      "GET /api/products lists products. POST /api/products creates one. PUT /api/products/1 replaces product 1 with a new version. PATCH /api/products/1 updates only some fields. DELETE /api/products/1 removes product 1. Every modern .NET API follows this pattern.",
    explainLikeBeginner:
      "HTTP methods are like asking a librarian different questions. GET is 'can I look at this book?'. POST is 'I have a new book to add'. PUT is 'replace this book with a new edition'. DELETE is 'please remove this book'.",
    interviewAnswer:
      "HTTP methods describe the action of a request. GET reads. POST creates. PUT replaces. PATCH partially updates. DELETE removes. Using the right method makes the API match REST conventions and helps clients, proxies, and tools work correctly.",
    commonMistakes: [
      "Using GET to change data.",
      "Using POST for everything regardless of the action.",
      "Confusing PUT (replace) with PATCH (partial update).",
    ],
    bestPractices: [
      "Use the right method for the right action.",
      "Keep GET safe — it must not change the server state.",
      "Return the right status code for each method (200 for GET, 201 for POST creation, 204 for DELETE).",
    ],
    summary: [
      "GET reads. POST creates. PUT replaces. PATCH partially updates. DELETE removes.",
      "ASP.NET Core uses [HttpGet], [HttpPost], etc. to map methods.",
      "Using the right method makes the API clear and predictable.",
    ],
    codeExample: {
      title: "A controller with all five HTTP methods",
      code: `[ApiController]
[Route("api/products")]
public class ProductsController : ControllerBase
{
    [HttpGet]
    public IActionResult List() => Ok();

    [HttpGet("{id}")]
    public IActionResult GetById(int id) => Ok();

    [HttpPost]
    public IActionResult Create(CreateProductRequest request) => Ok();

    [HttpPut("{id}")]
    public IActionResult Replace(int id, ReplaceProductRequest request) => Ok();

    [HttpPatch("{id}")]
    public IActionResult Update(int id, UpdateProductRequest request) => Ok();

    [HttpDelete("{id}")]
    public IActionResult Delete(int id) => NoContent();
}`,
      output: "A controller that supports the full CRUD lifecycle.",
      walkthrough: [
        "Each [Http...] attribute maps an HTTP method to a controller action.",
        "The route pattern includes {id} for actions that target a single resource.",
        "DELETE typically returns 204 No Content to indicate success.",
      ],
    },
    practice: {
      prompt:
        "Add five actions to an OrdersController, one for each HTTP method (GET list, GET by id, POST create, PUT replace, DELETE). Use the right attributes and return the right status codes.",
      expectedResult:
        "GET /api/orders returns 200 with a list. POST /api/orders returns 200 with the created order. DELETE /api/orders/1 returns 204.",
      hints: [
        "Use [HttpGet], [HttpGet(\"{id}\")], [HttpPost], [HttpPut(\"{id}\")], and [HttpDelete(\"{id}\")].",
        "Return Ok for GET and POST.",
        "Return NoContent for DELETE.",
      ],
      solution:
        "Define an OrdersController with five actions and the matching attributes. Each action returns the right status code for the operation.",
    },
    quiz: [
      {
        kind: "concept",
        question: "Which HTTP method should you use to create a new resource?",
        options: ["GET", "POST", "PUT", "DELETE"],
        correctAnswer: "POST",
        explanation:
          "POST is used to create new resources on the server.",
      },
      {
        kind: "code-reading",
        question:
          "What does this attribute do?\n```csharp\n[HttpDelete(\"{id}\")]\npublic IActionResult Delete(int id) { ... }\n```",
        options: [
          "Maps GET requests.",
          "Maps DELETE requests at /api/.../{id} to this action.",
          "Reads from the database.",
          "Configures logging.",
        ],
        correctAnswer:
          "Maps DELETE requests at /api/.../{id} to this action.",
        explanation:
          "[HttpDelete(\"{id}\")] tells the framework this action handles DELETE for a specific id.",
      },
      {
        kind: "spot-the-bug",
        question:
          "Why is this dangerous?\n```csharp\n[HttpGet(\"delete/{id}\")]\npublic IActionResult Delete(int id) { ... }\n```",
        options: [
          "Nothing.",
          "It uses GET to delete a resource. GET should not change data — a crawler or a browser could trigger deletes by accident.",
          "It has too many parameters.",
          "It uses the wrong status code.",
        ],
        correctAnswer:
          "It uses GET to delete a resource. GET should not change data — a crawler or a browser could trigger deletes by accident.",
        explanation:
          "Use DELETE for delete operations, not GET.",
      },
      {
        kind: "interview",
        question:
          "What is the difference between PUT and PATCH?",
        options: [
          "They are the same.",
          "PUT replaces the entire resource with a new version. PATCH updates only the fields included in the request.",
          "PUT is faster.",
          "PATCH is only for partial deletes.",
        ],
        correctAnswer:
          "PUT replaces the entire resource with a new version. PATCH updates only the fields included in the request.",
        explanation:
          "Pick the right method based on whether the client sends the full new resource or just the changed parts.",
      },
    ],
  },

  headers: {
    whyItMatters:
      "Headers carry the metadata of every HTTP request and response. They control authentication, content type, caching, language, and more. Without the right headers, requests fail or behave in confusing ways.",
    simpleExplanation:
      "Headers are key-value pairs sent with every HTTP request and response. They describe the request, the response, or the connection — but not the data itself.",
    deepExplanation:
      "Each header has a name and a value. Common request headers include Authorization (carries the token), Content-Type (describes the body format), and Accept (says what the client wants back). Common response headers include Content-Type, Set-Cookie, and Cache-Control. In .NET, HttpClient lets you read and write headers, and ASP.NET Core exposes them through HttpContext.Request.Headers and HttpContext.Response.Headers.",
    realWorldUsage:
      "Authentication uses the Authorization header to carry a JWT token. APIs return Content-Type: application/json on responses. Caching uses ETag and Cache-Control headers. CORS uses Access-Control-Allow-Origin. Every real .NET API depends on headers to work correctly.",
    explainLikeBeginner:
      "Headers are like the labels on an envelope. The letter inside is the body. The labels say who the letter is for, who sent it, and how it should be handled. Without the labels, the post office cannot do its job.",
    interviewAnswer:
      "HTTP headers are key-value pairs that carry metadata about a request or response — authentication, content type, caching, language, and more. In .NET, we use HttpClient to set request headers and ASP.NET Core to read them from HttpContext.Request.Headers.",
    commonMistakes: [
      "Forgetting to set Content-Type when sending JSON.",
      "Storing secrets in headers but not encrypting them in transit.",
      "Using custom headers without documenting them clearly.",
    ],
    bestPractices: [
      "Always set Content-Type when sending a body.",
      "Use the Authorization header for tokens, never the URL.",
      "Document custom headers in your API spec.",
    ],
    summary: [
      "Headers carry metadata about a request or response.",
      "Common ones are Authorization, Content-Type, and Accept.",
      "In .NET, both client and server can read and write headers.",
    ],
    codeExample: {
      title: "Setting and reading HTTP headers",
      code: `// Client side
using var client = new HttpClient();
client.DefaultRequestHeaders.Add("Authorization", "Bearer <TOKEN>");
client.DefaultRequestHeaders.Add("Accept", "application/json");
var response = await client.GetAsync("https://api.example.com/me");

// Server side
[HttpGet("me")]
public IActionResult Me()
{
    var auth = Request.Headers["Authorization"].ToString();
    return Ok(new { auth });
}`,
      output: "{ \"auth\": \"Bearer <TOKEN>\" }",
      walkthrough: [
        "On the client, DefaultRequestHeaders sets headers for every request.",
        "Authorization carries the token.",
        "On the server, Request.Headers gives you the incoming headers.",
      ],
    },
    practice: {
      prompt:
        "Write a client call that sends a GET to /api/secure-data with an Authorization: Bearer <TOKEN> header and an Accept: application/json header. Print the response.",
      expectedResult:
        "The server receives the request with both headers and returns the secure data.",
      hints: [
        "Use HttpClient.DefaultRequestHeaders.Add to set headers.",
        "Or set the headers per request via HttpRequestMessage.",
        "Replace <TOKEN> with a real token in your environment.",
      ],
      solution:
        "Set DefaultRequestHeaders.Add for Authorization and Accept on the HttpClient. Then call GetAsync on the URL. Read and print the response body.",
    },
    quiz: [
      {
        kind: "concept",
        question: "What do HTTP headers carry?",
        options: [
          "The full body of the request.",
          "Metadata about the request or response, like Authorization, Content-Type, and Accept.",
          "Database connection strings.",
          "File contents.",
        ],
        correctAnswer:
          "Metadata about the request or response, like Authorization, Content-Type, and Accept.",
        explanation:
          "Headers carry information about the request, not the actual data.",
      },
      {
        kind: "code-reading",
        question:
          "What does this header do?\n`Authorization: Bearer eyJhbGciOiJIUzI1Ni...`",
        options: [
          "Sends the request as XML.",
          "Carries a JWT token so the server can identify the user.",
          "Sets the language.",
          "Caches the response.",
        ],
        correctAnswer:
          "Carries a JWT token so the server can identify the user.",
        explanation:
          "The Authorization header with a Bearer token is the standard way to authenticate API calls.",
      },
      {
        kind: "spot-the-bug",
        question:
          "Why is this risky?\n`GET /api/data?token=secret123`",
        options: [
          "Nothing.",
          "Tokens in the URL are logged by servers and proxies. They should be sent in the Authorization header instead.",
          "URLs must be shorter.",
          "GET cannot have parameters.",
        ],
        correctAnswer:
          "Tokens in the URL are logged by servers and proxies. They should be sent in the Authorization header instead.",
        explanation:
          "Sensitive values like tokens belong in headers, not URLs.",
      },
      {
        kind: "interview",
        question:
          "Which headers are most common in real .NET APIs?",
        options: [
          "Only Content-Type.",
          "Authorization for tokens, Content-Type to describe the body, Accept to say what the client wants, and Cache-Control to manage caching.",
          "Only X-Powered-By.",
          "Only Cookie.",
        ],
        correctAnswer:
          "Authorization for tokens, Content-Type to describe the body, Accept to say what the client wants, and Cache-Control to manage caching.",
        explanation:
          "These four headers cover most situations in a real .NET API.",
      },
    ],
  },

  body: {
    whyItMatters:
      "The body is where the real data of a request or response lives. For POST and PUT, the body carries the new or updated data. For responses, the body carries the result. Understanding how to read and send a body is essential for working with APIs.",
    simpleExplanation:
      "The body is the part of an HTTP message that carries the data. In .NET APIs, the body is usually JSON. The client sends a body in POST or PUT requests, and the server sends a body in most responses.",
    deepExplanation:
      "When the client sends a body, ASP.NET Core reads the Content-Type header and deserializes the body into a request DTO. The framework uses System.Text.Json by default. On the response side, the framework serializes the return value back into JSON. The body can be empty (for example, on a DELETE), or it can be a large object with many fields.",
    realWorldUsage:
      "A POST /api/orders body contains CustomerId and a list of items. A PUT /api/products/1 body contains the full product to replace. A GET /api/products/1 response body contains the product as JSON. Almost every endpoint either accepts or returns a body.",
    explainLikeBeginner:
      "The body is like the content of a letter. The envelope (headers) describes who sent it and how to handle it. The letter inside (body) is the actual message. Without a body, the request or response is empty.",
    interviewAnswer:
      "The body is the payload of an HTTP request or response. It usually contains JSON in modern .NET APIs. ASP.NET Core deserializes the body into a request DTO and serializes the return value back into JSON for the response.",
    commonMistakes: [
      "Forgetting to set Content-Type: application/json when sending JSON.",
      "Sending a body with methods that should not have one, like GET.",
      "Logging the full body, including sensitive fields.",
    ],
    bestPractices: [
      "Use DTOs for the body shape.",
      "Set Content-Type explicitly on the client.",
      "Validate the body on the server before processing.",
    ],
    summary: [
      "The body carries the real data of a request or response.",
      "In .NET APIs, the body is usually JSON.",
      "ASP.NET Core handles serialization automatically through DTOs.",
    ],
    codeExample: {
      title: "Sending and receiving a JSON body in .NET",
      code: `// Client side
var newOrder = new { CustomerId = 1, Items = new[] { new { Sku = "A", Quantity = 2 } } };
using var client = new HttpClient();
var response = await client.PostAsJsonAsync("https://api.example.com/orders", newOrder);

// Server side
[HttpPost]
public async Task<IActionResult> Create(CreateOrderRequest request)
{
    var created = await _service.CreateAsync(request);
    return Ok(created);
}`,
      output: "POST /orders with a JSON body returns 200 with the created order.",
      walkthrough: [
        "PostAsJsonAsync serializes the object and sends it as JSON.",
        "The server's request DTO matches the JSON shape.",
        "ASP.NET Core handles deserialization automatically.",
      ],
    },
    practice: {
      prompt:
        "Write a client call that sends a POST to /api/customers with a JSON body containing Name and Email. On the server, build the matching endpoint that reads the body into a CreateCustomerRequest DTO.",
      expectedResult:
        "The server receives the body, deserializes it, and returns 200 with the created customer DTO.",
      hints: [
        "Use PostAsJsonAsync on the client.",
        "Define a CreateCustomerRequest DTO on the server.",
        "Use [HttpPost] and pass the DTO as a parameter.",
      ],
      solution:
        "On the client, call PostAsJsonAsync with the URL and the object. On the server, write [HttpPost] public async Task<IActionResult> Create(CreateCustomerRequest request) and return Ok(result).",
    },
    quiz: [
      {
        kind: "concept",
        question: "What is the body of an HTTP request?",
        options: [
          "The list of headers.",
          "The payload — the actual data the client sends, usually as JSON.",
          "The URL.",
          "The status code.",
        ],
        correctAnswer:
          "The payload — the actual data the client sends, usually as JSON.",
        explanation:
          "The body is where the data lives. Headers describe the body but are separate from it.",
      },
      {
        kind: "code-reading",
        question:
          "What does PostAsJsonAsync do?\n```csharp\nawait client.PostAsJsonAsync(url, dto);\n```",
        options: [
          "Sends a GET request.",
          "Serializes the dto to JSON, sets Content-Type to application/json, and sends it as a POST.",
          "Saves the dto to disk.",
          "Reads a database row.",
        ],
        correctAnswer:
          "Serializes the dto to JSON, sets Content-Type to application/json, and sends it as a POST.",
        explanation:
          "PostAsJsonAsync handles serialization and headers for you in one call.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is wrong here?\n```csharp\nvar response = await client.PostAsync(url, new StringContent(\"{\\\"name\\\":\\\"Ali\\\"}\"));\n```",
        options: [
          "Nothing.",
          "Content-Type is not set, so the server may not deserialize the body as JSON. Use new StringContent(json, Encoding.UTF8, \"application/json\") or PostAsJsonAsync.",
          "It cannot send strings.",
          "It needs await.",
        ],
        correctAnswer:
          "Content-Type is not set, so the server may not deserialize the body as JSON. Use new StringContent(json, Encoding.UTF8, \"application/json\") or PostAsJsonAsync.",
        explanation:
          "Always specify the Content-Type so the server knows how to parse the body.",
      },
      {
        kind: "interview",
        question:
          "How does ASP.NET Core handle the request body?",
        options: [
          "Manually by the controller code.",
          "It reads the Content-Type header, picks the right formatter (JSON by default), and deserializes the body into the request DTO parameter.",
          "It ignores the body.",
          "It returns the body as a string only.",
        ],
        correctAnswer:
          "It reads the Content-Type header, picks the right formatter (JSON by default), and deserializes the body into the request DTO parameter.",
        explanation:
          "Model binding handles this for you, so the controller can work with strongly typed DTOs.",
      },
    ],
  },

  "query-parameters": {
    whyItMatters:
      "Query parameters are how clients filter, sort, and page through data. They are part of every list endpoint in a real API. Knowing how to read them in .NET is one of the most common daily tasks.",
    simpleExplanation:
      "Query parameters are extra values added to the URL after a question mark, like ?page=2&size=20. They are used to filter, sort, or page through data without changing the body.",
    deepExplanation:
      "ASP.NET Core can bind query parameters to action method parameters automatically. If the parameter type is a simple value (int, string), the framework looks for a matching query string key. If it is a complex type, the framework binds each property by name. You can also use [FromQuery] explicitly. Query parameters are part of the URL, so they are visible in logs — never use them for sensitive data.",
    realWorldUsage:
      "GET /api/products?category=books&page=2 lists books on the second page. GET /api/orders?status=Pending&from=2026-01-01 filters by status and date. GET /api/users?search=ali searches for users by name. Almost every list endpoint accepts query parameters.",
    explainLikeBeginner:
      "Query parameters are like filters in an online shop. The URL shows what filters you applied — category, price range, sorting. The server reads them and returns only the matching items.",
    interviewAnswer:
      "Query parameters are URL-based key-value pairs used for filtering, sorting, and paging. ASP.NET Core binds them to action parameters automatically. We use them for GET endpoints and never for sensitive data.",
    commonMistakes: [
      "Sending sensitive data like passwords in query parameters.",
      "Forgetting to validate or sanitize query inputs.",
      "Using query parameters for actions that should be in the body.",
    ],
    bestPractices: [
      "Use query parameters for filtering, sorting, and paging.",
      "Validate and sanitize each query parameter.",
      "Document each parameter clearly in your API spec.",
    ],
    summary: [
      "Query parameters are URL-based key-value pairs after a question mark.",
      "They are used for filtering, sorting, and paging.",
      "ASP.NET Core binds them to action parameters automatically.",
    ],
    codeExample: {
      title: "Reading query parameters in a controller",
      code: `[HttpGet]
public IActionResult List(
    [FromQuery] string? category,
    [FromQuery] int page = 1,
    [FromQuery] int size = 20)
{
    var result = new
    {
        category,
        page,
        size,
        items = Array.Empty<object>()
    };
    return Ok(result);
}

// Request: GET /api/products?category=books&page=2&size=10
// Result:  { "category": "books", "page": 2, "size": 10, "items": [] }`,
      output: "{ \"category\": \"books\", \"page\": 2, \"size\": 10, \"items\": [] }",
      walkthrough: [
        "[FromQuery] tells the framework to read the value from the query string.",
        "Default values like page = 1 are used when the query is missing the parameter.",
        "The result shows the parameters bound from the URL.",
      ],
    },
    practice: {
      prompt:
        "Build a GET /api/orders endpoint that supports three query parameters: status (string), from (DateTime), and to (DateTime). Return them in the response.",
      expectedResult:
        "GET /api/orders?status=Paid&from=2026-01-01&to=2026-12-31 returns 200 with the three values echoed back.",
      hints: [
        "Add [FromQuery] string status, DateTime? from, DateTime? to to the action.",
        "Make from and to nullable so clients can skip them.",
        "Return Ok with an anonymous object containing all three values.",
      ],
      solution:
        "Define the action with [FromQuery] parameters. Return Ok(new { status, from, to }). ASP.NET Core binds them automatically from the query string.",
    },
    quiz: [
      {
        kind: "concept",
        question: "What are query parameters used for?",
        options: [
          "Sending the body of a POST request.",
          "Filtering, sorting, and paging data through key-value pairs in the URL.",
          "Authenticating users.",
          "Setting Content-Type.",
        ],
        correctAnswer:
          "Filtering, sorting, and paging data through key-value pairs in the URL.",
        explanation:
          "Query parameters live in the URL and are common in list endpoints.",
      },
      {
        kind: "code-reading",
        question:
          "What URL matches this action?\n```csharp\n[HttpGet]\npublic IActionResult List([FromQuery] int page, [FromQuery] int size) { ... }\n```",
        options: [
          "/api/...?body=true",
          "/api/...?page=2&size=20",
          "/api/.../2/20",
          "/api/.../page=2",
        ],
        correctAnswer: "/api/...?page=2&size=20",
        explanation:
          "Query parameters are written as ?key=value pairs after the path.",
      },
      {
        kind: "spot-the-bug",
        question:
          "Why is this URL a bad design?\n`GET /api/login?username=ali&password=secret`",
        options: [
          "It is fine.",
          "Passwords in query parameters are logged by servers and proxies. Credentials should always go in the body or a secure header.",
          "It is too long.",
          "It needs JSON.",
        ],
        correctAnswer:
          "Passwords in query parameters are logged by servers and proxies. Credentials should always go in the body or a secure header.",
        explanation:
          "Never put secrets in URLs.",
      },
      {
        kind: "interview",
        question:
          "How does ASP.NET Core bind query parameters?",
        options: [
          "It does not.",
          "It looks at action method parameters; simple types are matched by name in the query string, complex types have their properties matched, and [FromQuery] makes the binding explicit.",
          "Only through reflection.",
          "Only with custom code.",
        ],
        correctAnswer:
          "It looks at action method parameters; simple types are matched by name in the query string, complex types have their properties matched, and [FromQuery] makes the binding explicit.",
        explanation:
          "Model binding makes query parameters easy to use without manual parsing.",
      },
    ],
  },

  "route-parameters": {
    whyItMatters:
      "Route parameters identify a specific resource in a URL — like the id in /api/orders/1. They are part of every endpoint that targets one item, so getting them right matters every day.",
    simpleExplanation:
      "A route parameter is a part of the URL path that captures a value, like the {id} in /api/orders/{id}. ASP.NET Core binds the captured value to a parameter in the action method.",
    deepExplanation:
      "Route parameters are defined in the route template using curly braces. The framework matches the value, converts it to the type of the action parameter (int, Guid, string), and passes it in. You can add constraints like {id:int} to make sure the value matches a specific type. Route parameters are part of the URL, so they are also visible in logs — never use them for sensitive data.",
    realWorldUsage:
      "GET /api/customers/{id} loads one customer. PUT /api/products/{id} replaces one product. DELETE /api/orders/{id} removes one order. GET /api/users/{userId}/orders lists orders for a specific user. Every API uses route parameters for resource-specific actions.",
    explainLikeBeginner:
      "A route parameter is like the seat number on a plane ticket. The plane is /flights/AA101. The seat is /flights/AA101/12A. The seat number is the parameter that points to one specific seat.",
    interviewAnswer:
      "A route parameter captures a value from the URL path. ASP.NET Core uses curly braces in the route template, like {id}, and binds the captured value to an action parameter. We use route parameters to identify a specific resource.",
    commonMistakes: [
      "Mixing query parameters and route parameters in confusing ways.",
      "Skipping route constraints, which can let invalid values reach the action.",
      "Putting sensitive data in the URL.",
    ],
    bestPractices: [
      "Use route parameters to identify a specific resource.",
      "Add type constraints like {id:int} when possible.",
      "Use query parameters for filters and route parameters for resource identifiers.",
    ],
    summary: [
      "Route parameters capture parts of the URL path.",
      "They identify a specific resource.",
      "ASP.NET Core binds them automatically to action parameters.",
    ],
    codeExample: {
      title: "Using a route parameter to load one customer",
      code: `[ApiController]
[Route("api/customers")]
public class CustomersController : ControllerBase
{
    [HttpGet("{id:int}")]
    public IActionResult GetById(int id)
    {
        return Ok(new { id, name = $"Customer #{id}" });
    }
}

// Request: GET /api/customers/42
// Result:  { "id": 42, "name": "Customer #42" }`,
      output: "{ \"id\": 42, \"name\": \"Customer #42\" }",
      walkthrough: [
        "[HttpGet(\"{id:int}\")] adds a route parameter that must be an int.",
        "The framework reads the value from the URL and binds it to the id parameter.",
        "If the URL contains a non-integer value, the route does not match.",
      ],
    },
    practice: {
      prompt:
        "Build a GET endpoint at /api/orders/{orderId}/items/{itemId} that returns the orderId and itemId from the URL. Add type constraints to both values.",
      expectedResult:
        "GET /api/orders/10/items/5 returns 200 with { orderId: 10, itemId: 5 }.",
      hints: [
        "Use [HttpGet(\"{orderId:int}/items/{itemId:int}\")] on the action.",
        "Add two int parameters with matching names.",
        "Return Ok(new { orderId, itemId }).",
      ],
      solution:
        "Define the action with the route template and two int parameters. The framework binds the values from the URL automatically.",
    },
    quiz: [
      {
        kind: "concept",
        question: "What is a route parameter?",
        options: [
          "A value sent in the body.",
          "A part of the URL path that captures a value, like {id} in /api/customers/{id}.",
          "A header.",
          "A status code.",
        ],
        correctAnswer:
          "A part of the URL path that captures a value, like {id} in /api/customers/{id}.",
        explanation:
          "Route parameters are part of the URL path, not the query string.",
      },
      {
        kind: "code-reading",
        question:
          "What does {id:int} do in this route?\n```csharp\n[HttpGet(\"{id:int}\")]\n```",
        options: [
          "Sets a default value.",
          "Adds a route constraint so the parameter must be an integer for the route to match.",
          "Validates the body.",
          "Sets the response type.",
        ],
        correctAnswer:
          "Adds a route constraint so the parameter must be an integer for the route to match.",
        explanation:
          "Route constraints prevent invalid values from reaching the action.",
      },
      {
        kind: "spot-the-bug",
        question:
          "Why is this confusing?\n`GET /api/users?id=5`",
        options: [
          "Nothing.",
          "For loading a single resource by identifier, the URL should use a route parameter (/api/users/5), not a query parameter.",
          "Query parameters are not allowed.",
          "The URL is too long.",
        ],
        correctAnswer:
          "For loading a single resource by identifier, the URL should use a route parameter (/api/users/5), not a query parameter.",
        explanation:
          "Use route parameters for resource identifiers and query parameters for filters.",
      },
      {
        kind: "interview",
        question:
          "When should you use route parameters vs query parameters?",
        options: [
          "Always use query parameters.",
          "Route parameters for the identifier of a specific resource, query parameters for filtering, sorting, and paging.",
          "Always use route parameters.",
          "It does not matter.",
        ],
        correctAnswer:
          "Route parameters for the identifier of a specific resource, query parameters for filtering, sorting, and paging.",
        explanation:
          "Following this rule keeps URLs predictable and easy to read.",
      },
    ],
  },

  "status-codes": {
    whyItMatters:
      "Status codes are how the server tells the client what happened. Using the right one makes the API clear and predictable. The wrong one confuses clients and hides real problems behind misleading responses.",
    simpleExplanation:
      "HTTP status codes are three-digit numbers the server returns with each response. They are grouped into ranges: 2xx success, 3xx redirect, 4xx client error, 5xx server error.",
    deepExplanation:
      "200 OK is the standard success. 201 Created is used after a POST that creates a resource. 204 No Content is used when the operation succeeds but there is nothing to return. 400 Bad Request means the input was invalid. 401 Unauthorized means the user is not authenticated. 403 Forbidden means they are authenticated but not allowed. 404 Not Found means the resource does not exist. 409 Conflict means the request conflicts with the current state. 500 Server Error means something failed inside the server.",
    realWorldUsage:
      "A GET that finds the resource returns 200. A successful POST returns 201 with a Location header. A validation failure returns 400. A missing token returns 401. A request for a deleted record returns 404. An unhandled exception returns 500. Every action in a real .NET API uses one of these codes.",
    explainLikeBeginner:
      "Status codes are like answers from a clerk. 200 is 'here you go'. 400 is 'I cannot understand what you asked'. 401 is 'show me your ID first'. 404 is 'we do not have that here'. 500 is 'something is broken in the office'.",
    interviewAnswer:
      "HTTP status codes describe the outcome of a request. 2xx means success, 4xx means a client error, and 5xx means a server error. In .NET, we use IActionResult helpers like Ok, BadRequest, NotFound, and Unauthorized to return the right code.",
    commonMistakes: [
      "Returning 200 for failures instead of the right error code.",
      "Returning 500 for validation errors instead of 400.",
      "Returning 404 for unauthenticated requests instead of 401.",
    ],
    bestPractices: [
      "Match the status code to the actual outcome.",
      "Return 201 with a Location header after creating a resource.",
      "Return a clear error body alongside 4xx codes.",
    ],
    summary: [
      "2xx success. 4xx client error. 5xx server error.",
      "Use the right code for each outcome.",
      "ASP.NET Core provides helpers like Ok, BadRequest, and NotFound.",
    ],
    codeExample: {
      title: "Returning the right status code from a controller",
      code: `[HttpGet("{id}")]
public ActionResult<CustomerResponse> GetById(int id)
{
    if (id <= 0) return BadRequest("Id must be positive");
    var customer = _service.GetById(id);
    if (customer == null) return NotFound();
    return Ok(customer);
}

[HttpPost]
public ActionResult<CustomerResponse> Create(CreateCustomerRequest request)
{
    var created = _service.Create(request);
    return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
}`,
      output: "GET 404, POST 201 with a Location header pointing to the new customer.",
      walkthrough: [
        "BadRequest returns 400 with a clear message.",
        "NotFound returns 404 when the customer does not exist.",
        "CreatedAtAction returns 201 with a Location header to the new resource.",
      ],
    },
    practice: {
      prompt:
        "Build a DELETE /api/products/{id} endpoint. Return 404 if the product does not exist, 204 No Content on success, and 403 if the current user is not allowed to delete it.",
      expectedResult:
        "Deleting an existing product returns 204. Deleting a missing product returns 404. Deleting without permission returns 403.",
      hints: [
        "Use NotFound() for 404.",
        "Use NoContent() for 204.",
        "Use Forbid() for 403.",
      ],
      solution:
        "In the action, check existence first (return NotFound if missing), then permission (return Forbid if not allowed), then delete and return NoContent.",
    },
    quiz: [
      {
        kind: "concept",
        question: "Which status code should you return after successfully creating a resource?",
        options: ["200 OK", "201 Created", "204 No Content", "404 Not Found"],
        correctAnswer: "201 Created",
        explanation:
          "201 Created is the conventional response for a successful POST that creates a new resource.",
      },
      {
        kind: "code-reading",
        question:
          "What status code does this return?\n```csharp\nif (customer == null) return NotFound();\n```",
        options: ["200", "204", "404", "500"],
        correctAnswer: "404",
        explanation:
          "NotFound() returns 404 to indicate the resource does not exist.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is wrong here?\n```csharp\nif (request.Email == null) return StatusCode(500, \"Email required\");\n```",
        options: [
          "Nothing.",
          "Invalid input is a client error, not a server error. Use BadRequest (400), not 500.",
          "StatusCode is not valid.",
          "Email cannot be null.",
        ],
        correctAnswer:
          "Invalid input is a client error, not a server error. Use BadRequest (400), not 500.",
        explanation:
          "500 should only be used when something failed inside the server, not for bad input.",
      },
      {
        kind: "interview",
        question:
          "What is the difference between 401 and 403?",
        options: [
          "They are the same.",
          "401 means the user is not authenticated (no valid token). 403 means the user is authenticated but does not have permission for this action.",
          "401 is for server errors.",
          "403 is for missing resources.",
        ],
        correctAnswer:
          "401 means the user is not authenticated (no valid token). 403 means the user is authenticated but does not have permission for this action.",
        explanation:
          "Knowing this difference is a common interview check for API knowledge.",
      },
    ],
  },

  "json-request-and-response": {
    whyItMatters:
      "JSON is the standard format for API data in .NET. Every request and response you build will be JSON. Knowing how serialization works helps you avoid subtle bugs around dates, nulls, casing, and missing fields.",
    simpleExplanation:
      "JSON is a simple text format for structured data. .NET uses System.Text.Json to convert between objects and JSON automatically when you use HttpClient or ASP.NET Core controllers.",
    deepExplanation:
      "When the server returns an object, ASP.NET Core serializes it into JSON using System.Text.Json. By default it uses camelCase for property names and ISO 8601 for dates. When a request arrives, the framework deserializes the JSON body into the request DTO. You can customize naming, ignore nulls, and handle special cases through JsonSerializerOptions or attributes like [JsonPropertyName] and [JsonIgnore].",
    realWorldUsage:
      "A REST API returns a list of products as a JSON array. A POST endpoint accepts a JSON body with the new customer's data. A webhook receives a JSON payload from a third-party service. Almost every API call in a modern .NET application involves JSON.",
    explainLikeBeginner:
      "JSON is like a structured note written in a way both humans and machines can read. The note has keys (like 'name') and values (like 'Ali'). Both sides of the conversation read the same note.",
    interviewAnswer:
      "JSON is the standard data format used by .NET APIs. ASP.NET Core uses System.Text.Json to convert between objects and JSON. We can customize the behavior with JsonSerializerOptions and attributes like [JsonPropertyName] when needed.",
    commonMistakes: [
      "Forgetting that property names are case-sensitive by default in some setups.",
      "Returning circular references that cause serialization to fail.",
      "Logging full JSON bodies, including sensitive fields.",
    ],
    bestPractices: [
      "Use DTOs to define the JSON shape.",
      "Decide on a casing convention (camelCase is the default) and stick to it.",
      "Be careful with date and decimal formatting in cross-language APIs.",
    ],
    summary: [
      "JSON is the default API format in .NET.",
      "System.Text.Json handles serialization and deserialization.",
      "Customize the behavior with options and attributes when needed.",
    ],
    codeExample: {
      title: "Working with JSON on both sides",
      code: `// Server side
public class ProductResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
}

[HttpGet("{id}")]
public ActionResult<ProductResponse> GetById(int id)
{
    return Ok(new ProductResponse { Id = id, Name = "Laptop", Price = 1200 });
}

// Client side
var product = await client.GetFromJsonAsync<ProductResponse>(
    "https://api.example.com/products/1");
Console.WriteLine($"{product?.Name}: {product?.Price}");`,
      output: "{ \"id\": 1, \"name\": \"Laptop\", \"price\": 1200 }",
      walkthrough: [
        "The server returns a DTO that ASP.NET Core serializes to JSON.",
        "GetFromJsonAsync on the client reads the JSON and deserializes it into the DTO type.",
        "Property names use camelCase by default.",
      ],
    },
    practice: {
      prompt:
        "Create a GET /api/customers/{id} endpoint that returns a CustomerResponse DTO as JSON. Then build a client call that fetches the JSON and prints the customer's name.",
      expectedResult:
        "Calling the client method against the server returns a JSON body and prints the customer's name from the deserialized object.",
      hints: [
        "Use ActionResult<CustomerResponse> on the server.",
        "Use GetFromJsonAsync<CustomerResponse> on the client.",
        "Print Name from the deserialized object.",
      ],
      solution:
        "Define CustomerResponse, return it from the controller, and use GetFromJsonAsync on the client to read the JSON. Print response.Name.",
    },
    quiz: [
      {
        kind: "concept",
        question: "Which library handles JSON serialization by default in modern .NET?",
        options: [
          "Newtonsoft.Json (Json.NET)",
          "System.Text.Json",
          "XmlSerializer",
          "Protocol Buffers",
        ],
        correctAnswer: "System.Text.Json",
        explanation:
          "System.Text.Json is built into modern .NET and is the default in ASP.NET Core.",
      },
      {
        kind: "code-reading",
        question:
          "What does this code do?\n```csharp\nvar product = await client.GetFromJsonAsync<ProductResponse>(url);\n```",
        options: [
          "Saves a product.",
          "Sends a GET request, reads the JSON response, and deserializes it into a ProductResponse object.",
          "Returns XML.",
          "Reads a file.",
        ],
        correctAnswer:
          "Sends a GET request, reads the JSON response, and deserializes it into a ProductResponse object.",
        explanation:
          "GetFromJsonAsync wraps the call and the deserialization in one step.",
      },
      {
        kind: "spot-the-bug",
        question:
          "Why does this DTO serialize unexpectedly?\n```csharp\npublic class CustomerDto\n{\n    public string Name { get; set; }\n    public CustomerDto Parent { get; set; }\n}\n```",
        options: [
          "Nothing.",
          "Circular references like Parent can cause infinite loops during JSON serialization. Avoid cycles in DTOs.",
          "It needs a constructor.",
          "Name should be private.",
        ],
        correctAnswer:
          "Circular references like Parent can cause infinite loops during JSON serialization. Avoid cycles in DTOs.",
        explanation:
          "Keep DTOs flat or use [JsonIgnore] to break cycles.",
      },
      {
        kind: "interview",
        question:
          "How does ASP.NET Core decide the JSON shape of a response?",
        options: [
          "Randomly.",
          "It uses the public properties of the return type and serializes them with System.Text.Json in camelCase by default. You can change the behavior with options or attributes.",
          "Through XML mapping.",
          "Only with manual code.",
        ],
        correctAnswer:
          "It uses the public properties of the return type and serializes them with System.Text.Json in camelCase by default. You can change the behavior with options or attributes.",
        explanation:
          "Defaults work for most cases. You only customize when you need to.",
      },
    ],
  },

  "postman-examples": {
    whyItMatters:
      "Postman is one of the most common tools for testing APIs. Knowing how to send requests, manage environments, and save collections makes you faster at testing, debugging, and demonstrating your .NET APIs.",
    simpleExplanation:
      "Postman is a desktop tool for sending HTTP requests. You enter the URL, choose a method, add headers and a body, and send the request. The response appears in the bottom panel.",
    deepExplanation:
      "Postman organizes requests in collections so you can save and rerun them. Environments let you switch between development, staging, and production without changing each URL by hand. Variables like {{baseUrl}} make requests portable. Pre-request scripts and tests let you automate token generation and assertions. Teams use Postman to share API tests and document endpoints.",
    realWorldUsage:
      "A team builds a Postman collection for every API. A new team member imports the collection and can test every endpoint immediately. CI pipelines use Newman (Postman's CLI) to run the collection on every build. QA testers use Postman to reproduce bugs.",
    explainLikeBeginner:
      "Postman is like a remote control for your API. You press a button (send) and it triggers an action on the server. You can save the buttons in a collection so you can use them again later.",
    interviewAnswer:
      "Postman is a tool for testing HTTP APIs. .NET developers use it to send requests, save collections, set environment variables for different stages, and share tests with the team. It is a daily tool in real .NET work.",
    commonMistakes: [
      "Sending requests without setting Content-Type for the body.",
      "Hard-coding base URLs instead of using environment variables.",
      "Forgetting to set Authorization headers for protected endpoints.",
    ],
    bestPractices: [
      "Save every endpoint in a collection.",
      "Use environments and variables like {{baseUrl}} and {{token}}.",
      "Add tests to assert the status code and key response fields.",
    ],
    summary: [
      "Postman sends HTTP requests and shows responses.",
      "Collections, environments, and variables make it scale to real teams.",
      "It is the standard tool for testing .NET APIs by hand.",
    ],
    codeExample: {
      title: "A typical Postman request configuration",
      code: `Method:  POST
URL:     {{baseUrl}}/api/customers

Headers:
  Content-Type: application/json
  Authorization: Bearer {{token}}

Body (raw, JSON):
{
  "name": "Ali",
  "email": "ali@example.com"
}

Tests tab:
pm.test("Status is 200", function () {
    pm.response.to.have.status(200);
});
pm.test("Has id", function () {
    const data = pm.response.json();
    pm.expect(data.id).to.be.a('number');
});`,
      output: "200 OK with { \"id\": 42, \"name\": \"Ali\", \"email\": \"ali@example.com\" }",
      walkthrough: [
        "The URL uses {{baseUrl}}, which Postman replaces with the value from the active environment.",
        "The Authorization header carries a token stored in {{token}}.",
        "The Tests tab uses pm.test to assert the response shape automatically.",
      ],
    },
    practice: {
      prompt:
        "Create a Postman collection with three requests: GET /api/customers, POST /api/customers, and DELETE /api/customers/{id}. Use {{baseUrl}} as a variable. Add a test to the POST request that asserts the response has a numeric Id.",
      expectedResult:
        "The collection contains three requests using the variable. The POST test passes when the server returns a body with a numeric Id.",
      hints: [
        "Create an environment with baseUrl set to https://localhost:5001.",
        "Use {{baseUrl}}/api/customers in the URL of every request.",
        "In the Tests tab of the POST request, write pm.test that checks data.id.",
      ],
      solution:
        "Create a new collection with three requests. Configure an environment with baseUrl. Add the Tests tab assertion to the POST request to validate the response shape.",
    },
    quiz: [
      {
        kind: "concept",
        question: "What is Postman used for?",
        options: [
          "Compiling .NET projects.",
          "Sending HTTP requests, saving collections, and testing APIs manually or with automation.",
          "Building databases.",
          "Deploying to production.",
        ],
        correctAnswer:
          "Sending HTTP requests, saving collections, and testing APIs manually or with automation.",
        explanation:
          "Postman is the standard tool for hand-testing APIs.",
      },
      {
        kind: "code-reading",
        question:
          "What does {{baseUrl}} do in a Postman URL?",
        options: [
          "It is a placeholder that Postman replaces with the value from the active environment.",
          "It causes an error.",
          "It points to localhost only.",
          "It is just text.",
        ],
        correctAnswer:
          "It is a placeholder that Postman replaces with the value from the active environment.",
        explanation:
          "Environment variables make collections portable across development, staging, and production.",
      },
      {
        kind: "spot-the-bug",
        question:
          "Why does this POST request fail?\nMethod: POST\nURL: /api/customers\nBody (raw): { \"name\": \"Ali\" }\nNo Content-Type header set.",
        options: [
          "Nothing.",
          "Without Content-Type: application/json, the server may not deserialize the body as JSON.",
          "POST is not allowed.",
          "The body is too small.",
        ],
        correctAnswer:
          "Without Content-Type: application/json, the server may not deserialize the body as JSON.",
        explanation:
          "Always set Content-Type when sending a body.",
      },
      {
        kind: "interview",
        question:
          "How would you describe how a team uses Postman in real .NET projects?",
        options: [
          "Each developer keeps requests on their own machine.",
          "The team maintains a shared collection in version control or Postman workspaces, uses environments for each stage, and runs the collection in CI with Newman.",
          "Postman is only for QA.",
          "Postman is not used in real teams.",
        ],
        correctAnswer:
          "The team maintains a shared collection in version control or Postman workspaces, uses environments for each stage, and runs the collection in CI with Newman.",
        explanation:
          "A shared collection is one of the easiest ways to document and test an API together.",
      },
    ],
  },

  "curl-examples": {
    whyItMatters:
      "curl is a tiny command-line tool that lets you call any HTTP API from the terminal. It is available everywhere — on every CI server, every container, every Linux machine. Knowing curl is a fast way to test, debug, and document APIs.",
    simpleExplanation:
      "curl is a command-line tool that sends HTTP requests. You give it a URL and options, and it prints the response.",
    deepExplanation:
      "curl supports every HTTP method. -X sets the method. -H adds headers. -d sends a body. -i shows the response headers. -v shows verbose output for debugging. Because curl is plain text, you can paste a curl command into a chat, an issue, or a wiki and anyone can run it. Many API docs include curl examples for this reason.",
    realWorldUsage:
      "A developer uses curl to test an endpoint without opening a UI. A bug report includes the curl command that reproduces the issue. A CI script uses curl to call a deployment webhook. A README documents the API with curl examples that copy-paste cleanly.",
    explainLikeBeginner:
      "curl is like a typewriter for the internet. You type one line, press enter, and you talk directly to a server. No buttons, no menus — just a sentence and an answer.",
    interviewAnswer:
      "curl is a command-line HTTP client. .NET developers use it to test endpoints quickly, reproduce bugs, document APIs, and call services from scripts and pipelines. It is the simplest way to make an HTTP request from the terminal.",
    commonMistakes: [
      "Forgetting -H 'Content-Type: application/json' when sending a JSON body.",
      "Mixing single and double quotes incorrectly on the body.",
      "Using -X GET with -d, which can confuse some servers.",
    ],
    bestPractices: [
      "Always set Content-Type when sending a body.",
      "Use -i or -v when debugging unexpected responses.",
      "Save complex commands in shell scripts so the team can reuse them.",
    ],
    summary: [
      "curl is a small CLI tool for HTTP requests.",
      "Use -X for the method, -H for headers, -d for the body.",
      "It is the easiest way to share API examples in text.",
    ],
    codeExample: {
      title: "Common curl commands for a .NET API",
      code: `# GET a customer
curl -i https://api.example.com/customers/1

# GET with authorization
curl -H "Authorization: Bearer <TOKEN>" https://api.example.com/me

# POST a JSON body
curl -X POST https://api.example.com/customers \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Ali","email":"ali@example.com"}'

# DELETE
curl -X DELETE https://api.example.com/customers/1`,
      output: "HTTP/1.1 200 OK\n... response body ...",
      walkthrough: [
        "-i shows the response status line and headers.",
        "-H adds headers like Authorization or Content-Type.",
        "-d sends a body. The default method becomes POST.",
      ],
    },
    practice: {
      prompt:
        "Write a curl command that sends a PUT request to https://api.example.com/products/1 with a JSON body containing Name = 'Updated Laptop' and Price = 1100. Include the Authorization header.",
      expectedResult:
        "The server receives a PUT request with the correct headers and body and responds with the updated product.",
      hints: [
        "Use -X PUT to set the method.",
        "Use -H to add Content-Type and Authorization headers.",
        "Use -d to send the JSON body, escaping quotes if needed.",
      ],
      solution:
        "curl -X PUT https://api.example.com/products/1 -H 'Content-Type: application/json' -H 'Authorization: Bearer <TOKEN>' -d '{\"name\":\"Updated Laptop\",\"price\":1100}'",
    },
    quiz: [
      {
        kind: "concept",
        question: "What is curl?",
        options: [
          "A .NET package.",
          "A command-line tool for sending HTTP requests.",
          "A database client.",
          "A test framework.",
        ],
        correctAnswer:
          "A command-line tool for sending HTTP requests.",
        explanation:
          "curl is the easiest way to make an HTTP request from a terminal or a script.",
      },
      {
        kind: "code-reading",
        question:
          "What does this command do?\n`curl -X POST https://api.example.com/orders -H 'Content-Type: application/json' -d '{\"id\":1}'`",
        options: [
          "Sends a GET request.",
          "Sends a POST request to /orders with a JSON body { \"id\": 1 }.",
          "Reads a file.",
          "Deletes a record.",
        ],
        correctAnswer:
          "Sends a POST request to /orders with a JSON body { \"id\": 1 }.",
        explanation:
          "-X sets the method, -H adds the Content-Type header, and -d sends the body.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is missing here?\n`curl -X POST https://api.example.com/orders -d '{\"id\":1}'`",
        options: [
          "Nothing.",
          "The Content-Type: application/json header is missing, so the server may not deserialize the body as JSON.",
          "The method is wrong.",
          "It needs a query string.",
        ],
        correctAnswer:
          "The Content-Type: application/json header is missing, so the server may not deserialize the body as JSON.",
        explanation:
          "Always include the Content-Type header when sending a body.",
      },
      {
        kind: "interview",
        question:
          "Why is curl useful in real .NET work?",
        options: [
          "It is faster than Postman.",
          "It is available everywhere, easy to share as text, and works well in scripts, README files, bug reports, and CI pipelines.",
          "It is required for compilation.",
          "It replaces HttpClient.",
        ],
        correctAnswer:
          "It is available everywhere, easy to share as text, and works well in scripts, README files, bug reports, and CI pipelines.",
        explanation:
          "curl is the simplest, most portable way to demonstrate an API call.",
      },
    ],
  },

  "swagger-examples": {
    whyItMatters:
      "Swagger (OpenAPI) gives your API a clear, interactive document and a 'try it out' UI for free. It saves time during development, helps the team agree on the contract, and gives clients a way to explore the API safely.",
    simpleExplanation:
      "Swagger is a tool that generates documentation and an interactive UI from your API. In .NET, you add a small NuGet package and the framework creates the docs automatically based on your controllers and DTOs.",
    deepExplanation:
      "ASP.NET Core has built-in support for OpenAPI documents. Adding Swashbuckle.AspNetCore or Microsoft.AspNetCore.OpenApi turns on the JSON document at /swagger/v1/swagger.json and the interactive UI at /swagger. The document includes every endpoint, parameter, request DTO, response DTO, and status code. The UI lets developers and partners send test requests directly from the browser. You can add summaries, examples, and authentication schemes to make the docs even clearer.",
    realWorldUsage:
      "A new developer joins the team and explores the API through Swagger before reading any code. A frontend team uses the Swagger document to generate a typed client. A partner integration team uses the 'try it out' button to test endpoints. Almost every .NET Web API ships with Swagger enabled in development.",
    explainLikeBeginner:
      "Swagger is like an interactive menu in a restaurant. It shows you every dish available, the ingredients, and lets you order right from the menu. The kitchen prepares your order so you can taste before you commit to anything.",
    interviewAnswer:
      "Swagger, also known as OpenAPI, is a way to document and explore an API. In .NET, we add a NuGet package, and ASP.NET Core generates an interactive UI and a JSON document from the controllers. This makes the API easy to share, test, and integrate with.",
    commonMistakes: [
      "Exposing Swagger in production without authentication.",
      "Skipping XML comments, which makes the docs less useful.",
      "Not updating examples when DTOs change.",
    ],
    bestPractices: [
      "Enable Swagger in development by default and protect it in production.",
      "Add XML comments to controllers and DTOs for clearer docs.",
      "Use [ProducesResponseType] to document the status codes for each action.",
    ],
    summary: [
      "Swagger generates docs and an interactive UI from your API.",
      "It is built into .NET through a small NuGet package.",
      "It is one of the easiest ways to share and explore a real .NET API.",
    ],
    codeExample: {
      title: "Adding Swagger to a .NET Web API",
      code: `// Program.cs
var builder = WebApplication.CreateBuilder(args);

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
app.Run();

// Adding response types to an action
[HttpGet("{id}")]
[ProducesResponseType(typeof(CustomerResponse), 200)]
[ProducesResponseType(404)]
public IActionResult GetById(int id) => Ok();`,
      output: "The Swagger UI is available at /swagger in development.",
      walkthrough: [
        "AddEndpointsApiExplorer and AddSwaggerGen register the Swagger services.",
        "UseSwagger and UseSwaggerUI expose the JSON document and the interactive UI.",
        "ProducesResponseType tells Swagger which status codes and types the action returns.",
      ],
    },
    practice: {
      prompt:
        "Enable Swagger in a small .NET Web API. Add [ProducesResponseType] attributes to a CustomersController so the documentation lists the success and error status codes for the GetById action.",
      expectedResult:
        "Running the API in development and opening /swagger shows the customers endpoints, including the response types and status codes for GetById.",
      hints: [
        "Install Swashbuckle.AspNetCore through dotnet add package.",
        "Call AddEndpointsApiExplorer, AddSwaggerGen, UseSwagger, and UseSwaggerUI in Program.cs.",
        "Add [ProducesResponseType(typeof(CustomerResponse), 200)] and [ProducesResponseType(404)] to the action.",
      ],
      solution:
        "Install the package, register Swagger in Program.cs, and decorate the actions with [ProducesResponseType]. The UI shows every endpoint and its status codes.",
    },
    quiz: [
      {
        kind: "concept",
        question: "What does Swagger do for a .NET Web API?",
        options: [
          "Generates an interactive UI and an OpenAPI document so developers and partners can explore and test the API.",
          "Compiles the project.",
          "Manages the database.",
          "Replaces unit tests.",
        ],
        correctAnswer:
          "Generates an interactive UI and an OpenAPI document so developers and partners can explore and test the API.",
        explanation:
          "Swagger turns your controllers into a clear, interactive document.",
      },
      {
        kind: "code-reading",
        question:
          "What do AddSwaggerGen and UseSwaggerUI do?",
        options: [
          "They are unrelated.",
          "AddSwaggerGen registers the services that build the OpenAPI document. UseSwaggerUI exposes the interactive UI at /swagger.",
          "They send emails.",
          "They open a database connection.",
        ],
        correctAnswer:
          "AddSwaggerGen registers the services that build the OpenAPI document. UseSwaggerUI exposes the interactive UI at /swagger.",
        explanation:
          "Together they wire up the document and the UI.",
      },
      {
        kind: "spot-the-bug",
        question:
          "Why is this risky in production?\n```csharp\napp.UseSwagger();\napp.UseSwaggerUI();\n```",
        options: [
          "Nothing.",
          "Exposing the full API surface in production without authentication can leak information about the system. Protect or disable it outside development.",
          "It uses too much memory.",
          "It blocks deployments.",
        ],
        correctAnswer:
          "Exposing the full API surface in production without authentication can leak information about the system. Protect or disable it outside development.",
        explanation:
          "Either keep Swagger out of production or put it behind authentication.",
      },
      {
        kind: "interview",
        question:
          "How does Swagger help in real .NET projects?",
        options: [
          "It does not.",
          "It provides automatic API docs, an interactive UI for testing, and an OpenAPI document that frontend, mobile, and partner teams can use to generate typed clients.",
          "Only QA uses it.",
          "It is required by EF Core.",
        ],
        correctAnswer:
          "It provides automatic API docs, an interactive UI for testing, and an OpenAPI document that frontend, mobile, and partner teams can use to generate typed clients.",
        explanation:
          "Swagger makes it easy to share, test, and integrate with a .NET API.",
      },
    ],
  },
};
