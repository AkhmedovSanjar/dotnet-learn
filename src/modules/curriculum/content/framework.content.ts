import type { ModuleContent } from "./types";

export const frameworkContent: ModuleContent = {
  "console-application-basics": {
    whyItMatters:
      "Console applications are the simplest way to learn .NET. They run in the terminal, have no UI, and let you focus on the language and the framework. Many real tools — data importers, schedulers, migration runners — are also console applications.",
    simpleExplanation:
      "A console application is a .NET program that runs in the terminal. It starts at the Main method (or a top-level Program.cs file) and runs from top to bottom.",
    deepExplanation:
      "When you run dotnet new console, .NET creates a small project with one file, Program.cs. With top-level statements you can start writing code right away — no class or Main method needed. The program reads from the console, writes to the console, and exits when the code finishes. You can add NuGet packages, classes, and services as the project grows.",
    realWorldUsage:
      "A console app can run a one-off data migration, import a CSV file into a database, send a batch of emails, or test a piece of business logic before moving it into a Web API. Many internal tools at real companies start as small console applications.",
    explainLikeBeginner:
      "A console application is like a small kitchen recipe. You open it, follow the steps in order, and when the steps are done, the recipe is finished. There is no website, no buttons — only the steps you wrote.",
    interviewAnswer:
      "A console application is a .NET program that runs in the terminal. It is the simplest way to learn the framework and to build small tools. It uses Program.cs as the entry point and can grow into a more complex application as needed.",
    commonMistakes: [
      "Mixing too much logic in Program.cs instead of using classes.",
      "Forgetting to handle null or invalid input from the console.",
      "Hard-coding configuration instead of using appsettings.json.",
    ],
    bestPractices: [
      "Use top-level statements for small programs.",
      "Move logic into classes once the program grows beyond a few lines.",
      "Use IHost and dependency injection when the program needs services and configuration.",
    ],
    summary: [
      "A console application runs in the terminal.",
      "Program.cs is the entry point.",
      "It is great for small tools, scripts, and learning .NET.",
    ],
    codeExample: {
      title: "A simple console application that greets a user",
      code: `// Program.cs
Console.Write("Enter your name: ");
var name = Console.ReadLine();

if (string.IsNullOrWhiteSpace(name))
{
    Console.WriteLine("No name provided");
    return;
}

Console.WriteLine($"Welcome, {name}!");`,
      output: "Enter your name: Ali\nWelcome, Ali!",
      walkthrough: [
        "Console.Write asks for input without a new line.",
        "Console.ReadLine reads what the user types.",
        "The program prints a friendly message and ends.",
      ],
    },
    practice: {
      prompt:
        "Build a console app that asks for two numbers and prints their sum. If the input is not a number, print 'Invalid input' and exit.",
      expectedResult:
        "Entering 3 and 4 prints 'Sum: 7'. Entering 'abc' prints 'Invalid input'.",
      hints: [
        "Use Console.ReadLine to read input.",
        "Use int.TryParse to safely convert the input.",
        "Print the sum only when both inputs are valid.",
      ],
      solution:
        "Read both inputs with Console.ReadLine. Use int.TryParse to convert each one. If either fails, print 'Invalid input' and return. Otherwise, print the sum.",
    },
    quiz: [
      {
        kind: "concept",
        question: "Where does a console application start?",
        options: [
          "In Startup.cs.",
          "In Program.cs, either at the Main method or with top-level statements.",
          "In appsettings.json.",
          "In a controller.",
        ],
        correctAnswer:
          "In Program.cs, either at the Main method or with top-level statements.",
        explanation:
          "Program.cs is the entry point for every .NET program.",
      },
      {
        kind: "code-reading",
        question:
          "What does this code do?\n```csharp\nvar name = Console.ReadLine();\nConsole.WriteLine($\"Hello, {name}!\");\n```",
        options: [
          "Reads a name from the console and prints a greeting.",
          "Writes to a file.",
          "Sends an email.",
          "Starts a web server.",
        ],
        correctAnswer:
          "Reads a name from the console and prints a greeting.",
        explanation:
          "ReadLine reads input, WriteLine prints output to the console.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is wrong here?\n```csharp\nvar name = Console.ReadLine();\nConsole.WriteLine($\"Hello, {name.ToUpper()}!\");\n```",
        options: [
          "Nothing.",
          "ReadLine can return null. Calling ToUpper on null will throw a NullReferenceException.",
          "WriteLine needs a return value.",
          "The string is too long.",
        ],
        correctAnswer:
          "ReadLine can return null. Calling ToUpper on null will throw a NullReferenceException.",
        explanation:
          "Always check the input before calling methods on it.",
      },
      {
        kind: "interview",
        question:
          "Why are console apps useful in real .NET work?",
        options: [
          "They are required for every project.",
          "They are great for small tools, migrations, schedulers, and as a quick way to test business logic before adding it to a larger application.",
          "They run faster than web apps.",
          "They do not need code.",
        ],
        correctAnswer:
          "They are great for small tools, migrations, schedulers, and as a quick way to test business logic before adding it to a larger application.",
        explanation:
          "Many production tools are console applications because they are simple and easy to schedule.",
      },
    ],
  },

  "web-api-basics": {
    whyItMatters:
      "A Web API is the main way .NET applications expose functionality to other systems. Mobile apps, frontends, partner services, and internal tools all talk to your application through Web APIs. Knowing how a Web API is built is one of the most useful skills in .NET.",
    simpleExplanation:
      "A Web API is a .NET application that listens for HTTP requests and returns responses. It usually returns JSON. Other applications call its endpoints to read or change data.",
    deepExplanation:
      "When a request arrives, ASP.NET Core routes it to a controller action. The action runs, returns a result, and the framework converts that result into an HTTP response. The Program.cs file configures services and the request pipeline. The controllers contain the endpoints. The services and repositories handle the business logic and data. This layered design is the foundation of every modern .NET Web API.",
    realWorldUsage:
      "An e-commerce backend exposes APIs for products, carts, orders, and payments. A banking application exposes APIs for accounts, transactions, and statements. A reporting service exposes APIs for downloading reports. In each case, the Web API is the contract between the system and its clients.",
    explainLikeBeginner:
      "A Web API is like a restaurant kitchen with a window. Customers (other applications) place orders through the window. The kitchen prepares the food and hands it back. The customers never see the inside of the kitchen.",
    interviewAnswer:
      "A Web API is a .NET application that exposes HTTP endpoints for other systems to use. It is built with ASP.NET Core, uses controllers or minimal APIs to define endpoints, and usually returns JSON. Web APIs are the standard way to expose business functionality in .NET.",
    commonMistakes: [
      "Putting business logic in controllers instead of services.",
      "Returning entities directly instead of DTOs.",
      "Skipping validation and error handling.",
    ],
    bestPractices: [
      "Keep controllers thin and move business logic into services.",
      "Use DTOs for request and response shapes.",
      "Add validation, error handling, and logging from the start.",
    ],
    summary: [
      "A Web API listens for HTTP requests and returns responses.",
      "ASP.NET Core is the framework used to build it.",
      "Controllers expose endpoints; services do the work.",
    ],
    codeExample: {
      title: "A minimal Web API that returns customer data",
      code: `var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();

var app = builder.Build();
app.MapControllers();
app.Run();

[ApiController]
[Route("api/customers")]
public class CustomersController : ControllerBase
{
    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        return Ok(new { Id = id, Name = "Ali" });
    }
}`,
      output: "GET /api/customers/1 returns { \"id\": 1, \"name\": \"Ali\" }",
      walkthrough: [
        "Program.cs builds the host and starts the application.",
        "CustomersController defines a GET endpoint.",
        "ASP.NET Core converts the returned object into JSON automatically.",
      ],
    },
    practice: {
      prompt:
        "Create a simple Web API with a ProductsController. Add a GET endpoint that returns a list of three hard-coded products (each with Id, Name, and Price) as JSON.",
      expectedResult:
        "Calling GET /api/products returns a JSON array with three products.",
      hints: [
        "Use [ApiController] and [Route(\"api/products\")] on the controller.",
        "Use [HttpGet] on the action.",
        "Return Ok(productsList).",
      ],
      solution:
        "Define a ProductsController with [ApiController] and [Route(\"api/products\")]. Add a [HttpGet] action that returns a list of three products via Ok(list). ASP.NET Core converts the list to JSON.",
    },
    quiz: [
      {
        kind: "concept",
        question: "What is a Web API in .NET?",
        options: [
          "A console program.",
          "A .NET application that exposes HTTP endpoints for other systems to call, usually returning JSON.",
          "A database.",
          "A UI framework.",
        ],
        correctAnswer:
          "A .NET application that exposes HTTP endpoints for other systems to call, usually returning JSON.",
        explanation:
          "Web APIs are the standard way to expose functionality over HTTP in .NET.",
      },
      {
        kind: "code-reading",
        question:
          "What does this controller do?\n```csharp\n[HttpGet(\"{id}\")]\npublic IActionResult GetById(int id) => Ok(new { Id = id });\n```",
        options: [
          "It deletes a record.",
          "It handles GET requests at /api/.../{id} and returns a JSON object with the Id.",
          "It runs once at startup.",
          "It returns HTML.",
        ],
        correctAnswer:
          "It handles GET requests at /api/.../{id} and returns a JSON object with the Id.",
        explanation:
          "The [HttpGet(\"{id}\")] attribute maps the URL to this action.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is the issue here?\n```csharp\n[HttpGet]\npublic User GetUser(int id) => _db.Users.Find(id);\n```",
        options: [
          "Nothing is wrong.",
          "It returns the User entity directly, which can leak sensitive fields. It should return a DTO.",
          "It is missing async.",
          "The method is too short.",
        ],
        correctAnswer:
          "It returns the User entity directly, which can leak sensitive fields. It should return a DTO.",
        explanation:
          "Web APIs should expose DTOs, not entities.",
      },
      {
        kind: "interview",
        question:
          "Describe the structure of a typical .NET Web API project.",
        options: [
          "Just one file with all the code.",
          "Program.cs sets up the host. Controllers expose HTTP endpoints. Services contain business logic. Repositories handle data access. DTOs define the shape of requests and responses.",
          "Only static methods.",
          "A single class with hundreds of methods.",
        ],
        correctAnswer:
          "Program.cs sets up the host. Controllers expose HTTP endpoints. Services contain business logic. Repositories handle data access. DTOs define the shape of requests and responses.",
        explanation:
          "This is the standard layered design in modern .NET Web APIs.",
      },
    ],
  },

  controllers: {
    whyItMatters:
      "Controllers are the front door of your Web API. They receive HTTP requests, validate input, call the right service, and return a response. Clean controllers make the rest of the application easier to build and maintain.",
    simpleExplanation:
      "A controller is a class that handles HTTP requests in ASP.NET Core. Each method (action) in the controller responds to a specific URL and HTTP method.",
    deepExplanation:
      "A controller class is decorated with [ApiController] and [Route]. Each action is decorated with an HTTP verb like [HttpGet], [HttpPost], [HttpPut], or [HttpDelete]. The framework reads the URL and HTTP method, matches them to an action, deserializes the request body into a DTO, and runs the action. The action returns an IActionResult (or ActionResult<T>), and ASP.NET Core converts it to an HTTP response.",
    realWorldUsage:
      "A CustomersController exposes CRUD endpoints for customers. An OrdersController handles creating and reading orders. An AuthController handles login and registration. Each controller is focused on one resource and uses services to do the actual work.",
    explainLikeBeginner:
      "A controller is like a receptionist in an office. The receptionist takes the call, checks who is calling and why, then connects you to the right person. The controller does the same — it takes the request and connects it to the right service.",
    interviewAnswer:
      "A controller in ASP.NET Core is a class that handles HTTP requests. Each action method responds to a specific URL and HTTP verb. The controller validates the request, calls a service, and returns a response. Controllers should stay thin and delegate the real work to services.",
    commonMistakes: [
      "Putting business logic inside the controller instead of a service.",
      "Returning entities directly instead of DTOs.",
      "Forgetting to inject dependencies through the constructor.",
    ],
    bestPractices: [
      "Keep controllers thin — receive, validate, delegate, respond.",
      "Inject services through the constructor.",
      "Return ActionResult<T> with the right status code.",
    ],
    summary: [
      "Controllers handle HTTP requests.",
      "Each action maps to a URL and an HTTP verb.",
      "Controllers should be thin and delegate to services.",
    ],
    codeExample: {
      title: "A CustomersController with two endpoints",
      code: `[ApiController]
[Route("api/customers")]
public class CustomersController : ControllerBase
{
    private readonly ICustomerService _service;

    public CustomersController(ICustomerService service)
    {
        _service = service;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CustomerResponse>> GetById(int id)
    {
        var customer = await _service.GetByIdAsync(id);
        if (customer == null) return NotFound();
        return Ok(customer);
    }

    [HttpPost]
    public async Task<ActionResult<CustomerResponse>> Create(CreateCustomerRequest request)
    {
        var created = await _service.CreateAsync(request);
        return Ok(created);
    }
}`,
      output: "GET /api/customers/1 returns 200 with the customer JSON or 404 if not found",
      walkthrough: [
        "The controller is registered at /api/customers via [Route].",
        "[HttpGet(\"{id}\")] maps GET /api/customers/{id} to GetById.",
        "The service is injected through the constructor.",
      ],
    },
    practice: {
      prompt:
        "Build an OrdersController with two endpoints: GET /api/orders/{id} that returns an order by id (or 404), and POST /api/orders that creates an order from a CreateOrderRequest.",
      expectedResult:
        "GET /api/orders/1 returns 200 with the order JSON. POST /api/orders with a valid body returns 200 with the new order.",
      hints: [
        "Use [ApiController] and [Route(\"api/orders\")] on the class.",
        "Inject IOrderService through the constructor.",
        "Return NotFound() if the order does not exist.",
      ],
      solution:
        "Create OrdersController with two actions. Inject IOrderService. The GET action calls GetByIdAsync; if null, return NotFound; else return Ok. The POST action calls CreateAsync and returns Ok with the result.",
    },
    quiz: [
      {
        kind: "concept",
        question: "What is the main job of a controller?",
        options: [
          "To run business logic.",
          "To handle HTTP requests, validate input, call a service, and return a response.",
          "To access the database directly.",
          "To configure dependency injection.",
        ],
        correctAnswer:
          "To handle HTTP requests, validate input, call a service, and return a response.",
        explanation:
          "Controllers are the front door of the API and should delegate the real work to services.",
      },
      {
        kind: "code-reading",
        question:
          "What URL does this action respond to?\n```csharp\n[Route(\"api/customers\")]\npublic class CustomersController : ControllerBase\n{\n    [HttpGet(\"{id}\")]\n    public IActionResult GetById(int id) { ... }\n}\n```",
        options: [
          "GET /customers",
          "GET /api/customers/{id}",
          "POST /api/customers/{id}",
          "PUT /customers/{id}",
        ],
        correctAnswer: "GET /api/customers/{id}",
        explanation:
          "The class route combines with the action route to form /api/customers/{id}, and [HttpGet] makes it a GET request.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is wrong here?\n```csharp\n[HttpPost]\npublic IActionResult Create(CreateOrderRequest request)\n{\n    var order = new Order { CustomerId = request.CustomerId };\n    _db.Orders.Add(order);\n    _db.SaveChanges();\n    return Ok(order);\n}\n```",
        options: [
          "Nothing.",
          "The controller is doing data access and returning the entity. It should call a service and return a DTO.",
          "The action needs to be async.",
          "Order should be sealed.",
        ],
        correctAnswer:
          "The controller is doing data access and returning the entity. It should call a service and return a DTO.",
        explanation:
          "Controllers should be thin. Put the data access in a repository and the logic in a service.",
      },
      {
        kind: "interview",
        question:
          "What does a clean controller look like in a .NET project?",
        options: [
          "It does everything — validation, logic, data access, and response.",
          "It receives the request, validates the DTO, calls a service, and returns a response DTO with the right status code.",
          "It uses static methods.",
          "It contains the database connection string.",
        ],
        correctAnswer:
          "It receives the request, validates the DTO, calls a service, and returns a response DTO with the right status code.",
        explanation:
          "Thin controllers are easier to read, test, and maintain.",
      },
    ],
  },

  services: {
    whyItMatters:
      "Services are where the real business logic lives. Without them, your controllers grow large and tangled, and the same logic ends up copied across endpoints. Services keep your code organized and reusable.",
    simpleExplanation:
      "A service is a class that contains business logic. It is used by controllers and other services to do real work, like creating an order, processing a payment, or sending an email.",
    deepExplanation:
      "A service is usually registered in dependency injection as an implementation of an interface. The controller receives the interface through its constructor, calls the service to handle the request, and returns the result. The service may use repositories for data access and other services for related work. This structure makes each part testable in isolation.",
    realWorldUsage:
      "OrderService creates and confirms orders. PaymentService talks to a payment gateway. EmailService sends notifications. InvoiceService generates and stores invoices. Each service has one job and depends only on what it needs through its constructor.",
    explainLikeBeginner:
      "A service is like a specialist worker in a company. The receptionist (controller) does not do the technical work — they pass the request to the right specialist. The specialist (service) handles the task and gives back the result.",
    interviewAnswer:
      "A service in .NET is a class that contains business logic. It is registered in dependency injection and used by controllers. Services keep the controller thin and the business logic reusable. We follow the pattern: thin controllers, fat services.",
    commonMistakes: [
      "Putting business logic in controllers instead of services.",
      "Making services depend on too many things at once.",
      "Skipping interfaces and tying services directly to specific implementations.",
    ],
    bestPractices: [
      "Define an interface for each service and inject it.",
      "Keep services focused on one area of the business.",
      "Inject everything the service needs through the constructor.",
    ],
    summary: [
      "Services hold the business logic.",
      "They are used by controllers and other services.",
      "They are usually registered in dependency injection through an interface.",
    ],
    codeExample: {
      title: "A simple OrderService that creates an order",
      code: `public interface IOrderService
{
    Task<OrderResponse> CreateAsync(CreateOrderRequest request);
}

public class OrderService : IOrderService
{
    private readonly IOrderRepository _repository;

    public OrderService(IOrderRepository repository)
    {
        _repository = repository;
    }

    public async Task<OrderResponse> CreateAsync(CreateOrderRequest request)
    {
        var order = new Order
        {
            CustomerId = request.CustomerId,
            Status = "Pending",
            CreatedAt = DateTime.UtcNow
        };

        await _repository.AddAsync(order);

        return new OrderResponse
        {
            Id = order.Id,
            Status = order.Status,
            Total = 0
        };
    }
}`,
      output: "Service creates a new order and returns a response DTO.",
      walkthrough: [
        "IOrderService defines the contract of the service.",
        "OrderService implements the contract and uses IOrderRepository to save the order.",
        "It maps the request DTO into an entity and the entity into a response DTO.",
      ],
    },
    practice: {
      prompt:
        "Define an IInvoiceService with a method GenerateAsync(int orderId). Implement InvoiceService that creates an Invoice based on the Order, stores it through an IInvoiceRepository, and returns an InvoiceResponse.",
      expectedResult:
        "Calling InvoiceService.GenerateAsync(1) creates and saves a new invoice based on order 1 and returns an InvoiceResponse with the generated invoice's Id and Total.",
      hints: [
        "Inject IInvoiceRepository and IOrderRepository through the constructor.",
        "Load the order, calculate the total, and create the invoice.",
        "Map the saved invoice into an InvoiceResponse before returning.",
      ],
      solution:
        "Define IInvoiceService. In InvoiceService, inject the two repositories. Inside GenerateAsync, load the order, sum the totals, create a new Invoice, save it, and return an InvoiceResponse with the Id and Total.",
    },
    quiz: [
      {
        kind: "concept",
        question: "What is the main job of a service in .NET?",
        options: [
          "To handle HTTP requests.",
          "To contain business logic and coordinate work between repositories and other services.",
          "To store database tables.",
          "To run unit tests.",
        ],
        correctAnswer:
          "To contain business logic and coordinate work between repositories and other services.",
        explanation:
          "Services hold the real work of the application.",
      },
      {
        kind: "code-reading",
        question:
          "In this constructor, what is happening?\n```csharp\npublic OrderService(IOrderRepository repository)\n{\n    _repository = repository;\n}\n```",
        options: [
          "Nothing.",
          "Constructor injection: the DI container provides the IOrderRepository when OrderService is created.",
          "It runs a database query.",
          "It opens an HTTP connection.",
        ],
        correctAnswer:
          "Constructor injection: the DI container provides the IOrderRepository when OrderService is created.",
        explanation:
          "Constructor injection is the standard way to receive dependencies in .NET.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is wrong with this service?\n```csharp\npublic class OrderService\n{\n    public Task CreateAsync()\n    {\n        using var db = new AppDbContext();\n        // ...\n    }\n}\n```",
        options: [
          "Nothing.",
          "It creates the DbContext directly instead of receiving it through DI. This makes the service hard to test and breaks the layered design.",
          "The method should be sync.",
          "It is missing await.",
        ],
        correctAnswer:
          "It creates the DbContext directly instead of receiving it through DI. This makes the service hard to test and breaks the layered design.",
        explanation:
          "Services should receive their dependencies through the constructor, not create them.",
      },
      {
        kind: "interview",
        question:
          "Why do we separate controllers and services?",
        options: [
          "Because the framework requires it.",
          "Because controllers handle HTTP concerns, and services handle business logic. Keeping them separate makes each part easier to test, reuse, and change.",
          "Because it is shorter to write.",
          "Because it makes the application faster.",
        ],
        correctAnswer:
          "Because controllers handle HTTP concerns, and services handle business logic. Keeping them separate makes each part easier to test, reuse, and change.",
        explanation:
          "Separation of concerns is one of the most valuable habits in .NET projects.",
      },
    ],
  },

  "dependency-injection": {
    whyItMatters:
      "Dependency injection is built into .NET. It is how services find their dependencies, how tests replace real services with fakes, and how the framework connects every part of the application. Knowing it well makes everything else easier.",
    simpleExplanation:
      "Dependency injection, or DI, is a way to give a class the things it needs from outside, instead of creating them inside. In .NET, the DI container creates the objects and passes the dependencies through the constructor.",
    deepExplanation:
      "You register services with the DI container in Program.cs using methods like AddSingleton, AddScoped, or AddTransient. When a controller or another service is created, the container looks at the constructor, finds the matching services, and passes them in. Singleton means one instance for the whole application. Scoped means one instance per HTTP request. Transient means a new instance every time.",
    realWorldUsage:
      "ICustomerService is registered as scoped because it uses the DbContext. IEmailSender is registered as singleton because it has no per-request state. ILogger<T> is provided by the framework automatically. Every service in a real .NET application receives its dependencies through DI.",
    explainLikeBeginner:
      "Dependency injection is like a kitchen where ingredients are delivered to the chef. The chef does not run out to buy them — the storage room (the DI container) sends what is needed. The chef just cooks. The kitchen stays clean and focused.",
    interviewAnswer:
      "Dependency injection is a way to provide a class with its dependencies from the outside, usually through the constructor. .NET has a built-in DI container, configured in Program.cs. The three main lifetimes are singleton, scoped, and transient. DI makes code easy to test, easy to change, and clearly organized.",
    commonMistakes: [
      "Injecting a scoped service into a singleton, which causes lifetime issues.",
      "Creating dependencies manually with new instead of receiving them through DI.",
      "Registering too many things as singletons, which can leak state across requests.",
    ],
    bestPractices: [
      "Default to scoped for services that touch the database.",
      "Use singleton only for stateless services or shared configuration.",
      "Always inject through the constructor, not through properties.",
    ],
    summary: [
      "DI gives a class its dependencies from outside.",
      ".NET has a built-in DI container configured in Program.cs.",
      "The three main lifetimes are singleton, scoped, and transient.",
    ],
    codeExample: {
      title: "Registering and injecting services in Program.cs",
      code: `var builder = WebApplication.CreateBuilder(args);

builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddSingleton<IEmailSender, SmtpEmailSender>();
builder.Services.AddControllers();

var app = builder.Build();
app.MapControllers();
app.Run();

public class OrderService : IOrderService
{
    private readonly IOrderRepository _repository;
    private readonly IEmailSender _email;

    public OrderService(IOrderRepository repository, IEmailSender email)
    {
        _repository = repository;
        _email = email;
    }
}`,
      output: "OrderService is created automatically with its dependencies",
      walkthrough: [
        "Each service is registered with a lifetime: Scoped or Singleton.",
        "OrderService declares its dependencies as constructor parameters.",
        "The DI container builds the object graph and passes the right instances.",
      ],
    },
    practice: {
      prompt:
        "Register an IInvoiceService and an ICustomerRepository in Program.cs. Build an InvoiceService that depends on the repository through constructor injection. Make sure the controller receives the service through DI as well.",
      expectedResult:
        "When the InvoicesController is created, ASP.NET Core automatically creates an InvoiceService with a CustomerRepository injected into it.",
      hints: [
        "Use builder.Services.AddScoped<IInvoiceService, InvoiceService>().",
        "Use builder.Services.AddScoped<ICustomerRepository, CustomerRepository>().",
        "Declare dependencies as constructor parameters.",
      ],
      solution:
        "Register both services as scoped. InvoiceService receives ICustomerRepository through its constructor. InvoicesController receives IInvoiceService through its constructor. The framework wires everything together.",
    },
    quiz: [
      {
        kind: "concept",
        question: "What is dependency injection?",
        options: [
          "A way to make code run faster.",
          "A way to give a class its dependencies from outside, usually through the constructor.",
          "A way to write SQL queries.",
          "A way to deploy applications.",
        ],
        correctAnswer:
          "A way to give a class its dependencies from outside, usually through the constructor.",
        explanation:
          "DI is the standard way to organize dependencies in modern .NET.",
      },
      {
        kind: "code-reading",
        question:
          "What does this do?\n```csharp\nbuilder.Services.AddScoped<IOrderService, OrderService>();\n```",
        options: [
          "Creates one OrderService for the whole application.",
          "Registers OrderService as the implementation of IOrderService, with one instance per HTTP request.",
          "Disables OrderService.",
          "Runs OrderService once at startup.",
        ],
        correctAnswer:
          "Registers OrderService as the implementation of IOrderService, with one instance per HTTP request.",
        explanation:
          "Scoped lifetime means one instance per request — perfect for services that use the DbContext.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is wrong here?\n```csharp\npublic class OrderService\n{\n    private readonly OrderRepository _repository = new();\n}\n```",
        options: [
          "Nothing.",
          "The service creates its own dependency instead of receiving it through DI. This makes it hard to test and breaks the layered design.",
          "It uses too many fields.",
          "It needs async.",
        ],
        correctAnswer:
          "The service creates its own dependency instead of receiving it through DI. This makes it hard to test and breaks the layered design.",
        explanation:
          "Always receive dependencies through the constructor so the DI container can manage them.",
      },
      {
        kind: "interview",
        question:
          "What are the three service lifetimes in .NET DI?",
        options: [
          "Static, dynamic, and async.",
          "Singleton (one for the whole app), Scoped (one per HTTP request), and Transient (a new one every time).",
          "Public, private, and internal.",
          "Read, write, and execute.",
        ],
        correctAnswer:
          "Singleton (one for the whole app), Scoped (one per HTTP request), and Transient (a new one every time).",
        explanation:
          "Picking the right lifetime is one of the most important DI decisions.",
      },
    ],
  },

  configuration: {
    whyItMatters:
      "Configuration controls how your application behaves: which database, which keys, which URLs, which features are enabled. Without good configuration, you cannot run the same code safely in development, staging, and production.",
    simpleExplanation:
      "Configuration is the set of values your application reads at startup, such as connection strings, API keys, and feature flags. In .NET, configuration usually comes from appsettings.json, environment variables, and user secrets.",
    deepExplanation:
      "ASP.NET Core builds a layered configuration system. It reads from appsettings.json first, then appsettings.{Environment}.json (like appsettings.Development.json), then environment variables, then user secrets, and finally command-line arguments. Each layer can override the previous one. The IConfiguration service exposes these values to the rest of the application. The IOptions<T> pattern lets you bind strongly typed classes to configuration sections.",
    realWorldUsage:
      "Connection strings live in appsettings.{Environment}.json or environment variables. API keys live in user secrets during development and in a secret manager like Azure Key Vault in production. Feature flags and URLs live in appsettings.json. Each environment has its own values without changing the code.",
    explainLikeBeginner:
      "Configuration is like the settings on a phone. The same phone behaves differently in different places — silent at the office, loud at home, airplane mode on a flight. The .NET application is the same — different settings change how it runs without changing the code.",
    interviewAnswer:
      "Configuration in .NET is a layered system that reads from appsettings.json, environment-specific files, environment variables, user secrets, and command-line arguments. We use IConfiguration or the IOptions pattern to access values. Sensitive values like API keys should never live in source control — they belong in user secrets or a key vault.",
    commonMistakes: [
      "Hardcoding values that should be configurable.",
      "Committing secrets to source control.",
      "Mixing development and production values in the same file.",
    ],
    bestPractices: [
      "Use appsettings.json for safe, environment-neutral defaults.",
      "Use appsettings.{Environment}.json or environment variables for environment-specific values.",
      "Use user secrets for development secrets and a secret manager for production.",
    ],
    summary: [
      "Configuration controls how the application behaves.",
      ".NET reads from appsettings.json, environment variables, and user secrets.",
      "Never commit secrets to source control.",
    ],
    codeExample: {
      title: "Reading configuration with IOptions<T>",
      code: `// appsettings.json
// {
//   "EmailSettings": {
//     "FromAddress": "no-reply@example.com",
//     "ApiKey": "<API_KEY>"
//   }
// }

public class EmailSettings
{
    public string FromAddress { get; set; } = string.Empty;
    public string ApiKey { get; set; } = string.Empty;
}

// Program.cs
builder.Services.Configure<EmailSettings>(
    builder.Configuration.GetSection("EmailSettings"));

public class EmailService
{
    private readonly EmailSettings _settings;

    public EmailService(IOptions<EmailSettings> options)
    {
        _settings = options.Value;
    }
}`,
      output: "EmailService reads its settings from configuration through IOptions.",
      walkthrough: [
        "EmailSettings is a class that mirrors the configuration section.",
        "Configure<EmailSettings> binds the section to the class.",
        "The service receives IOptions<EmailSettings> and accesses _settings.Value.",
      ],
    },
    practice: {
      prompt:
        "Create a class JwtSettings with Issuer, Audience, and SecretKey. Read the values from an 'Jwt' section in appsettings.json and inject the settings into a TokenService.",
      expectedResult:
        "TokenService receives an IOptions<JwtSettings> and can read Issuer, Audience, and SecretKey from configuration.",
      hints: [
        "Add a Jwt section to appsettings.json.",
        "Use builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection(\"Jwt\")).",
        "Inject IOptions<JwtSettings> into TokenService.",
      ],
      solution:
        "Define JwtSettings as a simple class. Register it with Configure in Program.cs. Inject IOptions<JwtSettings> into TokenService and access options.Value.Issuer, options.Value.Audience, and options.Value.SecretKey.",
    },
    quiz: [
      {
        kind: "concept",
        question: "Where should sensitive configuration values like API keys live?",
        options: [
          "In appsettings.json committed to source control.",
          "In environment variables, user secrets during development, or a secret manager in production. Never in source control.",
          "In the code as constants.",
          "In the database.",
        ],
        correctAnswer:
          "In environment variables, user secrets during development, or a secret manager in production. Never in source control.",
        explanation:
          "Secrets must stay out of the repository to prevent accidental exposure.",
      },
      {
        kind: "code-reading",
        question:
          "What does this line do?\n```csharp\nbuilder.Services.Configure<EmailSettings>(builder.Configuration.GetSection(\"EmailSettings\"));\n```",
        options: [
          "Sends an email.",
          "Binds the EmailSettings section of configuration to the EmailSettings class so it can be injected with IOptions.",
          "Reads a database.",
          "Sets a default password.",
        ],
        correctAnswer:
          "Binds the EmailSettings section of configuration to the EmailSettings class so it can be injected with IOptions.",
        explanation:
          "The IOptions pattern makes configuration strongly typed and easy to inject.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is wrong here?\n```csharp\nbuilder.Services.AddSingleton(new EmailService(\"<API_KEY>\"));\n```",
        options: [
          "Nothing.",
          "The API key is hardcoded in the source. It should come from configuration, not be passed as a string in code.",
          "EmailService should be sealed.",
          "It needs await.",
        ],
        correctAnswer:
          "The API key is hardcoded in the source. It should come from configuration, not be passed as a string in code.",
        explanation:
          "Secrets and environment-specific values belong in configuration, not in source code.",
      },
      {
        kind: "interview",
        question:
          "How does configuration layering work in .NET?",
        options: [
          "Only one file is read.",
          "Configuration is read from multiple sources in order — appsettings.json, environment-specific files, user secrets, environment variables, command-line arguments — and each layer overrides the previous one.",
          "The compiler picks one source.",
          "Configuration is hardcoded.",
        ],
        correctAnswer:
          "Configuration is read from multiple sources in order — appsettings.json, environment-specific files, user secrets, environment variables, command-line arguments — and each layer overrides the previous one.",
        explanation:
          "Layering lets you keep defaults in source and override them per environment.",
      },
    ],
  },

  "middleware-basics": {
    whyItMatters:
      "Middleware is the pipeline through which every HTTP request flows. It handles authentication, logging, exception handling, CORS, and more. Knowing how middleware works lets you control what happens before and after every action.",
    simpleExplanation:
      "Middleware is a piece of code that runs for every HTTP request. Each middleware can read the request, do something, and pass it to the next one in the pipeline.",
    deepExplanation:
      "In ASP.NET Core, middleware is configured in Program.cs after the app is built. The order matters. Each middleware decides whether to call the next one. Common built-in middleware includes UseAuthentication, UseAuthorization, UseRouting, UseExceptionHandler, and UseStaticFiles. You can also write custom middleware to log every request or to handle a specific concern.",
    realWorldUsage:
      "Authentication middleware checks the JWT token on every request. Logging middleware records the URL and time. Exception handling middleware catches unhandled errors and returns a clean 500 response. CORS middleware lets the frontend call the API from a different domain.",
    explainLikeBeginner:
      "Middleware is like a row of checkpoints at a stadium. Each checkpoint does one job — bag check, ticket scan, security pat-down — and passes you to the next one. The .NET pipeline works the same way for every HTTP request.",
    interviewAnswer:
      "Middleware is code that handles HTTP requests in a pipeline. Each middleware can run logic before and after calling the next one. ASP.NET Core includes built-in middleware for authentication, routing, static files, exception handling, and more. The order in Program.cs matters because each middleware affects the next.",
    commonMistakes: [
      "Putting middleware in the wrong order, especially authentication before routing.",
      "Forgetting to call next() so the pipeline stops unexpectedly.",
      "Adding heavy work to middleware that runs on every request.",
    ],
    bestPractices: [
      "Put exception handling middleware first so it can catch errors from later middleware.",
      "Put authentication before authorization.",
      "Keep custom middleware focused on one concern.",
    ],
    summary: [
      "Middleware runs for every HTTP request.",
      "The order in Program.cs matters.",
      "Common middleware handles authentication, logging, errors, and CORS.",
    ],
    codeExample: {
      title: "A simple logging middleware",
      code: `var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.Use(async (context, next) =>
{
    Console.WriteLine($"--> {context.Request.Method} {context.Request.Path}");
    await next();
    Console.WriteLine($"<-- {context.Response.StatusCode}");
});

app.UseAuthorization();
app.MapControllers();

app.Run();`,
      output: "--> GET /api/customers/1\n<-- 200",
      walkthrough: [
        "app.Use registers a custom middleware that runs for every request.",
        "It logs the request method and path before calling next().",
        "After next() returns, it logs the response status code.",
      ],
    },
    practice: {
      prompt:
        "Write a custom middleware that measures how long each request takes. Log the time in milliseconds after the response is sent.",
      expectedResult:
        "For every request, the middleware logs a line like 'GET /api/customers/1 took 42ms'.",
      hints: [
        "Use a System.Diagnostics.Stopwatch.",
        "Start the stopwatch before calling next().",
        "Stop the stopwatch and log the elapsed milliseconds after next() returns.",
      ],
      solution:
        "Inside app.Use, create a Stopwatch, call Start(), then await next(), then Stop() and log the elapsed milliseconds with Console.WriteLine.",
    },
    quiz: [
      {
        kind: "concept",
        question: "What is middleware in ASP.NET Core?",
        options: [
          "A type of controller.",
          "Code that runs for every HTTP request, in a pipeline configured in Program.cs.",
          "A database driver.",
          "A test framework.",
        ],
        correctAnswer:
          "Code that runs for every HTTP request, in a pipeline configured in Program.cs.",
        explanation:
          "Middleware sits in the request pipeline and handles cross-cutting concerns.",
      },
      {
        kind: "code-reading",
        question:
          "What does this code do?\n```csharp\napp.Use(async (context, next) =>\n{\n    Console.WriteLine(context.Request.Path);\n    await next();\n});\n```",
        options: [
          "Stops every request.",
          "Logs the path of every request and then passes the request to the next middleware.",
          "Sends an email.",
          "Creates a database row.",
        ],
        correctAnswer:
          "Logs the path of every request and then passes the request to the next middleware.",
        explanation:
          "Custom middleware uses app.Use with a delegate and calls next() to continue the pipeline.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is wrong here?\n```csharp\napp.UseAuthorization();\napp.UseAuthentication();\napp.MapControllers();\n```",
        options: [
          "Nothing.",
          "UseAuthentication must come before UseAuthorization. Otherwise the request is authorized before the user is even identified.",
          "MapControllers is missing.",
          "It is missing logging.",
        ],
        correctAnswer:
          "UseAuthentication must come before UseAuthorization. Otherwise the request is authorized before the user is even identified.",
        explanation:
          "Middleware order matters. Authentication identifies the user; authorization decides if they have access.",
      },
      {
        kind: "interview",
        question:
          "How would you describe the middleware pipeline?",
        options: [
          "It runs once at startup.",
          "It is the chain of middleware components that every HTTP request passes through. Each component can read the request, run logic, call the next component, and run more logic on the way back.",
          "It only runs for errors.",
          "It is part of the database.",
        ],
        correctAnswer:
          "It is the chain of middleware components that every HTTP request passes through. Each component can read the request, run logic, call the next component, and run more logic on the way back.",
        explanation:
          "This is the standard way HTTP requests are processed in ASP.NET Core.",
      },
    ],
  },

  "simple-dotnet-web-api-example": {
    whyItMatters:
      "Putting everything together — controllers, services, DI, configuration, and middleware — is the real test of understanding the framework. A small working example shows you how all the parts fit and gives you a template you can reuse in any project.",
    simpleExplanation:
      "A simple .NET Web API combines a controller, a service, a request DTO, a response DTO, and dependency injection in Program.cs. Together, they handle one feature from start to finish.",
    deepExplanation:
      "Program.cs builds the host, registers services, configures middleware, and starts the application. The controller receives the HTTP request, deserializes it into a request DTO, validates it, and calls a service. The service does the business logic and returns a response DTO. ASP.NET Core converts the DTO to JSON and sends it back to the client. This is the standard pattern used by almost every .NET Web API.",
    realWorldUsage:
      "A small bookkeeping API has a TransactionsController with GET and POST endpoints, a TransactionService for the logic, and DTOs for the API contract. A small employee API has an EmployeesController, an EmployeeService, an IEmployeeRepository, and DTOs. The structure is the same in every project.",
    explainLikeBeginner:
      "A simple Web API is like a small bakery. The counter (controller) takes orders. The kitchen (service) bakes the goods. The recipe book (configuration) lists the ingredients. The bag (response DTO) carries the items to the customer.",
    interviewAnswer:
      "A simple .NET Web API has a controller, a service, DTOs, and registered services in DI. Program.cs builds the host, the controller handles HTTP, the service handles logic, and DTOs shape the data. This layered design is the standard structure used in real .NET projects.",
    commonMistakes: [
      "Skipping the service layer and writing everything in the controller.",
      "Returning entities directly.",
      "Forgetting to register services in Program.cs.",
    ],
    bestPractices: [
      "Start with a single feature end to end before scaling up.",
      "Keep each file focused on one job.",
      "Use DTOs at the edges and entities only inside the application.",
    ],
    summary: [
      "A small example shows how every part of the framework fits together.",
      "Program.cs, controller, service, repository, and DTOs each play a role.",
      "This is the foundation of every .NET Web API.",
    ],
    codeExample: {
      title: "A small Web API with one feature end to end",
      code: `// Program.cs
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddScoped<ICustomerService, CustomerService>();

var app = builder.Build();
app.UseAuthorization();
app.MapControllers();
app.Run();

// CreateCustomerRequest.cs
public class CreateCustomerRequest
{
    [Required] public string Name { get; set; } = string.Empty;
    [Required, EmailAddress] public string Email { get; set; } = string.Empty;
}

// CustomerResponse.cs
public class CustomerResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}

// CustomerService.cs
public interface ICustomerService
{
    Task<CustomerResponse> CreateAsync(CreateCustomerRequest request);
}

public class CustomerService : ICustomerService
{
    public Task<CustomerResponse> CreateAsync(CreateCustomerRequest request)
    {
        var response = new CustomerResponse { Id = 1, Name = request.Name };
        return Task.FromResult(response);
    }
}

// CustomersController.cs
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
      output: "POST /api/customers returns 200 with the created customer",
      walkthrough: [
        "Program.cs registers controllers and the service.",
        "The controller receives the request DTO and calls the service.",
        "The service returns a response DTO, and the framework serializes it as JSON.",
      ],
    },
    practice: {
      prompt:
        "Build a small Products feature end to end: a CreateProductRequest, a ProductResponse, an IProductService and ProductService implementation, and a ProductsController with one POST and one GET action. Register everything in Program.cs.",
      expectedResult:
        "POST /api/products creates a product and returns it. GET /api/products/{id} returns the product with the matching id or 404.",
      hints: [
        "Use [ApiController] and [Route(\"api/products\")] on the controller.",
        "Register IProductService with AddScoped in Program.cs.",
        "Return NotFound() when the product is not found.",
      ],
      solution:
        "Create the four files, register the service, and wire the controller. The POST action calls CreateAsync and returns Ok with the response. The GET action calls GetByIdAsync and returns NotFound or Ok.",
    },
    quiz: [
      {
        kind: "concept",
        question: "Which files are usually involved in a simple feature end to end?",
        options: [
          "Just Program.cs.",
          "Program.cs, a controller, a service, and request and response DTOs.",
          "Only the database.",
          "Only the README.",
        ],
        correctAnswer:
          "Program.cs, a controller, a service, and request and response DTOs.",
        explanation:
          "This is the standard structure of a single feature in a .NET Web API.",
      },
      {
        kind: "code-reading",
        question:
          "What does this Program.cs line do?\n```csharp\nbuilder.Services.AddScoped<ICustomerService, CustomerService>();\n```",
        options: [
          "Registers CustomerService as the implementation of ICustomerService, with a new instance per HTTP request.",
          "Runs CustomerService once.",
          "Sends a customer to the database.",
          "Configures middleware.",
        ],
        correctAnswer:
          "Registers CustomerService as the implementation of ICustomerService, with a new instance per HTTP request.",
        explanation:
          "AddScoped is the most common lifetime for services that do per-request work.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What would be wrong if the controller did this?\n```csharp\n[HttpPost]\npublic IActionResult Create(CreateCustomerRequest request)\n{\n    var service = new CustomerService();\n    return Ok(service.Create(request));\n}\n```",
        options: [
          "Nothing.",
          "The controller creates the service manually instead of using dependency injection. This breaks DI and makes the controller hard to test.",
          "It is missing await.",
          "It returns the wrong status code.",
        ],
        correctAnswer:
          "The controller creates the service manually instead of using dependency injection. This breaks DI and makes the controller hard to test.",
        explanation:
          "Always receive services through constructor injection.",
      },
      {
        kind: "interview",
        question:
          "Describe the flow of one request in a small .NET Web API.",
        options: [
          "The request goes straight to the database.",
          "Program.cs sets up everything. The request hits the controller, which validates the request DTO and calls the service. The service does the work and returns a response DTO, which is serialized to JSON and sent back.",
          "Everything happens in the controller.",
          "The service handles HTTP directly.",
        ],
        correctAnswer:
          "Program.cs sets up everything. The request hits the controller, which validates the request DTO and calls the service. The service does the work and returns a response DTO, which is serialized to JSON and sent back.",
        explanation:
          "This layered flow is the foundation of every modern .NET Web API.",
      },
    ],
  },
};
