import type { ModuleContent } from "./types";

export const dtosContent: ModuleContent = {
  "what-is-dto": {
    whyItMatters:
      "DTOs matter because they let you control exactly what your API sends and receives. Without them, you would expose your database entities directly, which leaks sensitive fields like passwords and ties your API to your database schema. DTOs keep your API safe, stable, and predictable.",
    simpleExplanation:
      "A DTO, or Data Transfer Object, is a simple class that holds only the data you want to send or receive through an API. It has properties but no behavior. Think of it as the shape of a request or a response.",
    deepExplanation:
      "A DTO is a plain object with properties only. It does not contain business logic or database details. In a .NET application, you usually have one set of classes for the database (entities) and another set for the API (DTOs). The service layer maps between them. This separation lets you change the database schema without breaking the API, and lets you hide internal fields from external callers.",
    realWorldUsage:
      "CreateOrderRequest is a DTO the API receives when creating an order. OrderResponse is a DTO returned to the client. The internal Order entity stays inside the application. UserDto might expose only Name and Email, while the User entity stores PasswordHash and other private fields.",
    explainLikeBeginner:
      "A DTO is like a menu in a restaurant. The kitchen has many ingredients and tools, but the menu only shows what the customer can order. The menu is clean, simple, and safe to share. A DTO is the same — it only shows what your API exposes.",
    interviewAnswer:
      "A DTO is a simple class used to carry data between layers, especially between the API and the client. We use DTOs to control exactly what data is exposed and to keep the API stable when the database changes. In .NET, DTOs separate the API contract from the entity model.",
    commonMistakes: [
      "Returning database entities directly from controllers, which leaks internal fields.",
      "Building one giant DTO used for every endpoint instead of small, focused ones.",
      "Adding business logic into DTOs — DTOs should only carry data.",
    ],
    bestPractices: [
      "Create one DTO per request or response shape, not one DTO for everything.",
      "Name DTOs clearly, such as CreateOrderRequest, OrderResponse, or CustomerDto.",
      "Map between DTOs and entities in the service layer.",
    ],
    summary: [
      "A DTO is a simple class that carries data in and out of the API.",
      "DTOs separate the API shape from the database shape.",
      "They protect sensitive fields and keep the API stable.",
    ],
    codeExample: {
      title: "A simple CustomerDto used in an API response",
      code: `public class CustomerDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}

var dto = new CustomerDto
{
    Id = 1,
    Name = "Ali",
    Email = "ali@example.com"
};

Console.WriteLine($"{dto.Id}: {dto.Name} ({dto.Email})");`,
      output: "1: Ali (ali@example.com)",
      walkthrough: [
        "CustomerDto has only the fields the API needs.",
        "It does not include internal fields like PasswordHash or CreatedAt.",
        "It has no behavior — just properties to carry data.",
      ],
    },
    practice: {
      prompt:
        "Create a ProductDto class with Id, Name, and Price properties. Use it to return product data from an API. The DTO should not include any internal fields like CostPrice or SupplierId.",
      expectedResult:
        "A ProductDto object can be created with Id = 1, Name = \"Laptop\", Price = 1200, and used as the return value of an API method.",
      hints: [
        "Keep the DTO small and focused.",
        "Do not expose internal pricing or supplier details.",
        "Use simple types like int, string, and decimal.",
      ],
      solution:
        "Create a class ProductDto with public Id, Name, and Price properties. Use it as the return type of a controller action. Map the Product entity to ProductDto in the service layer before returning.",
    },
    quiz: [
      {
        kind: "concept",
        question: "What is a DTO?",
        options: [
          "A class that contains business logic.",
          "A simple class used to carry data between the API and other layers.",
          "A type of database table.",
          "A method that processes payments.",
        ],
        correctAnswer:
          "A simple class used to carry data between the API and other layers.",
        explanation:
          "A DTO is a plain class with properties only. It carries data, not behavior.",
      },
      {
        kind: "code-reading",
        question:
          "What kind of fields should a CustomerDto have?\n```csharp\npublic class CustomerDto\n{\n    public int Id { get; set; }\n    public string Name { get; set; }\n    public string PasswordHash { get; set; }\n}\n```",
        options: [
          "All fields are fine.",
          "PasswordHash should not be in a DTO returned to the client. Only safe, public fields belong in a response DTO.",
          "Id should be removed.",
          "Name should be a method.",
        ],
        correctAnswer:
          "PasswordHash should not be in a DTO returned to the client. Only safe, public fields belong in a response DTO.",
        explanation:
          "Sensitive fields like password hashes must never appear in DTOs returned by the API.",
      },
      {
        kind: "spot-the-bug",
        question:
          "Why is returning the User entity directly from a controller a bad idea?",
        options: [
          "It is faster than DTOs.",
          "It can leak internal fields like PasswordHash, and it ties the API contract to the database schema.",
          "It compiles slower.",
          "It is required by REST.",
        ],
        correctAnswer:
          "It can leak internal fields like PasswordHash, and it ties the API contract to the database schema.",
        explanation:
          "Returning entities exposes internal data and makes the API fragile when the database changes.",
      },
      {
        kind: "interview",
        question:
          "How would you explain DTOs in an interview?",
        options: [
          "They are required by C#.",
          "A DTO is a simple class used to carry data through the API. It keeps internal fields hidden and makes the API contract stable even when the database changes.",
          "They are the same as entities.",
          "They make code faster.",
        ],
        correctAnswer:
          "A DTO is a simple class used to carry data through the API. It keeps internal fields hidden and makes the API contract stable even when the database changes.",
        explanation:
          "This answer covers both the definition and the main benefit.",
      },
    ],
  },

  "why-dtos-are-used": {
    whyItMatters:
      "Using DTOs is one of the simplest ways to keep your .NET application safe and maintainable. Without DTOs, every database change can break your API contract, and you risk leaking sensitive data to the client. With DTOs, your API is stable, predictable, and easy to evolve.",
    simpleExplanation:
      "DTOs are used to control what your API exposes. They protect internal fields, keep the API stable, and make request and response shapes clear and focused.",
    deepExplanation:
      "DTOs solve four common problems. First, they protect sensitive fields like passwords, internal IDs, and audit data. Second, they keep the API contract stable when the database schema changes. Third, they let you shape data exactly for the client — combining fields, renaming them, or hiding them. Fourth, they make validation easier because each request DTO can have its own rules. Together, these benefits make DTOs almost mandatory in real .NET projects.",
    realWorldUsage:
      "An e-commerce API uses OrderRequest for incoming data, OrderResponse for outgoing data, and the Order entity inside the database. A user registration endpoint takes a RegisterUserRequest DTO with only Email, Password, and Name — never the full User entity. Each DTO is designed for one specific use case.",
    explainLikeBeginner:
      "Think of DTOs like envelopes. You do not give someone the entire filing cabinet — you put only the right papers into a clean envelope and send it. The envelope is the DTO. The filing cabinet is the database.",
    interviewAnswer:
      "DTOs are used to protect internal data, keep the API contract stable, shape data for the client, and make validation cleaner. In real .NET projects, every external request and response goes through a DTO instead of the entity.",
    commonMistakes: [
      "Skipping DTOs to save time and exposing entities directly.",
      "Reusing the same DTO for both input and output even when the shapes differ.",
      "Forgetting that DTOs should not contain business logic or database details.",
    ],
    bestPractices: [
      "Have separate DTOs for requests and responses when they differ.",
      "Validate request DTOs at the API boundary.",
      "Keep each DTO focused on one use case.",
    ],
    summary: [
      "DTOs protect internal data from being exposed.",
      "They keep the API stable when the database changes.",
      "They make validation and mapping cleaner.",
    ],
    codeExample: {
      title: "Separate request and response DTOs for an order endpoint",
      code: `public class CreateOrderRequest
{
    public int CustomerId { get; set; }
    public List<OrderItemDto> Items { get; set; } = new();
}

public class OrderResponse
{
    public int Id { get; set; }
    public string Status { get; set; } = "Pending";
    public decimal Total { get; set; }
}

public class OrderItemDto
{
    public string Sku { get; set; } = string.Empty;
    public int Quantity { get; set; }
}`,
      output: "Two clean DTOs: one for input, one for output.",
      walkthrough: [
        "CreateOrderRequest holds only what the client sends.",
        "OrderResponse holds only what the client should see.",
        "Both are simple and focused on one job.",
      ],
    },
    practice: {
      prompt:
        "Design two DTOs for a user registration endpoint: RegisterUserRequest (with Email, Password, and Name) and UserResponse (with Id, Email, and Name — no password).",
      expectedResult:
        "RegisterUserRequest contains Password. UserResponse never returns Password, only safe fields.",
      hints: [
        "Use string for all three text fields.",
        "Keep the Password field only in the request, not in the response.",
        "Add an Id property to UserResponse.",
      ],
      solution:
        "Create RegisterUserRequest with Email, Password, Name. Create UserResponse with Id, Email, Name. The API receives the request DTO, creates the user, and returns the response DTO without the password.",
    },
    quiz: [
      {
        kind: "concept",
        question: "Which is a real reason to use DTOs?",
        options: [
          "DTOs make the application faster.",
          "DTOs protect internal data, keep the API stable, and shape data for the client.",
          "DTOs are required by C#.",
          "DTOs replace controllers.",
        ],
        correctAnswer:
          "DTOs protect internal data, keep the API stable, and shape data for the client.",
        explanation:
          "These are the main benefits of using DTOs in a .NET application.",
      },
      {
        kind: "code-reading",
        question:
          "Why is having both CreateOrderRequest and OrderResponse better than one OrderDto?",
        options: [
          "It is not — one DTO is always enough.",
          "Input and output usually have different shapes. Separate DTOs make each endpoint clear and prevent leaking fields the client should not send or see.",
          "It makes the code shorter.",
          "It speeds up the database.",
        ],
        correctAnswer:
          "Input and output usually have different shapes. Separate DTOs make each endpoint clear and prevent leaking fields the client should not send or see.",
        explanation:
          "Different use cases deserve different DTOs. It keeps each one small and focused.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is wrong with this DTO?\n```csharp\npublic class UserDto\n{\n    public string Email { get; set; }\n    public string PasswordHash { get; set; }\n    public bool IsAdmin { get; set; }\n}\n```",
        options: [
          "Nothing.",
          "PasswordHash and IsAdmin are internal fields. They should not be returned to the client.",
          "Email should be removed.",
          "DTOs should be sealed.",
        ],
        correctAnswer:
          "PasswordHash and IsAdmin are internal fields. They should not be returned to the client.",
        explanation:
          "Response DTOs must expose only safe fields. Internal flags and security data stay inside the application.",
      },
      {
        kind: "interview",
        question:
          "What are the main benefits of using DTOs?",
        options: [
          "Faster builds.",
          "Smaller binaries.",
          "Cleaner API contracts, safer data, easier validation, and stable behavior when the database changes.",
          "They are required by EF Core.",
        ],
        correctAnswer:
          "Cleaner API contracts, safer data, easier validation, and stable behavior when the database changes.",
        explanation:
          "This covers protection, stability, and clarity — the main reasons DTOs are used.",
      },
    ],
  },

  "request-dto": {
    whyItMatters:
      "A request DTO defines exactly what your API accepts. It makes the contract clear, makes validation easy, and protects the application from invalid or malicious input. Without it, your controllers become messy and unsafe.",
    simpleExplanation:
      "A request DTO is the class your API uses to receive data. It defines the shape of the incoming request — the fields, types, and validation rules.",
    deepExplanation:
      "When a client sends a request, ASP.NET Core deserializes the JSON body into a request DTO. The DTO acts as a contract: it tells the framework which fields to read and which to ignore. With data annotations like [Required] and [Range], the framework can validate the input automatically and return a 400 Bad Request when something is wrong. This keeps the controller code clean and focused on the business logic.",
    realWorldUsage:
      "CreateOrderRequest carries CustomerId and a list of items. RegisterUserRequest carries Email, Password, and Name. UpdateAddressRequest carries the new street, city, and country. Each request DTO matches one specific endpoint, and each one has its own validation rules.",
    explainLikeBeginner:
      "A request DTO is like a form on a website. The form lists the exact fields the user must fill in. The website only accepts those fields and ignores everything else. The DTO is the same — only the listed fields are accepted.",
    interviewAnswer:
      "A request DTO is the class used to receive data from the client. It defines the shape and the validation rules for the incoming request. In ASP.NET Core, the framework deserializes JSON into the DTO and validates it automatically using data annotations.",
    commonMistakes: [
      "Using the entity as the request DTO and accepting unwanted fields.",
      "Skipping validation rules on the request DTO.",
      "Making the request DTO too large by including fields the endpoint does not use.",
    ],
    bestPractices: [
      "Keep request DTOs small and specific to one endpoint.",
      "Add validation rules with [Required], [Range], [EmailAddress], or FluentValidation.",
      "Never use the entity directly as the request DTO.",
    ],
    summary: [
      "A request DTO defines the shape of incoming data.",
      "It carries validation rules for the input.",
      "It keeps the controller focused and safe.",
    ],
    codeExample: {
      title: "A request DTO for creating a customer",
      code: `using System.ComponentModel.DataAnnotations;

public class CreateCustomerRequest
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
}

[HttpPost]
public IActionResult Create(CreateCustomerRequest request)
{
    if (!ModelState.IsValid) return BadRequest(ModelState);
    return Ok($"Customer {request.Name} created");
}`,
      output: "Customer Ali created",
      walkthrough: [
        "CreateCustomerRequest defines the shape of the input.",
        "Validation attributes describe what counts as valid data.",
        "ASP.NET Core checks the rules automatically and returns 400 when they fail.",
      ],
    },
    practice: {
      prompt:
        "Create a request DTO called CreateProductRequest with Name (required, max 200 chars), Price (required, must be positive), and an optional Description. Add validation attributes so invalid input returns 400 Bad Request.",
      expectedResult:
        "A valid request returns 200 with the created product. A request with missing Name or negative Price returns 400 with validation errors.",
      hints: [
        "Use [Required] and [MaxLength(200)] on Name.",
        "Use [Range(0.01, double.MaxValue)] on Price.",
        "Description has no validation since it is optional.",
      ],
      solution:
        "Define CreateProductRequest with Name, Price, and Description. Add [Required] and [MaxLength] on Name, and [Range] on Price. The controller checks ModelState.IsValid and returns BadRequest if not.",
    },
    quiz: [
      {
        kind: "concept",
        question: "What is a request DTO?",
        options: [
          "The entity stored in the database.",
          "The class used to receive data from the client.",
          "A type of database table.",
          "A controller action.",
        ],
        correctAnswer:
          "The class used to receive data from the client.",
        explanation:
          "A request DTO defines the shape of the incoming request.",
      },
      {
        kind: "code-reading",
        question:
          "What happens when the client sends a request with an empty Name to this endpoint?\n```csharp\npublic class CreateCustomerRequest\n{\n    [Required] public string Name { get; set; } = string.Empty;\n}\n```",
        options: [
          "The request is accepted.",
          "ModelState.IsValid is false, and the framework returns 400 Bad Request.",
          "The request throws a 500 error.",
          "The Name is replaced with a default value.",
        ],
        correctAnswer:
          "ModelState.IsValid is false, and the framework returns 400 Bad Request.",
        explanation:
          "The [Required] attribute triggers a model validation error, which results in a 400 response.",
      },
      {
        kind: "spot-the-bug",
        question:
          "Why is this controller action risky?\n```csharp\n[HttpPost]\npublic IActionResult Create(User user)\n{\n    _db.Users.Add(user);\n    _db.SaveChanges();\n    return Ok();\n}\n```",
        options: [
          "Nothing is wrong.",
          "It uses the User entity as the request DTO. A client could send fields like IsAdmin or PasswordHash and modify them directly.",
          "The method is missing await.",
          "User must be sealed.",
        ],
        correctAnswer:
          "It uses the User entity as the request DTO. A client could send fields like IsAdmin or PasswordHash and modify them directly.",
        explanation:
          "Always use a dedicated request DTO with only the fields the endpoint should accept.",
      },
      {
        kind: "interview",
        question:
          "How would you describe a request DTO to another .NET developer?",
        options: [
          "It is the same as the entity.",
          "It is the class that defines the shape of the incoming request, including validation rules, so the controller stays clean and safe.",
          "It is a database table.",
          "It is required by EF Core.",
        ],
        correctAnswer:
          "It is the class that defines the shape of the incoming request, including validation rules, so the controller stays clean and safe.",
        explanation:
          "This explains both the role and the value of a request DTO.",
      },
    ],
  },

  "response-dto": {
    whyItMatters:
      "A response DTO controls exactly what your API returns to the client. It prevents leaking internal fields, keeps the response shape stable, and makes the API easier to consume from frontend or partner applications.",
    simpleExplanation:
      "A response DTO is the class your API uses to send data back to the client. It contains only the fields the client should see.",
    deepExplanation:
      "When a request is processed, the service maps the result into a response DTO and returns it. The DTO is serialized to JSON by ASP.NET Core. Because the DTO is separate from the entity, you can hide internal fields, rename fields for the client, or combine data from multiple sources into a single response. This makes your API stable even when the underlying data changes.",
    realWorldUsage:
      "OrderResponse contains Id, Status, and Total. CustomerResponse contains Id, Name, and Email — never PasswordHash or internal flags. InvoiceResponse can combine Invoice and Customer fields into one clean shape for the client. Each response DTO is designed for a specific endpoint.",
    explainLikeBeginner:
      "A response DTO is like a printed receipt. It shows only the information the customer needs — total, items, date. It does not show the cost price, the supplier, or the storage room number. The receipt is the response. The internal data stays in the store.",
    interviewAnswer:
      "A response DTO is the class used to return data from the API. It controls what the client sees and protects internal fields. We use it to keep the API contract stable and to shape the response exactly for the client.",
    commonMistakes: [
      "Returning the database entity directly and exposing internal fields.",
      "Reusing the request DTO as the response DTO when the shapes are different.",
      "Including too many fields the client does not need.",
    ],
    bestPractices: [
      "Map entities to response DTOs in the service layer.",
      "Keep response DTOs focused on one endpoint.",
      "Hide sensitive fields like password hashes, internal IDs, and audit data.",
    ],
    summary: [
      "A response DTO defines the shape of outgoing data.",
      "It hides internal fields from the client.",
      "It keeps the API contract stable when the database changes.",
    ],
    codeExample: {
      title: "A response DTO returned from a GET endpoint",
      code: `public class OrderResponse
{
    public int Id { get; set; }
    public string Status { get; set; } = string.Empty;
    public decimal Total { get; set; }
}

[HttpGet("{id}")]
public ActionResult<OrderResponse> GetById(int id)
{
    var order = _orders.GetById(id);
    if (order == null) return NotFound();

    return Ok(new OrderResponse
    {
        Id = order.Id,
        Status = order.Status,
        Total = order.Lines.Sum(l => l.Price * l.Quantity)
    });
}`,
      output: "{ \"id\": 1, \"status\": \"Confirmed\", \"total\": 99.50 }",
      walkthrough: [
        "OrderResponse contains only the fields the client should see.",
        "The controller maps the Order entity to OrderResponse before returning.",
        "Internal fields like CreatedBy or InternalNotes never leave the application.",
      ],
    },
    practice: {
      prompt:
        "Create a CustomerResponse DTO with Id, Name, and Email. Build a GET endpoint that loads a customer entity and returns the response DTO. Make sure the Password field is never returned.",
      expectedResult:
        "Calling GET /api/customers/1 returns a JSON body with Id, Name, and Email only.",
      hints: [
        "Define CustomerResponse with three properties.",
        "Map the Customer entity to CustomerResponse inside the controller or service.",
        "Never include Password or other sensitive fields in the response DTO.",
      ],
      solution:
        "Define CustomerResponse with Id, Name, Email. Load the customer entity, map it into a new CustomerResponse, and return Ok(response). Password stays inside the entity and is never included.",
    },
    quiz: [
      {
        kind: "concept",
        question: "What is the main purpose of a response DTO?",
        options: [
          "To replace the database.",
          "To define the exact shape of what the API returns to the client.",
          "To make the application faster.",
          "To validate incoming data.",
        ],
        correctAnswer:
          "To define the exact shape of what the API returns to the client.",
        explanation:
          "Response DTOs control what the client sees and protect internal fields.",
      },
      {
        kind: "code-reading",
        question:
          "Why does this code map the entity into an OrderResponse before returning?\n```csharp\nreturn Ok(new OrderResponse { Id = order.Id, Status = order.Status });\n```",
        options: [
          "To make the code longer.",
          "To control what the client sees and avoid leaking internal fields from the Order entity.",
          "It is required by C#.",
          "To improve performance.",
        ],
        correctAnswer:
          "To control what the client sees and avoid leaking internal fields from the Order entity.",
        explanation:
          "Mapping to a response DTO is what protects the API from exposing internal data.",
      },
      {
        kind: "spot-the-bug",
        question:
          "Why is this controller risky?\n```csharp\n[HttpGet(\"{id}\")]\npublic ActionResult<User> Get(int id) => _db.Users.Find(id);\n```",
        options: [
          "Nothing is wrong.",
          "It returns the User entity directly, which can leak fields like PasswordHash and InternalNotes.",
          "It needs await.",
          "It needs a try-catch.",
        ],
        correctAnswer:
          "It returns the User entity directly, which can leak fields like PasswordHash and InternalNotes.",
        explanation:
          "Always return a response DTO that exposes only the safe fields.",
      },
      {
        kind: "interview",
        question:
          "How does a response DTO help when the database schema changes?",
        options: [
          "It does not.",
          "The DTO keeps the API contract stable. You can change the entity without changing the response, as long as the mapping still produces the same shape.",
          "It blocks schema changes.",
          "It is unrelated.",
        ],
        correctAnswer:
          "The DTO keeps the API contract stable. You can change the entity without changing the response, as long as the mapping still produces the same shape.",
        explanation:
          "Decoupling the API from the database is one of the main reasons we use response DTOs.",
      },
    ],
  },

  "entity-vs-dto": {
    whyItMatters:
      "Knowing the difference between an entity and a DTO is one of the most important habits in .NET. Mixing them up leaks data, ties your API to your database, and makes the project hard to change later.",
    simpleExplanation:
      "An entity is the class that represents a database table. A DTO is the class that represents data sent or received through the API. They look similar but serve different jobs.",
    deepExplanation:
      "The entity is part of the data layer. It usually has database attributes, navigation properties, and audit fields. It is tracked by EF Core. The DTO is part of the API layer. It is simple, focused, and has no database knowledge. The service layer maps between them. Keeping these two separate is what allows the database and the API to change independently.",
    realWorldUsage:
      "Order is an entity with Id, CreatedAt, CustomerId, and a navigation property to OrderLines. OrderResponse is a DTO with Id, Status, and Total. The service layer loads the entity and maps it into the DTO before returning. The entity stays inside the application, and the DTO travels to the client.",
    explainLikeBeginner:
      "An entity is like the original document stored in a filing cabinet. A DTO is the photocopy with only the important parts highlighted that you send to someone else. The original stays safe. The copy is shared.",
    interviewAnswer:
      "An entity represents a row in the database. It is used by EF Core and contains all the fields stored. A DTO represents the shape of data carried through the API. We separate them so the database schema and the API contract can evolve independently.",
    commonMistakes: [
      "Using the entity as the API request or response.",
      "Adding API-specific fields to the entity, which pollutes the data model.",
      "Adding database attributes to a DTO, which leaks data concerns into the API layer.",
    ],
    bestPractices: [
      "Keep entities focused on the database. Keep DTOs focused on the API.",
      "Map between them in the service layer.",
      "Never expose entities directly through controllers.",
    ],
    summary: [
      "Entity = database shape.",
      "DTO = API shape.",
      "Keep them separate so each layer can change on its own.",
    ],
    codeExample: {
      title: "Order entity vs OrderResponse DTO",
      code: `// Entity (database)
public class Order
{
    public int Id { get; set; }
    public int CustomerId { get; set; }
    public string Status { get; set; } = "Pending";
    public DateTime CreatedAt { get; set; }
    public string? InternalNotes { get; set; }
    public List<OrderLine> Lines { get; set; } = new();
}

// DTO (API)
public class OrderResponse
{
    public int Id { get; set; }
    public string Status { get; set; } = string.Empty;
    public decimal Total { get; set; }
}`,
      output: "Two classes — one for storage, one for the API.",
      walkthrough: [
        "Order has database details like CreatedAt and InternalNotes.",
        "OrderResponse exposes only what the client needs.",
        "The two evolve independently — the database can change without breaking the API.",
      ],
    },
    practice: {
      prompt:
        "Define a Customer entity with Id, Name, Email, PasswordHash, and CreatedAt. Then define a CustomerResponse DTO with only Id, Name, and Email. Write a method that maps a Customer to a CustomerResponse.",
      expectedResult:
        "Given a Customer { Id = 1, Name = \"Ali\", Email = \"ali@example.com\", PasswordHash = \"x\", CreatedAt = now }, the mapping returns a CustomerResponse with Id, Name, and Email only.",
      hints: [
        "Customer has all five fields.",
        "CustomerResponse has only three fields.",
        "The mapping method creates a new CustomerResponse and copies only the safe fields.",
      ],
      solution:
        "Define Customer and CustomerResponse as separate classes. Add a method static CustomerResponse ToDto(Customer c) that returns new CustomerResponse { Id = c.Id, Name = c.Name, Email = c.Email }.",
    },
    quiz: [
      {
        kind: "concept",
        question: "What is the difference between an entity and a DTO?",
        options: [
          "They are the same thing.",
          "Entity = database shape, DTO = API shape. They serve different jobs and live in different layers.",
          "An entity is faster.",
          "A DTO replaces the entity.",
        ],
        correctAnswer:
          "Entity = database shape, DTO = API shape. They serve different jobs and live in different layers.",
        explanation:
          "Entities belong to the data layer; DTOs belong to the API layer.",
      },
      {
        kind: "code-reading",
        question:
          "Why does OrderResponse not include InternalNotes from the Order entity?",
        options: [
          "It is not used.",
          "InternalNotes is an internal field. Response DTOs only expose what the client should see.",
          "It would not compile.",
          "It is a database column.",
        ],
        correctAnswer:
          "InternalNotes is an internal field. Response DTOs only expose what the client should see.",
        explanation:
          "Hiding internal fields is one of the main reasons we use DTOs.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is wrong with this design?\n```csharp\npublic class Order\n{\n    [JsonPropertyName(\"order_id\")]\n    public int Id { get; set; }\n    [Key]\n    public int DbId { get; set; }\n}\n```",
        options: [
          "Nothing.",
          "It mixes API serialization attributes and database key attributes in one class. The entity and the DTO should be separate.",
          "It needs a constructor.",
          "It will not compile.",
        ],
        correctAnswer:
          "It mixes API serialization attributes and database key attributes in one class. The entity and the DTO should be separate.",
        explanation:
          "Mixing concerns in one class makes both the API and the database harder to change later.",
      },
      {
        kind: "interview",
        question:
          "How would you explain entity vs DTO in an interview?",
        options: [
          "They are interchangeable.",
          "An entity represents a database row and lives in the data layer. A DTO represents data carried through the API and lives in the API layer. We map between them to keep each layer focused.",
          "DTOs replace entities in EF Core.",
          "Entities are slower than DTOs.",
        ],
        correctAnswer:
          "An entity represents a database row and lives in the data layer. A DTO represents data carried through the API and lives in the API layer. We map between them to keep each layer focused.",
        explanation:
          "This is the clean separation that real .NET projects rely on.",
      },
    ],
  },

  "mapping-dto-to-entity": {
    whyItMatters:
      "Mapping connects your API and your database. Done well, it keeps the two layers independent and easy to change. Done badly, it leaks data, duplicates work, and creates hidden bugs that show up months later.",
    simpleExplanation:
      "Mapping means converting between an entity and a DTO. You take the fields from one and copy them into the other. You can do this by hand or with a library like AutoMapper.",
    deepExplanation:
      "There are two common approaches. Manual mapping is simple, explicit, and easy to read — you write a method that creates a DTO from an entity, or an entity from a DTO. AutoMapper or Mapster is faster to write for large objects but adds a library and some indirection. Both are valid. The mapping always happens in the service layer, never inside the controller or the entity itself.",
    realWorldUsage:
      "An OrderService loads an Order entity, then maps it to an OrderResponse using a static method or AutoMapper. A CreateOrderRequest from the client is mapped to a new Order entity inside the service before being saved. A CustomerService updates a Customer entity from an UpdateCustomerRequest, only changing the fields that are present.",
    explainLikeBeginner:
      "Mapping is like packing a suitcase for a trip. The closet has all your clothes (the entity). You pack only the right ones (the DTO) and zip it up. You do not bring the whole closet.",
    interviewAnswer:
      "Mapping is the process of converting between an entity and a DTO. In .NET, we do this in the service layer either manually or with libraries like AutoMapper. Mapping keeps the entity and the DTO independent and makes it easy to change either side without breaking the other.",
    commonMistakes: [
      "Mapping inside the controller instead of the service layer.",
      "Mapping every field even when some should be hidden.",
      "Relying on AutoMapper for complex logic that should live in the service.",
    ],
    bestPractices: [
      "Do mapping in the service layer.",
      "Start with manual mapping for small projects. Use AutoMapper for large object graphs.",
      "Test the mapping logic with simple unit tests.",
    ],
    summary: [
      "Mapping converts between entities and DTOs.",
      "Manual mapping is clear. AutoMapper saves time for large objects.",
      "Mapping belongs in the service layer.",
    ],
    codeExample: {
      title: "Manual mapping between Customer entity and CustomerDto",
      code: `public class Customer
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
}

public class CustomerDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}

public static class CustomerMappings
{
    public static CustomerDto ToDto(this Customer c) => new()
    {
        Id = c.Id,
        Name = c.Name,
        Email = c.Email
    };
}`,
      output: "A clean, explicit mapping method that hides PasswordHash.",
      walkthrough: [
        "The Customer entity has all the database fields.",
        "CustomerDto exposes only safe fields.",
        "The ToDto extension method copies the safe fields and ignores the rest.",
      ],
    },
    practice: {
      prompt:
        "Write a mapping method that converts a CreateOrderRequest (with CustomerId and a list of OrderItemDto) into a new Order entity. The Order should start with Status = \"Pending\" and CreatedAt = DateTime.UtcNow.",
      expectedResult:
        "Given a CreateOrderRequest with CustomerId = 1 and one item, the method returns an Order with the same CustomerId, Status = \"Pending\", CreatedAt set to now, and one OrderLine.",
      hints: [
        "Create a new Order, copy CustomerId, and set Status and CreatedAt.",
        "Loop through the request items and map each one to an OrderLine.",
        "Return the new Order.",
      ],
      solution:
        "Write a static method ToEntity(CreateOrderRequest request) that returns a new Order with CustomerId copied, Status set to Pending, CreatedAt set to UtcNow, and Lines mapped from the request items.",
    },
    quiz: [
      {
        kind: "concept",
        question: "Where should mapping between DTOs and entities happen?",
        options: [
          "Inside the entity.",
          "Inside the controller.",
          "Inside the service or a dedicated mapping class.",
          "Inside the database.",
        ],
        correctAnswer:
          "Inside the service or a dedicated mapping class.",
        explanation:
          "Mapping belongs in the service layer to keep the controller thin and the entity clean.",
      },
      {
        kind: "code-reading",
        question:
          "What does this extension method do?\n```csharp\npublic static CustomerDto ToDto(this Customer c) => new() { Id = c.Id, Name = c.Name, Email = c.Email };\n```",
        options: [
          "It deletes a customer.",
          "It maps a Customer entity to a CustomerDto by copying the safe fields.",
          "It saves a customer.",
          "It updates the database.",
        ],
        correctAnswer:
          "It maps a Customer entity to a CustomerDto by copying the safe fields.",
        explanation:
          "Manual mapping methods are simple, explicit, and easy to test.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is wrong with this mapping?\n```csharp\nvar dto = new CustomerDto\n{\n    Id = c.Id,\n    Name = c.Name,\n    PasswordHash = c.PasswordHash\n};\n```",
        options: [
          "Nothing.",
          "PasswordHash is being copied into a DTO that will be returned to the client. Internal data should never appear in a response DTO.",
          "It needs a try-catch.",
          "It needs async.",
        ],
        correctAnswer:
          "PasswordHash is being copied into a DTO that will be returned to the client. Internal data should never appear in a response DTO.",
        explanation:
          "Always check that mapping copies only the fields the client should see.",
      },
      {
        kind: "interview",
        question:
          "Manual mapping or AutoMapper — which is better?",
        options: [
          "Manual mapping is always better.",
          "AutoMapper is always better.",
          "Both are valid. Manual mapping is clear and explicit for small projects. AutoMapper saves time for large object graphs but adds a library and some indirection.",
          "Neither is needed.",
        ],
        correctAnswer:
          "Both are valid. Manual mapping is clear and explicit for small projects. AutoMapper saves time for large object graphs but adds a library and some indirection.",
        explanation:
          "The choice depends on the size of the project and the team's preference.",
      },
    ],
  },

  "simple-api-with-dtos": {
    whyItMatters:
      "Putting it all together with DTOs is what real .NET APIs look like. A clean controller, a service that handles the work, and DTOs at the edges — this is the pattern you will use every day. Knowing how to build it from scratch gives you the foundation for any feature.",
    simpleExplanation:
      "A simple API with DTOs has three pieces: a request DTO for the input, a response DTO for the output, and a controller method that calls a service. The service does the work and uses entities internally.",
    deepExplanation:
      "The controller is thin. It receives a request DTO, asks the service to do the work, and returns a response DTO. The service uses entities internally. It maps from the request DTO into a new entity, saves it through a repository or DbContext, then maps the entity back into a response DTO. This pattern keeps every layer focused on one job, which makes the code easy to read, test, and change.",
    realWorldUsage:
      "An e-commerce API has a CartController that takes an AddItemRequest and returns a CartResponse. A user service has a UsersController with RegisterUserRequest and UserResponse. A reporting service has a ReportsController with GenerateReportRequest and ReportResponse. The shape is the same in every case.",
    explainLikeBeginner:
      "A simple API with DTOs is like ordering food. The waiter takes your order on a form (request DTO), the kitchen prepares your meal (service), and the waiter brings back your dish with a receipt (response DTO). You never see the kitchen, and the kitchen never talks to you directly.",
    interviewAnswer:
      "A simple API with DTOs uses a request DTO for input, a service to handle the work, and a response DTO for output. The controller stays thin, the service contains the logic, and the entity stays inside the application. This pattern is used in almost every modern .NET API.",
    commonMistakes: [
      "Putting business logic inside the controller.",
      "Returning entities directly instead of mapping to a response DTO.",
      "Skipping validation on the request DTO.",
    ],
    bestPractices: [
      "Keep controllers thin — they only handle HTTP and call services.",
      "Keep services focused on the business logic.",
      "Validate the request DTO before processing.",
    ],
    summary: [
      "Request DTO in. Response DTO out.",
      "Controller is thin. Service does the work.",
      "Entities stay inside the application.",
    ],
    codeExample: {
      title: "A complete create-customer endpoint with DTOs",
      code: `public class CreateCustomerRequest
{
    [Required] public string Name { get; set; } = string.Empty;
    [Required, EmailAddress] public string Email { get; set; } = string.Empty;
}

public class CustomerResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}

[ApiController]
[Route("api/customers")]
public class CustomersController : ControllerBase
{
    private readonly ICustomerService _service;
    public CustomersController(ICustomerService service) => _service = service;

    [HttpPost]
    public async Task<ActionResult<CustomerResponse>> Create(CreateCustomerRequest request)
    {
        var created = await _service.CreateAsync(request);
        return Ok(created);
    }
}`,
      output: "200 OK with { id, name, email } in the response body",
      walkthrough: [
        "The controller accepts a CreateCustomerRequest as input.",
        "It calls the service, which handles the real work.",
        "The service returns a CustomerResponse, which is sent back to the client.",
      ],
    },
    practice: {
      prompt:
        "Build a complete POST endpoint for creating an Order. Define CreateOrderRequest (CustomerId, list of items), OrderResponse (Id, Status, Total), an OrdersController, and an IOrderService that handles the logic.",
      expectedResult:
        "POST /api/orders with a valid request body returns 200 OK with an OrderResponse JSON containing the new order's Id, Status = \"Pending\", and the total.",
      hints: [
        "Validate the request DTO with attributes like [Required] and [Range].",
        "Inject IOrderService through the controller's constructor.",
        "Map the request to an Order entity inside the service, save it, and map back to OrderResponse.",
      ],
      solution:
        "Define CreateOrderRequest, OrderResponse, IOrderService with CreateAsync, an OrderService implementation that maps and saves, and an OrdersController with a [HttpPost] action that calls the service and returns the response DTO.",
    },
    quiz: [
      {
        kind: "concept",
        question: "What should a controller do in a clean .NET API?",
        options: [
          "Handle HTTP, run business logic, and call the database directly.",
          "Stay thin: handle HTTP, validate input, call a service, and return a response DTO.",
          "Replace the service.",
          "Map directly to the database.",
        ],
        correctAnswer:
          "Stay thin: handle HTTP, validate input, call a service, and return a response DTO.",
        explanation:
          "A thin controller is easier to read, test, and maintain.",
      },
      {
        kind: "code-reading",
        question:
          "In this controller, what is the role of CreateCustomerRequest?\n```csharp\npublic async Task<ActionResult<CustomerResponse>> Create(CreateCustomerRequest request)\n```",
        options: [
          "It is the database entity.",
          "It is the request DTO that defines the shape of the incoming data.",
          "It is the response DTO.",
          "It is a configuration class.",
        ],
        correctAnswer:
          "It is the request DTO that defines the shape of the incoming data.",
        explanation:
          "The controller receives a request DTO, which the framework deserializes from the JSON body.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is the problem here?\n```csharp\n[HttpPost]\npublic IActionResult Create(CreateOrderRequest request)\n{\n    var order = new Order { CustomerId = request.CustomerId };\n    _db.Orders.Add(order);\n    _db.SaveChanges();\n    return Ok(order);\n}\n```",
        options: [
          "Nothing.",
          "The controller talks to the database directly, contains business logic, and returns the entity. The work should be in a service, and the response should be a DTO.",
          "It needs to be async.",
          "It is missing a return type.",
        ],
        correctAnswer:
          "The controller talks to the database directly, contains business logic, and returns the entity. The work should be in a service, and the response should be a DTO.",
        explanation:
          "A clean .NET API delegates the work to a service and never returns entities directly.",
      },
      {
        kind: "interview",
        question:
          "Describe the flow of a simple API with DTOs.",
        options: [
          "Controller → database → response.",
          "Request DTO → controller → service → entity → repository → entity → service → response DTO.",
          "Controller does everything.",
          "DTOs handle the database.",
        ],
        correctAnswer:
          "Request DTO → controller → service → entity → repository → entity → service → response DTO.",
        explanation:
          "Each layer has a clear job. DTOs sit at the API edge; entities stay inside.",
      },
    ],
  },

  "validation-basics": {
    whyItMatters:
      "Validation is what keeps your API safe. Without it, bad data flows into your services and your database, and bugs become very hard to track down later. Good validation rejects invalid input at the edge, before it can cause problems.",
    simpleExplanation:
      "Validation means checking that incoming data is correct before the application uses it. In .NET, you can validate request DTOs with data annotations or with FluentValidation.",
    deepExplanation:
      "Validation happens at the API boundary. When the client sends a request, ASP.NET Core deserializes the body into the request DTO and checks the validation rules. If anything is invalid, the framework returns 400 Bad Request automatically with a list of errors. Data annotations like [Required], [Range], [MaxLength], and [EmailAddress] cover most simple rules. FluentValidation is better for complex rules or cross-field checks.",
    realWorldUsage:
      "A user registration endpoint validates Email format and Password length. A create-order endpoint validates that Quantity is positive and the item list is not empty. An update-profile endpoint validates that Name is between 1 and 100 characters. The framework returns 400 with clear error messages so the client can fix the input.",
    explainLikeBeginner:
      "Validation is like a security check at an airport. Bags are scanned before the flight, not after. If something is wrong, the bag is stopped at the entrance. Your API works the same way — invalid data is rejected before anything else runs.",
    interviewAnswer:
      "Validation checks that incoming data is correct before the business logic runs. In ASP.NET Core, we use data annotations like [Required] and [Range] or FluentValidation for more complex rules. The framework returns 400 Bad Request automatically when validation fails, so the rest of the code can trust the input.",
    commonMistakes: [
      "Skipping validation and trusting the client to send correct data.",
      "Putting validation logic inside the service or the controller instead of on the DTO.",
      "Mixing validation rules with business rules — they should stay separate.",
    ],
    bestPractices: [
      "Always validate request DTOs at the API boundary.",
      "Use data annotations for simple rules and FluentValidation for complex ones.",
      "Return clear error messages with field names and reasons.",
    ],
    summary: [
      "Validation rejects invalid input before processing.",
      "Use data annotations or FluentValidation.",
      "Validate at the API boundary, not deeper in the code.",
    ],
    codeExample: {
      title: "Validation on a request DTO with data annotations",
      code: `using System.ComponentModel.DataAnnotations;

public class CreateCustomerRequest
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Range(18, 120)]
    public int Age { get; set; }
}

[HttpPost]
public IActionResult Create(CreateCustomerRequest request)
{
    // ASP.NET Core has already validated the request.
    return Ok($"Customer {request.Name} created");
}`,
      output: "If the request is invalid: 400 Bad Request with field errors. If valid: 200 OK.",
      walkthrough: [
        "[Required] makes sure Name and Email are provided.",
        "[EmailAddress] checks the format of Email.",
        "[Range(18, 120)] keeps Age inside a valid range.",
      ],
    },
    practice: {
      prompt:
        "Add validation to a CreateProductRequest DTO with Name (required, max 200), Price (required, must be greater than 0), and Stock (must be 0 or more). Make sure the API returns 400 with clear errors when the rules fail.",
      expectedResult:
        "A request with empty Name returns 400 with a 'Name is required' error. A request with negative Price returns 400 with a range error. A valid request returns 200.",
      hints: [
        "Use [Required] and [MaxLength(200)] on Name.",
        "Use [Range(0.01, double.MaxValue)] on Price.",
        "Use [Range(0, int.MaxValue)] on Stock.",
      ],
      solution:
        "Add the attributes to each property. ASP.NET Core checks them automatically when the request arrives. The framework returns 400 with a list of validation errors when any rule fails.",
    },
    quiz: [
      {
        kind: "concept",
        question: "Where should validation happen?",
        options: [
          "Inside the database only.",
          "At the API boundary, on the request DTO, before the business logic runs.",
          "In the response DTO.",
          "Inside the entity class.",
        ],
        correctAnswer:
          "At the API boundary, on the request DTO, before the business logic runs.",
        explanation:
          "Catching invalid input early protects the rest of the application.",
      },
      {
        kind: "code-reading",
        question:
          "What happens when this request arrives with an empty Email?\n```csharp\npublic class RegisterRequest\n{\n    [Required, EmailAddress] public string Email { get; set; } = string.Empty;\n}\n```",
        options: [
          "The request is accepted.",
          "ASP.NET Core returns 400 Bad Request automatically with an Email validation error.",
          "It throws a 500 error.",
          "Email is set to a default value.",
        ],
        correctAnswer:
          "ASP.NET Core returns 400 Bad Request automatically with an Email validation error.",
        explanation:
          "The framework checks the validation attributes and returns a 400 response when they fail.",
      },
      {
        kind: "spot-the-bug",
        question:
          "Why is this design weak?\n```csharp\n[HttpPost]\npublic IActionResult Create(CreateUserRequest request)\n{\n    if (string.IsNullOrEmpty(request.Email)) return BadRequest();\n    if (!request.Email.Contains('@')) return BadRequest();\n}\n```",
        options: [
          "Nothing.",
          "The validation is hand-rolled inside the controller. It should be moved to the DTO using attributes like [Required] and [EmailAddress].",
          "It needs async.",
          "It returns wrong status codes.",
        ],
        correctAnswer:
          "The validation is hand-rolled inside the controller. It should be moved to the DTO using attributes like [Required] and [EmailAddress].",
        explanation:
          "Validation rules belong on the DTO, not scattered inside controllers.",
      },
      {
        kind: "interview",
        question:
          "How would you describe validation in a real .NET API?",
        options: [
          "Validation is only for security.",
          "It is the first line of defense at the API boundary. We use data annotations or FluentValidation to reject invalid input before the business logic runs, and the framework returns 400 with clear errors.",
          "Validation slows the API down.",
          "It is optional in production.",
        ],
        correctAnswer:
          "It is the first line of defense at the API boundary. We use data annotations or FluentValidation to reject invalid input before the business logic runs, and the framework returns 400 with clear errors.",
        explanation:
          "This is the standard approach in real .NET projects.",
      },
    ],
  },
};
