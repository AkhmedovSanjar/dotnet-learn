import type { ModuleContent } from "./types";

export const oopContent = {
  "what-is-oop": {
    whyItMatters:
      "Most backend codebases you will join are built around classes and interfaces. If you cannot read them, you cannot navigate the project — let alone change it safely.",
    simpleExplanation:
      "OOP is a way of organising code around things (objects) instead of long lists of steps. Each object holds its own data and exposes the actions you can perform on it.",
    deepExplanation:
      "Procedural code answers 'what steps run, in what order'. OOP answers 'who owns this state, who is allowed to change it'. In a .NET service this shows up as: an `Order` class owns its line items, a `PaymentService` owns the rule for charging, an `IEmailSender` is a contract that anyone can implement. The four pillars — encapsulation, inheritance, polymorphism, abstraction — are tools for keeping that ownership clean. Once you internalise that lens, opening a new repo stops feeling random.",
    realWorldUsage:
      "In a checkout API, the controller receives a request, hands it to an `OrderService`, which mutates `Order` objects and persists them via an `IOrderRepository`. Each class has one job, and you can swap the repository for an in-memory fake in a test without touching the service.",
    explainLikeBeginner:
      "Think of OOP as boxes with labels. Each box (object) carries its own things and knows how to use them. You ask the box to do something instead of reaching inside and rearranging it yourself.",
    interviewAnswer:
      "OOP is a paradigm where state and the operations on that state live together in objects. In .NET we use it to model domain concepts — orders, customers, payments — as classes with clear contracts so that business rules and persistence concerns stay separate.",
    commonMistakes: [
      "Treating classes as buckets of static helpers — losing the whole point of state ownership.",
      "Putting every piece of logic in the controller and leaving 'model' classes that hold only public fields.",
      "Adding inheritance for code reuse when a small interface or composition would have been clearer.",
    ],
    bestPractices: [
      "Name classes after the noun in the domain, not after the technical layer (`Order`, not `OrderHandlerHelperUtil`).",
      "Keep public surface small: prefer methods that describe intent (`order.Cancel()`) over setters (`order.Status = ...`).",
      "Pass dependencies in through the constructor so each class is testable in isolation.",
    ],
    summary: [
      "OOP groups data and behaviour into objects with clear contracts.",
      "The four pillars are encapsulation, inheritance, polymorphism, abstraction.",
      "Good .NET backends use OOP to separate domain rules from infrastructure.",
    ],
    codeExample: {
      title: "Tiny Order class owning its own state",
      code: `public sealed class Order
{
    public Guid Id { get; }
    public string Status { get; private set; } = "Pending";
    private readonly List<OrderLine> _lines = new();

    public Order(Guid id) => Id = id;

    public void AddLine(string sku, int quantity)
    {
        if (quantity <= 0) throw new ArgumentException("Quantity must be positive.");
        _lines.Add(new OrderLine(sku, quantity));
    }

    public void Confirm()
    {
        if (_lines.Count == 0) throw new InvalidOperationException("Empty order.");
        Status = "Confirmed";
    }
}

public record OrderLine(string Sku, int Quantity);`,
      output: "Order id 8f3...   Status: Confirmed   Lines: 2",
      walkthrough: [
        "`Order` owns its lines via a private list — outside code cannot mutate them directly.",
        "Public methods (`AddLine`, `Confirm`) encode the rules: positive quantity, non-empty order.",
        "Status changes are visible from outside but only writable from inside the class.",
      ],
    },
    practice: {
      prompt:
        "Create a `Customer` class with `Name` and `Email`. Expose a method `ChangeEmail(string newEmail)` that validates the value contains '@' before assigning. Outside code should not be able to set the email directly.",
      expectedResult:
        "Calling `customer.ChangeEmail(\"a@b.com\")` updates the value; calling it with `\"bad\"` throws.",
      hints: [
        "Make the `Email` setter `private`.",
        "Throw `ArgumentException` on invalid input — let the caller decide how to respond.",
        "Cover the happy path and the invalid path in a small test.",
      ],
      solution:
        "Declare `public string Email { get; private set; }`. In `ChangeEmail` guard with `if (!newEmail.Contains('@')) throw new ArgumentException(...);` then assign. Tests: `ChangeEmail_With_Valid_Updates` and `ChangeEmail_With_Invalid_Throws`.",
    },
    quiz: [
      {
        kind: "concept",
        question: "Which sentence best captures what OOP gives you in a .NET backend?",
        options: [
          "A faster way to write SQL queries.",
          "A way to keep state and the rules that change it together in one place.",
          "A guarantee that your code will be free of bugs.",
          "A replacement for unit testing.",
        ],
        correctAnswer: "A way to keep state and the rules that change it together in one place.",
        explanation:
          "OOP is about co-locating data with the behaviour that owns it. It does not replace tests, and it has nothing directly to do with SQL.",
      },
      {
        kind: "code-reading",
        question:
          "Given the snippet:\n```csharp\nvar order = new Order(Guid.NewGuid());\norder.AddLine(\"SKU-1\", 2);\norder.Confirm();\n```\nWhat is the state of `order.Status` after the third line?",
        options: ["\"Pending\"", "\"Cancelled\"", "\"Confirmed\"", "null"],
        correctAnswer: "\"Confirmed\"",
        explanation:
          "`Confirm()` flips the status from its initial value `\"Pending\"` to `\"Confirmed\"` once the order has at least one line.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is wrong with this design?\n```csharp\npublic class Order\n{\n    public string Status;\n    public List<OrderLine> Lines = new();\n}\n```",
        options: [
          "Nothing — it is fine for a domain object.",
          "It exposes mutable fields with no validation, so any caller can put the order in an invalid state.",
          "It should inherit from `object` explicitly.",
          "The list needs to be `IEnumerable` to compile.",
        ],
        correctAnswer:
          "It exposes mutable fields with no validation, so any caller can put the order in an invalid state.",
        explanation:
          "Public mutable fields defeat encapsulation: a caller could set `Status = \"Confirmed\"` on an empty order. Hide the fields and expose intent-bearing methods.",
      },
      {
        kind: "interview",
        question:
          "An interviewer asks: 'Why use OOP for a small CRUD API at all?' What is the strongest junior-level answer?",
        options: [
          "Because the framework will not compile otherwise.",
          "Because it makes the executable smaller.",
          "Because separating domain classes from infrastructure keeps validation, persistence, and HTTP concerns testable in isolation as the service grows.",
          "Because OOP is required by REST.",
        ],
        correctAnswer:
          "Because separating domain classes from infrastructure keeps validation, persistence, and HTTP concerns testable in isolation as the service grows.",
        explanation:
          "The interviewer is checking whether you can articulate the maintainability benefit. The compiler, executable size, and REST have no inherent OOP requirement.",
      },
    ],
  },

  "class-vs-object": {
    whyItMatters:
      "Confusing the two is the number-one reason juniors write code that compiles but does the wrong thing — usually by accidentally sharing state across requests.",
    simpleExplanation:
      "A class is the blueprint. An object is one specific thing built from that blueprint. The class `Order` is the recipe; `new Order(...)` is one actual cake.",
    deepExplanation:
      "Every `new` allocates a fresh object with its own copy of instance fields. Two `Order` instances do not share their `_lines` lists — that is exactly what makes them safe to use concurrently across requests in an ASP.NET Core service. Static members, on the other hand, belong to the class itself and are shared by everyone. Understanding which is which is what stops you from putting `static List<Order> _orders` in a service and wondering why one user's data is leaking into another's.",
    realWorldUsage:
      "ASP.NET Core resolves a new `OrderService` per HTTP request (scoped lifetime). Each request gets its own `Order` instances; the class definition is shared by the whole process.",
    explainLikeBeginner:
      "A cookie cutter is the class. Every cookie you press is an object. You can have many cookies, but they all came from the same shape.",
    interviewAnswer:
      "A class defines the shape and behaviour of a type. An object is a runtime instance with its own state. Two instances of the same class share the same methods but have independent field values.",
    commonMistakes: [
      "Using `static` fields to 'cache' per-request data — the value persists across all callers.",
      "Comparing reference types with `==` and being surprised that two distinct objects are not equal even if their fields match.",
      "Forgetting that a class with no `new` is just a definition; nothing runs until you instantiate it.",
    ],
    bestPractices: [
      "Default to instance state. Only reach for `static` when the data is genuinely shared and immutable.",
      "Use records or override `Equals`/`GetHashCode` when you want value-based comparison.",
      "Pass objects, not classes, into methods that need real data.",
    ],
    summary: [
      "Class = blueprint, object = instance.",
      "Each `new` produces independent state.",
      "Static members belong to the class, not to instances.",
    ],
    codeExample: {
      title: "Two objects from one class",
      code: `var a = new Counter();
var b = new Counter();
a.Increment();
a.Increment();
b.Increment();
Console.WriteLine($"a={a.Value} b={b.Value}");

public sealed class Counter
{
    public int Value { get; private set; }
    public void Increment() => Value++;
}`,
      output: "a=2 b=1",
      walkthrough: [
        "`a` and `b` are two separate objects produced by the same `Counter` class.",
        "Each holds its own `Value` field, so incrementing `a` does not affect `b`.",
        "Methods like `Increment` are defined once on the class but operate on the calling instance.",
      ],
    },
    practice: {
      prompt:
        "Write a `Wallet` class with a `decimal Balance` (read-only from outside) and a `Deposit(decimal amount)` method. Create two `Wallet` instances and prove their balances are independent.",
      expectedResult:
        "After `walletA.Deposit(10)` and `walletB.Deposit(5)`, `walletA.Balance` is 10 and `walletB.Balance` is 5.",
      hints: [
        "Declare `Balance` with a private setter.",
        "Guard against negative deposits.",
        "Write a quick `Console.WriteLine` to print both balances.",
      ],
      solution:
        "`public decimal Balance { get; private set; }` plus `public void Deposit(decimal amount) { if (amount < 0) throw ...; Balance += amount; }`. Two `new Wallet()` instances have independent backing fields, so deposits do not bleed across.",
    },
    quiz: [
      {
        kind: "concept",
        question: "Which statement is true about classes and objects?",
        options: [
          "A class is created at runtime; an object is the source code.",
          "Every object of a class shares the same instance fields.",
          "A class describes a type; an object is one instance of that type with its own state.",
          "You can use a class without ever instantiating it for anything except static methods.",
        ],
        correctAnswer:
          "A class describes a type; an object is one instance of that type with its own state.",
        explanation:
          "The last option about static-only usage is a special case, not the general truth; instance fields are per-object, not shared.",
      },
      {
        kind: "code-reading",
        question:
          "What does this print?\n```csharp\nvar x = new Counter();\nvar y = x;\ny.Increment();\nConsole.WriteLine(x.Value);\n```\n(`Counter` increments `Value` by 1.)",
        options: ["0", "1", "Compilation error", "null"],
        correctAnswer: "1",
        explanation:
          "`y = x` copies the reference, not the object. Both names point at the same instance, so `y.Increment()` is visible through `x`.",
      },
      {
        kind: "spot-the-bug",
        question:
          "Why is this dangerous in an ASP.NET Core service?\n```csharp\npublic class CartService\n{\n    private static List<string> _items = new();\n    public void Add(string item) => _items.Add(item);\n}\n```",
        options: [
          "It will not compile.",
          "`static` makes `_items` shared by every request — one user can see another user's items.",
          "`List<string>` is too slow for production.",
          "`Add` should be `async`.",
        ],
        correctAnswer:
          "`static` makes `_items` shared by every request — one user can see another user's items.",
        explanation:
          "Per-request state must live on an instance whose lifetime is scoped to the request. `static` fields persist for the whole process.",
      },
      {
        kind: "interview",
        question:
          "How would you explain 'class vs object' to a non-technical product manager?",
        options: [
          "A class is a server; an object is the database.",
          "A class is the form definition; each filled-in form is an object.",
          "A class is faster than an object.",
          "They are the same thing.",
        ],
        correctAnswer:
          "A class is the form definition; each filled-in form is an object.",
        explanation:
          "Analogies to forms, blueprints, or cookie cutters all communicate the template-vs-instance idea without jargon.",
      },
    ],
  },

  encapsulation: {
    whyItMatters:
      "Encapsulation is what stops business objects from drifting into invalid states. Without it, every caller in the codebase becomes responsible for keeping your invariants, and they will not.",
    simpleExplanation:
      "Encapsulation means an object protects its own data. Callers ask the object to do something instead of poking at its internals.",
    deepExplanation:
      "In .NET this usually looks like private fields, private setters, and methods that encode the rules. A `BankAccount` exposes `Deposit` and `Withdraw`; it never lets you do `account.Balance = -100`. The pay-off is local reasoning: when you see `balance` go negative in a log, you only need to look at the methods on that class to find the bug, not every place in the codebase that touches the value.",
    realWorldUsage:
      "A payment service receives a `ChargeRequest`, calls `account.Withdraw(amount)`, and trusts the account to refuse if the funds are insufficient. The service does not re-implement the rule because the rule lives on the entity.",
    explainLikeBeginner:
      "An ATM does not let you reach into its cash drawer. You press buttons, and the ATM decides whether to hand out money. That is encapsulation.",
    interviewAnswer:
      "Encapsulation is the OOP principle of hiding internal state and exposing controlled operations. It protects invariants and makes business rules explicit on the type that owns them.",
    commonMistakes: [
      "Making every property a public auto-property and then writing the validation in the controller.",
      "Adding a `Validate()` method that callers must remember to invoke — if they forget, the rule is lost.",
      "Exposing collections directly (`public List<T> Items`) so callers can `Add`/`Remove` without going through the owning class.",
    ],
    bestPractices: [
      "Return `IReadOnlyList<T>` for collections; provide `AddItem` / `RemoveItem` methods that enforce rules.",
      "Use `private set` (or init-only) for properties whose value should change only via a domain method.",
      "Throw early — invalid input is rejected in the constructor or the method, never silently stored.",
    ],
    summary: [
      "Encapsulation hides state behind methods that enforce rules.",
      "Public read, controlled write: properties get publicly, are written privately.",
      "It keeps business invariants on the object, not scattered across callers.",
    ],
    codeExample: {
      title: "BankAccount with enforced invariants",
      code: `public sealed class BankAccount
{
    public decimal Balance { get; private set; }

    public BankAccount(decimal opening)
    {
        if (opening < 0) throw new ArgumentException("Opening balance must be non-negative.");
        Balance = opening;
    }

    public void Deposit(decimal amount)
    {
        if (amount <= 0) throw new ArgumentException("Deposit must be positive.");
        Balance += amount;
    }

    public void Withdraw(decimal amount)
    {
        if (amount <= 0) throw new ArgumentException("Withdrawal must be positive.");
        if (amount > Balance) throw new InvalidOperationException("Insufficient funds.");
        Balance -= amount;
    }
}`,
      output: "Balance: 80",
      walkthrough: [
        "`Balance` is publicly readable but only writable from inside the class.",
        "`Deposit` and `Withdraw` guard the rules; an invalid state is impossible from outside.",
        "The constructor refuses to build an invalid account in the first place.",
      ],
    },
    practice: {
      prompt:
        "Encapsulate a `ShoppingCart`. Internally it holds `List<CartItem>`, but expose only `Items` (read-only), `AddItem(string sku, int qty)`, and `RemoveItem(string sku)`. Adding a non-positive quantity must throw.",
      expectedResult:
        "Outside code can read the items but cannot mutate the underlying list directly; quantity validation is centralised.",
      hints: [
        "Use `IReadOnlyList<CartItem>` as the public projection.",
        "Keep the backing field `private readonly`.",
        "Throw `ArgumentException` for invalid quantities.",
      ],
      solution:
        "Private `List<CartItem> _items = new();` exposed via `public IReadOnlyList<CartItem> Items => _items;`. `AddItem` validates and appends; `RemoveItem` calls `_items.RemoveAll(i => i.Sku == sku)`. Callers cannot reach the list directly.",
    },
    quiz: [
      {
        kind: "concept",
        question: "Which property declaration best encapsulates a domain value?",
        options: [
          "`public decimal Balance;`",
          "`public decimal Balance { get; set; }`",
          "`public decimal Balance { get; private set; }`",
          "`internal decimal Balance { get; init; }` with no other access path",
        ],
        correctAnswer: "`public decimal Balance { get; private set; }`",
        explanation:
          "Public read with private write lets the class control all mutation paths while still exposing the current value to the world.",
      },
      {
        kind: "code-reading",
        question:
          "Look at this call site:\n```csharp\nvar acct = new BankAccount(50);\nacct.Withdraw(60);\n```\nWhat happens?",
        options: [
          "Balance becomes -10.",
          "Balance becomes 50 and `Withdraw` silently fails.",
          "`InvalidOperationException` is thrown.",
          "Compilation error.",
        ],
        correctAnswer: "`InvalidOperationException` is thrown.",
        explanation:
          "The encapsulated rule rejects withdrawals greater than the balance — that is the whole point of routing mutations through the method.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What invariant does this class fail to protect?\n```csharp\npublic class Cart\n{\n    public List<CartItem> Items { get; } = new();\n}\n```",
        options: [
          "Nothing — `get`-only auto-property is enough.",
          "Callers can still call `cart.Items.Add(...)` directly, bypassing any rule the `Cart` class might want to enforce.",
          "`List` cannot be a property.",
          "The constructor is missing.",
        ],
        correctAnswer:
          "Callers can still call `cart.Items.Add(...)` directly, bypassing any rule the `Cart` class might want to enforce.",
        explanation:
          "`get`-only blocks reassignment but not mutation of the underlying list. Expose `IReadOnlyList<T>` and provide methods.",
      },
      {
        kind: "interview",
        question: "How would you describe encapsulation to a teammate in one sentence?",
        options: [
          "Marking everything `private` so nothing else can use the class.",
          "Hiding internal state behind methods that enforce the rules the class is responsible for.",
          "Adding `[Encapsulated]` attributes to your properties.",
          "Putting all classes in the same file so they can see each other.",
        ],
        correctAnswer:
          "Hiding internal state behind methods that enforce the rules the class is responsible for.",
        explanation:
          "Encapsulation is about controlling access in service of invariants, not about hiding everything for its own sake.",
      },
    ],
  },

  inheritance: {
    whyItMatters:
      "Inheritance is in every framework you will touch — controllers inherit from `ControllerBase`, exceptions from `Exception`. Misused, it is also the fastest way to make code rigid and hard to test.",
    simpleExplanation:
      "Inheritance lets a class reuse the members of another class. The child gets everything the parent has, plus what it adds.",
    deepExplanation:
      "Use inheritance for a true 'is-a' relationship — `AdminUser` is a `User`, `HttpException` is an `Exception`. The child substitutes for the parent everywhere the parent is expected (the Liskov Substitution Principle). When the relationship is 'has-a' or 'uses-a' (e.g. an `OrderService` uses an `IEmailSender`), composition is almost always the better tool. Deep inheritance trees are a smell: they couple the child's behaviour to choices made in classes it might not even see.",
    realWorldUsage:
      "ASP.NET Core's `ControllerBase` provides routing helpers, model binding, and `Ok()` / `NotFound()` results. Your `OrdersController : ControllerBase` inherits all of that and adds endpoints for the domain.",
    explainLikeBeginner:
      "If you build a `Car` class with wheels and an engine, a `RaceCar` class can inherit from `Car` and just add a spoiler. It reuses everything the car already has.",
    interviewAnswer:
      "Inheritance models an is-a relationship between types so the child class reuses and may extend or override the parent's behaviour. In .NET it should respect the Liskov Substitution Principle, and prefer composition when you only want to reuse code rather than express a true subtype.",
    commonMistakes: [
      "Inheriting just to share helper methods — composition or static utilities would be cleaner.",
      "Deep hierarchies (`A : B : C : D`) where a change in `A` cascades through every descendant.",
      "Overriding a method to do nothing — a sign the child is not really an `is-a` of the parent.",
    ],
    bestPractices: [
      "Use inheritance only for genuine 'is-a' relationships.",
      "Keep hierarchies shallow; favour composition for code reuse.",
      "Mark members `virtual` deliberately — overridable surface is part of your public contract.",
    ],
    summary: [
      "Inheritance reuses and extends behaviour from a parent class.",
      "It models 'is-a', not 'has-a'.",
      "Prefer composition when in doubt; deep trees are a maintenance trap.",
    ],
    codeExample: {
      title: "Specialised exception type",
      code: `public class NotFoundException : Exception
{
    public string Resource { get; }

    public NotFoundException(string resource, string id)
        : base($"{resource} '{id}' was not found.")
    {
        Resource = resource;
    }
}

// In a controller:
throw new NotFoundException("Order", orderId.ToString());`,
      output: "Unhandled exception: NotFoundException: Order '42' was not found.",
      walkthrough: [
        "`NotFoundException` inherits from `Exception` and adds a domain-specific field.",
        "The constructor forwards a formatted message to the base via `: base(...)`.",
        "Anywhere `Exception` is expected — middleware, `catch` blocks — this type slots in.",
      ],
    },
    practice: {
      prompt:
        "Create an abstract `Employee` class with `Name` and an abstract `decimal CalculatePay()` method. Add two children: `SalariedEmployee` (returns annual salary / 12) and `HourlyEmployee` (returns `HoursWorked * Rate`).",
      expectedResult:
        "A list of mixed employees can be iterated and each `CalculatePay()` returns the right value for its concrete type.",
      hints: [
        "`abstract` forces children to provide an implementation.",
        "Use a constructor on the base to initialise `Name`.",
        "Loop with `foreach (var e in employees) Console.WriteLine(e.CalculatePay());`.",
      ],
      solution:
        "`abstract class Employee { public string Name; protected Employee(string n) { Name = n; } public abstract decimal CalculatePay(); }`. Both subclasses override `CalculatePay`. The loop calls each subclass's override at runtime via virtual dispatch.",
    },
    quiz: [
      {
        kind: "concept",
        question:
          "When is inheritance the right tool over composition in a .NET service?",
        options: [
          "When you want to reuse a single helper method.",
          "When the child class is a true subtype that should be usable everywhere the parent is.",
          "When you want to share fields between unrelated classes.",
          "When you want faster code.",
        ],
        correctAnswer:
          "When the child class is a true subtype that should be usable everywhere the parent is.",
        explanation:
          "Inheritance is for is-a relationships that respect substitutability. For pure code reuse, composition is safer.",
      },
      {
        kind: "code-reading",
        question:
          "What does this print?\n```csharp\nException ex = new NotFoundException(\"Order\", \"42\");\nConsole.WriteLine(ex.Message);\n```",
        options: [
          "\"NotFoundException\"",
          "\"Order '42' was not found.\"",
          "\"42\"",
          "An empty string",
        ],
        correctAnswer: "\"Order '42' was not found.\"",
        explanation:
          "The child constructor forwarded that formatted string to `Exception`'s constructor, and `Message` returns it through the base reference.",
      },
      {
        kind: "spot-the-bug",
        question:
          "Why is this hierarchy a red flag?\n```csharp\nclass Animal { public virtual void Move() { } }\nclass Dog : Animal { public override void Move() { /* run */ } }\nclass Stone : Animal { public override void Move() { /* throw? */ } }\n```",
        options: [
          "There is no bug — it compiles.",
          "`Stone` is not an `Animal` in any sensible sense, so the inheritance breaks the is-a rule and forces an awkward override.",
          "`virtual` is not allowed in C#.",
          "`Move` should be `static`.",
        ],
        correctAnswer:
          "`Stone` is not an `Animal` in any sensible sense, so the inheritance breaks the is-a rule and forces an awkward override.",
        explanation:
          "If the override has to throw or do nothing, the child is signalling it does not belong under that parent.",
      },
      {
        kind: "interview",
        question:
          "An interviewer asks: 'When would you reach for composition instead of inheritance?'",
        options: [
          "When the relationship is more 'has-a' than 'is-a' and you want to swap implementations without coupling to a base class.",
          "Whenever the parent is in the same assembly.",
          "Composition is always wrong; inheritance is preferred.",
          "When the parent class is `sealed`.",
        ],
        correctAnswer:
          "When the relationship is more 'has-a' than 'is-a' and you want to swap implementations without coupling to a base class.",
        explanation:
          "Composition keeps coupling explicit (you pass the dependency in) and is the standard answer for testable, flexible designs.",
      },
    ],
  },

  polymorphism: {
    whyItMatters:
      "Polymorphism is what makes DI containers, controllers, and EF Core actually work — the framework calls your code through an interface or base class without caring which concrete type you wrote.",
    simpleExplanation:
      "Polymorphism means one method name behaves differently depending on the object behind it. The caller does not need a `switch` on the type.",
    deepExplanation:
      "Two flavours matter in .NET. Subtype polymorphism: `IEmailSender` has two implementations, `SmtpEmailSender` and `FakeEmailSender`; the service depends on the interface and the runtime picks the concrete instance. Parametric polymorphism: generics like `Repository<T>` work for any `T` without copy-pasting. The pay-off is open-for-extension code: adding a third email sender does not require touching the consumer.",
    realWorldUsage:
      "Your `OrderService` accepts an `IPaymentGateway`. In production it is wired to `StripeGateway`; in tests it is a `FakePaymentGateway`. The service code is identical in both cases.",
    explainLikeBeginner:
      "A remote control has one 'on' button. It works whether you point it at a TV or a stereo — each device responds to 'on' its own way.",
    interviewAnswer:
      "Polymorphism lets one call site work with many concrete types through a shared interface or base class. In .NET it underpins dependency injection, virtual method dispatch, and generics, and it is what lets a service depend on abstractions rather than concrete implementations.",
    commonMistakes: [
      "Switching on a runtime type (`if (x is Foo) ... else if (x is Bar) ...`) instead of letting a virtual method dispatch.",
      "Marking everything `virtual` 'just in case' — overridable members become part of the contract.",
      "Forgetting to register the new implementation in the DI container so the abstraction is never resolved.",
    ],
    bestPractices: [
      "Depend on interfaces in service constructors; resolve concretes only in the composition root.",
      "Use `sealed` on classes that should not be inherited from to make intent explicit.",
      "Reach for generics when the logic is identical and only the type changes.",
    ],
    summary: [
      "Polymorphism = one call, many concrete behaviours.",
      "Backed by virtual methods, interfaces, and generics.",
      "It is the mechanism behind DI and replaceable infrastructure.",
    ],
    codeExample: {
      title: "Swappable email senders",
      code: `public interface IEmailSender
{
    Task SendAsync(string to, string subject, string body);
}

public sealed class SmtpEmailSender : IEmailSender
{
    public Task SendAsync(string to, string subject, string body)
    {
        Console.WriteLine($"[SMTP] -> {to}: {subject}");
        return Task.CompletedTask;
    }
}

public sealed class WelcomeEmailService
{
    private readonly IEmailSender _sender;
    public WelcomeEmailService(IEmailSender sender) => _sender = sender;

    public Task SendAsync(string to) =>
        _sender.SendAsync(to, "Welcome", "Glad to have you on board.");
}`,
      output: "[SMTP] -> alice@example.com: Welcome",
      walkthrough: [
        "`WelcomeEmailService` does not know which sender it is using.",
        "Swapping `SmtpEmailSender` for `FakeEmailSender` in DI changes the behaviour with no edits to the service.",
        "This is subtype polymorphism in everyday .NET code.",
      ],
    },
    practice: {
      prompt:
        "Define `INotifier` with `void Notify(string message)`. Provide `EmailNotifier` and `SmsNotifier`. Write an `AlertService` that takes an `IEnumerable<INotifier>` in its constructor and notifies all of them in one call.",
      expectedResult:
        "Calling `alertService.Alert(\"down\")` causes every registered notifier to log its own variant of the message.",
      hints: [
        "Use a `foreach` over the notifiers.",
        "Inject the list in the constructor — do not new them up inside the service.",
        "Register both implementations in DI in the composition root.",
      ],
      solution:
        "`AlertService` stores `IEnumerable<INotifier> _notifiers`. `Alert(msg)` iterates and calls `Notify(msg)` on each. Adding a `SlackNotifier` later requires zero changes to `AlertService` — just register it.",
    },
    quiz: [
      {
        kind: "concept",
        question: "Which sentence best defines polymorphism in .NET?",
        options: [
          "A class can have multiple constructors.",
          "One call site can invoke different concrete implementations through a shared interface or base type.",
          "A method can be overloaded with different parameter lists.",
          "A program can run on multiple operating systems.",
        ],
        correctAnswer:
          "One call site can invoke different concrete implementations through a shared interface or base type.",
        explanation:
          "Constructor count and method overloading are unrelated. Cross-platform support is also unrelated — that is the runtime.",
      },
      {
        kind: "code-reading",
        question:
          "Given `IEmailSender sender = new SmtpEmailSender();`, what determines which `SendAsync` runs?",
        options: [
          "The declared type `IEmailSender`.",
          "The runtime type `SmtpEmailSender`.",
          "Whichever was registered first in DI.",
          "Whichever method has the most parameters.",
        ],
        correctAnswer: "The runtime type `SmtpEmailSender`.",
        explanation:
          "Virtual dispatch picks the concrete implementation, not the static type of the variable.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is wrong with this code?\n```csharp\npublic void Send(IEmailSender s)\n{\n    if (s is SmtpEmailSender smtp) smtp.SendAsync(...);\n    else if (s is FakeEmailSender fake) fake.SendAsync(...);\n}\n```",
        options: [
          "Nothing — the type checks make it explicit.",
          "It defeats polymorphism: just call `s.SendAsync(...)` and let dispatch pick the implementation.",
          "`is` is not a valid C# keyword.",
          "`SendAsync` cannot be called on an interface.",
        ],
        correctAnswer:
          "It defeats polymorphism: just call `s.SendAsync(...)` and let dispatch pick the implementation.",
        explanation:
          "Manually switching on the concrete type forces this method to change every time a new sender is added — exactly what polymorphism is supposed to avoid.",
      },
      {
        kind: "interview",
        question:
          "Why is polymorphism essential to dependency injection?",
        options: [
          "DI containers literally cannot work without it.",
          "Because consumers depend on an abstraction, the container can hand them any concrete implementation that satisfies that abstraction at runtime.",
          "It makes the container thread-safe.",
          "It is unrelated to DI.",
        ],
        correctAnswer:
          "Because consumers depend on an abstraction, the container can hand them any concrete implementation that satisfies that abstraction at runtime.",
        explanation:
          "DI's whole value is decoupling consumers from implementations; polymorphism is the language mechanism that makes the swap safe.",
      },
    ],
  },

  abstraction: {
    whyItMatters:
      "Abstraction is what lets you change a database, message broker, or cloud provider later without rewriting your business logic.",
    simpleExplanation:
      "Abstraction means exposing what something does and hiding how it does it. Callers see the contract; the implementation can change without breaking them.",
    deepExplanation:
      "In .NET, abstraction usually takes the shape of an interface or an abstract class. `IOrderRepository` says 'something can get and save orders' without saying whether it talks to SQL Server, an in-memory dictionary, or a REST API. Code that depends on the interface is decoupled from the storage choice. The art is choosing the right contract — too narrow and you constantly have to widen it; too wide and you have leaked implementation details and lost the benefit.",
    realWorldUsage:
      "Your `OrderService` depends on `IOrderRepository`. In production it is an EF Core repository; in unit tests it is a hand-written in-memory fake. The service did not change.",
    explainLikeBeginner:
      "When you drive a car, you only use the steering wheel and pedals. You do not need to know what the engine is doing. That is abstraction.",
    interviewAnswer:
      "Abstraction is exposing essential behaviour through a contract while hiding the implementation. In .NET it is realised through interfaces and abstract classes, and it is what makes infrastructure swappable and code testable.",
    commonMistakes: [
      "Defining an interface with the same shape as the only implementation 'just in case' — adds noise without value.",
      "Leaking implementation details (e.g. SQL-specific exceptions) through the abstraction.",
      "Designing abstractions before understanding the domain — the contract becomes wrong almost immediately.",
    ],
    bestPractices: [
      "Extract an interface when you have two real implementations (or a real one plus a test fake).",
      "Keep contracts focused: one role per interface.",
      "Throw or return abstraction-level errors, not infrastructure-specific ones.",
    ],
    summary: [
      "Abstraction exposes the 'what', hides the 'how'.",
      "Realised in C# by `interface` and `abstract class`.",
      "Earn an abstraction; do not pre-emptively guess.",
    ],
    codeExample: {
      title: "Repository abstraction",
      code: `public interface IOrderRepository
{
    Task<Order?> FindAsync(Guid id);
    Task SaveAsync(Order order);
}

public sealed class InMemoryOrderRepository : IOrderRepository
{
    private readonly Dictionary<Guid, Order> _store = new();
    public Task<Order?> FindAsync(Guid id) =>
        Task.FromResult(_store.GetValueOrDefault(id));
    public Task SaveAsync(Order order)
    {
        _store[order.Id] = order;
        return Task.CompletedTask;
    }
}`,
      output: "(no console output — exercised through service / tests)",
      walkthrough: [
        "The interface describes intent: find by id, save.",
        "The in-memory implementation is enough for unit tests and a first prototype.",
        "An EF Core implementation can replace it without consumers noticing.",
      ],
    },
    practice: {
      prompt:
        "Define `ITimeProvider { DateTimeOffset Now { get; } }`. Provide `SystemTimeProvider` (returns `DateTimeOffset.UtcNow`) and `FakeTimeProvider` (returns a configurable value). Refactor a method that currently calls `DateTimeOffset.UtcNow` to take an `ITimeProvider` instead.",
      expectedResult:
        "A unit test can pin time to a known value and assert against it without touching the system clock.",
      hints: [
        "Inject `ITimeProvider` through the constructor.",
        "Set `FakeTimeProvider.Now` in the test setup.",
        "Replace `DateTimeOffset.UtcNow` everywhere in the unit under test.",
      ],
      solution:
        "Constructor stores `_clock`. Calls become `_clock.Now`. Production wires `SystemTimeProvider`; tests use `FakeTimeProvider { Now = new DateTimeOffset(2025,1,1,...) }` to make time-sensitive logic deterministic.",
    },
    quiz: [
      {
        kind: "concept",
        question: "Abstraction in C# is primarily realised through which constructs?",
        options: [
          "`interface` and `abstract class`",
          "`enum` and `struct`",
          "`record` and `delegate`",
          "`namespace` and `using`",
        ],
        correctAnswer: "`interface` and `abstract class`",
        explanation:
          "Interfaces define pure contracts; abstract classes can mix contract with shared implementation. Records, enums, namespaces are unrelated.",
      },
      {
        kind: "code-reading",
        question:
          "Why is this method easy to unit-test?\n```csharp\npublic class TokenIssuer\n{\n    private readonly ITimeProvider _clock;\n    public TokenIssuer(ITimeProvider clock) => _clock = clock;\n    public DateTimeOffset Expiry() => _clock.Now.AddMinutes(15);\n}\n```",
        options: [
          "Because `DateTimeOffset` is immutable.",
          "Because the dependency on time is abstracted behind `ITimeProvider`, so tests can pin `Now` to a known value.",
          "Because the method is `public`.",
          "Because it returns `DateTimeOffset`.",
        ],
        correctAnswer:
          "Because the dependency on time is abstracted behind `ITimeProvider`, so tests can pin `Now` to a known value.",
        explanation:
          "The abstraction turns time into an injected dependency, removing the implicit dependency on the system clock.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is the design smell here?\n```csharp\npublic interface IOrderRepository\n{\n    SqlConnection Connection { get; }\n    Task<Order?> FindAsync(Guid id);\n}\n```",
        options: [
          "Interfaces cannot have properties — won't compile.",
          "The `SqlConnection` property leaks the storage choice through the abstraction, defeating its purpose.",
          "`FindAsync` should not return `Order?`.",
          "Nothing is wrong.",
        ],
        correctAnswer:
          "The `SqlConnection` property leaks the storage choice through the abstraction, defeating its purpose.",
        explanation:
          "An abstraction should not name a specific implementation type. Consumers now depend on SQL Server whether they want to or not.",
      },
      {
        kind: "interview",
        question:
          "An interviewer asks: 'When should you NOT introduce an interface?'",
        options: [
          "Never — always extract an interface for every class.",
          "When there is exactly one implementation, no test fake, and no concrete swap planned — the interface adds indirection without benefit.",
          "When the class is `sealed`.",
          "When the class is `public`.",
        ],
        correctAnswer:
          "When there is exactly one implementation, no test fake, and no concrete swap planned — the interface adds indirection without benefit.",
        explanation:
          "Premature abstraction has a real cost. Introduce the contract when you have at least two real consumers of it.",
      },
    ],
  },

  "interface-vs-abstract-class": {
    whyItMatters:
      "Picking the wrong one locks your design. Interfaces commit you to no implementation; abstract classes commit you to a particular base. Knowing when to use each saves rewrites later.",
    simpleExplanation:
      "Use an interface to describe a capability that many unrelated types can have. Use an abstract class when several related classes share both behaviour and state.",
    deepExplanation:
      "In modern C# the line has blurred — interfaces can have default implementations — but the rules of thumb still hold. Interfaces define what an object can do; a class can implement many of them. Abstract classes define what a related family is, can hold fields, can run constructor logic, and can enforce a template. If you need shared state or a partial implementation that subclasses fill in, abstract class is the right pick. If you need a capability label like `IDisposable`, interface is the right pick.",
    realWorldUsage:
      "`ControllerBase` is abstract — every controller is a controller of a particular shape and inherits the framework's helpers. `IActionResult` is an interface — anything that knows how to write an HTTP response can implement it.",
    explainLikeBeginner:
      "Interface = job description ('can drive'). Abstract class = unfinished base car ('this is a car, but the engine is up to you').",
    interviewAnswer:
      "Interfaces define a capability and support multiple inheritance of contract. Abstract classes define a partial implementation in an is-a hierarchy and support shared state and constructors. Choose interfaces for cross-cutting capabilities, abstract classes for related families with shared behaviour.",
    commonMistakes: [
      "Defining an abstract class when no shared state or implementation exists — an interface would have been simpler.",
      "Defining an interface when the family naturally shares constructor logic or fields — leading to copy-paste in every implementation.",
      "Forgetting that classes can implement many interfaces but can only inherit from one base class.",
    ],
    bestPractices: [
      "Default to an interface for cross-cutting roles (logging, sending, formatting).",
      "Reach for an abstract class when the children share fields, constructor parameters, or a template method.",
      "Mix them: an abstract class can implement an interface and provide the shared parts.",
    ],
    summary: [
      "Interface = capability contract; many can be implemented per class.",
      "Abstract class = partial implementation in an is-a hierarchy.",
      "Choose based on whether you need shared state or just a shared role.",
    ],
    codeExample: {
      title: "Both, working together",
      code: `public interface IReport
{
    string Render();
}

public abstract class PdfReport : IReport
{
    protected abstract string BuildBody();
    public string Render() => $"%PDF\\n{BuildBody()}";
}

public sealed class InvoicePdfReport : PdfReport
{
    private readonly decimal _total;
    public InvoicePdfReport(decimal total) => _total = total;
    protected override string BuildBody() => $"Total due: {_total:C}";
}`,
      output: "%PDF\\nTotal due: $42.50",
      walkthrough: [
        "`IReport` is the capability: anything that can render itself implements it.",
        "`PdfReport` is the partial implementation common to every PDF.",
        "`InvoicePdfReport` adds the only thing it owns — the body content.",
      ],
    },
    practice: {
      prompt:
        "Design `IValidator<T> { bool IsValid(T value); }` as the capability. Then design `abstract class StringValidator : IValidator<string>` that pre-trims input and delegates to an abstract `bool IsValidTrimmed(string)` for the actual rule. Subclass it for `EmailValidator`.",
      expectedResult:
        "Trimming logic lives in one place; each subclass writes only the rule for its specific format.",
      hints: [
        "`IsValid` calls `IsValidTrimmed(value.Trim())`.",
        "Subclass overrides `IsValidTrimmed`.",
        "Keep `EmailValidator` focused on the email rule only.",
      ],
      solution:
        "`IValidator<T>` is the cross-cutting capability. `StringValidator` handles the trim once. Adding a `PhoneValidator` later is a one-method override, not a re-implementation of the trim logic.",
    },
    quiz: [
      {
        kind: "concept",
        question: "Which is true of interfaces but not of abstract classes?",
        options: [
          "They can hold instance fields.",
          "A class can implement multiple of them.",
          "They can have constructors.",
          "They can be marked `sealed`.",
        ],
        correctAnswer: "A class can implement multiple of them.",
        explanation:
          "C# allows multiple interface implementation; only one base class. Fields and constructors are abstract-class features.",
      },
      {
        kind: "code-reading",
        question:
          "Why does this compile?\n```csharp\npublic class InvoicePdfReport : PdfReport, IDisposable\n{\n    public void Dispose() { /* ... */ }\n    protected override string BuildBody() => \"...\";\n}\n```",
        options: [
          "Because `IDisposable` is special-cased by the runtime.",
          "Because a class can inherit one base class and implement multiple interfaces simultaneously.",
          "It does not compile.",
          "Because `Dispose` has a default implementation.",
        ],
        correctAnswer:
          "Because a class can inherit one base class and implement multiple interfaces simultaneously.",
        explanation:
          "Single base inheritance, multiple interfaces — a foundational rule of the C# type system.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is wrong with using an abstract class here?\n```csharp\npublic abstract class Loggable { public abstract void Log(string m); }\npublic class Order : Loggable { ... }\npublic class Email : Loggable { ... }\n```",
        options: [
          "`Order` and `Email` are not in the same family; an interface `ILoggable` would model this capability better without forcing a fake hierarchy.",
          "Abstract classes cannot have abstract methods.",
          "`Log` should return a value.",
          "Nothing is wrong.",
        ],
        correctAnswer:
          "`Order` and `Email` are not in the same family; an interface `ILoggable` would model this capability better without forcing a fake hierarchy.",
        explanation:
          "Loggable is a cross-cutting capability, not an is-a relationship. An interface keeps the design open without burning the single base-class slot.",
      },
      {
        kind: "interview",
        question:
          "When would you specifically prefer an abstract class over an interface?",
        options: [
          "When you need multiple inheritance.",
          "When several related types share fields and constructor logic and you want to enforce a template method.",
          "Whenever the codebase is large.",
          "When you only have one implementation.",
        ],
        correctAnswer:
          "When several related types share fields and constructor logic and you want to enforce a template method.",
        explanation:
          "Shared state and template methods are the abstract-class sweet spot; the other options are either wrong or unrelated.",
      },
    ],
  },

  constructor: {
    whyItMatters:
      "Constructors are where you validate inputs and accept dependencies. Get them right and the rest of the class can trust its state; get them wrong and `null` checks leak into every method.",
    simpleExplanation:
      "A constructor builds an object in a valid state. It runs once, when you call `new`, and is where required values are set.",
    deepExplanation:
      "In .NET DI, the constructor is also the wiring point. ASP.NET Core looks at the parameter list, resolves each one from the container, and hands you a fully constructed service. Two rules follow: do not do real work in the constructor (no DB calls, no I/O), and refuse to build the object if a precondition is violated — throw instead of saving a `null`. This way every method on the class can assume the constructor succeeded and the fields are set.",
    realWorldUsage:
      "`public OrderService(IOrderRepository repo, ILogger<OrderService> logger)` — the framework resolves both arguments from DI at request time. Inside the constructor, the service may assign and null-check but should not query the database.",
    explainLikeBeginner:
      "When you build a LEGO set, you snap the required pieces together first. The constructor is that initial 'must have' assembly.",
    interviewAnswer:
      "The constructor's job is to put the object into a valid, fully-initialised state. In .NET it is also where required dependencies are accepted (constructor injection) and where preconditions on inputs are validated by throwing early.",
    commonMistakes: [
      "Doing I/O in the constructor (database queries, HTTP calls) — makes the object hard to construct and impossible to test.",
      "Accepting nullable dependencies and `null`-checking in every method instead of rejecting `null` at construction.",
      "Writing many overloaded constructors with subtly different rules — converge on one main constructor and chain the others.",
    ],
    bestPractices: [
      "Throw `ArgumentNullException` for required nullable params; throw `ArgumentException` for invalid values.",
      "Keep constructors cheap and synchronous — defer real work to a method.",
      "Use `: this(...)` constructor chaining to avoid duplicating validation logic.",
    ],
    summary: [
      "Constructors build an object in a valid state.",
      "They are the wiring point for constructor injection.",
      "Never do real work in a constructor — validate and assign.",
    ],
    codeExample: {
      title: "Constructor with validation + DI",
      code: `public sealed class PricingService
{
    private readonly IRateProvider _rates;
    private readonly ILogger<PricingService> _logger;
    private readonly decimal _markup;

    public PricingService(
        IRateProvider rates,
        ILogger<PricingService> logger,
        decimal markup)
    {
        _rates = rates ?? throw new ArgumentNullException(nameof(rates));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        if (markup < 0) throw new ArgumentOutOfRangeException(nameof(markup));
        _markup = markup;
    }
}`,
      output: "(throws ArgumentNullException if any dependency is null)",
      walkthrough: [
        "Required dependencies are rejected with `ArgumentNullException` — the class cannot exist without them.",
        "Domain values are bounded with `ArgumentOutOfRangeException`.",
        "After the constructor returns, every method can trust that the fields are valid.",
      ],
    },
    practice: {
      prompt:
        "Write a `Money(decimal amount, string currency)` class. Reject `currency` that is not three uppercase letters, and reject negative amounts. Add a primary constructor and a second one that defaults the currency to `USD` by chaining.",
      expectedResult:
        "`new Money(10, \"usd\")` throws; `new Money(10, \"USD\")` succeeds; `new Money(10)` succeeds with `USD`.",
      hints: [
        "Validate with a small regex or `Length == 3 && currency.All(char.IsUpper)`.",
        "Chain with `public Money(decimal amount) : this(amount, \"USD\") { }`.",
        "Throw `ArgumentOutOfRangeException` for negative amounts.",
      ],
      solution:
        "Primary constructor performs all validation. Secondary chains to it. All call sites converge through a single guarded path, so there is no way to construct an invalid `Money`.",
    },
    quiz: [
      {
        kind: "concept",
        question: "What should a constructor NOT do?",
        options: [
          "Assign required fields from its parameters.",
          "Validate inputs and throw on invalid values.",
          "Perform an HTTP call to fetch additional data.",
          "Chain to another constructor with `: this(...)`.",
        ],
        correctAnswer: "Perform an HTTP call to fetch additional data.",
        explanation:
          "Real work — I/O, DB, network — belongs in a method you can call when you need it, not in the constructor.",
      },
      {
        kind: "code-reading",
        question:
          "What does this print?\n```csharp\ntry { var s = new PricingService(null!, NullLogger<PricingService>.Instance, 0.1m); }\ncatch (Exception e) { Console.WriteLine(e.GetType().Name); }\n```",
        options: ["NullReferenceException", "ArgumentNullException", "ArgumentOutOfRangeException", "InvalidOperationException"],
        correctAnswer: "ArgumentNullException",
        explanation:
          "The `?? throw` pattern raises `ArgumentNullException` specifically for null dependencies.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is the problem?\n```csharp\npublic class CustomerService\n{\n    private readonly Customer _customer;\n    public CustomerService(Guid id)\n    {\n        _customer = _db.Customers.Find(id);\n    }\n}\n```",
        options: [
          "It cannot reference `_db` from a constructor.",
          "The constructor does I/O against a database, making the service slow to construct, hard to test, and dependent on a static `_db`.",
          "`Find` should be `FindAsync`.",
          "Nothing is wrong.",
        ],
        correctAnswer:
          "The constructor does I/O against a database, making the service slow to construct, hard to test, and dependent on a static `_db`.",
        explanation:
          "Move the load into a method or accept a `Customer` as a parameter. Constructors should not block on network or DB.",
      },
      {
        kind: "interview",
        question:
          "Why is constructor injection preferred over property injection in .NET?",
        options: [
          "Property injection is slower at runtime.",
          "Constructor injection makes required dependencies explicit and the object always valid after construction; property injection allows half-initialised objects.",
          "Property injection is not supported by C#.",
          "Constructor injection requires less code.",
        ],
        correctAnswer:
          "Constructor injection makes required dependencies explicit and the object always valid after construction; property injection allows half-initialised objects.",
        explanation:
          "Required deps belong in the constructor; the type system then enforces the contract at the call site.",
      },
    ],
  },

  "access-modifiers": {
    whyItMatters:
      "Access modifiers are how you communicate intent to the rest of the team. The compiler then enforces it, so a teammate's autocomplete reflects what is actually safe to use.",
    simpleExplanation:
      "Access modifiers control who can see a class or member. The defaults are restrictive on purpose — open things up only when you mean to.",
    deepExplanation:
      "The five you will use daily in .NET: `public` (visible everywhere), `internal` (visible inside the same assembly — the default for top-level classes), `protected` (visible to derived classes), `private` (visible inside the type — the default for members), and the combinations like `protected internal`. Two common patterns: keep helpers `private`; expose only the methods that are part of the type's contract `public`. For library code, prefer `internal` for things that are not part of the public API so you can change them without breaking consumers.",
    realWorldUsage:
      "Your `OrderService` is `public` so the DI container can construct it. Its helper `RecalculateTotals` is `private`. A `protected virtual` `BuildBody` on `PdfReport` lets subclasses customise without making the seam public.",
    explainLikeBeginner:
      "A door labelled 'staff only' is `private`. A door labelled 'employees of this branch' is `internal`. The front door of the shop is `public`.",
    interviewAnswer:
      "Access modifiers express what is part of a type's contract versus what is an implementation detail. In .NET the common ones are `public`, `internal`, `protected`, and `private`, plus combinations like `protected internal`. Keeping the public surface small is what lets a class evolve without breaking callers.",
    commonMistakes: [
      "Making everything `public` 'just in case'. The public surface becomes the contract, even accidentally.",
      "Forgetting that top-level classes default to `internal` — and being surprised when another project cannot see them.",
      "Mixing `private` fields with `public` setters that bypass the rules the fields were meant to protect.",
    ],
    bestPractices: [
      "Start `private`; widen access only when something else needs it.",
      "Use `internal` for assembly-private helpers in libraries; `public` only for the official API.",
      "Pair `protected virtual` with `sealed override` where appropriate to control extension points.",
    ],
    summary: [
      "Access modifiers shape the type's contract.",
      "Default to the most restrictive level that compiles.",
      "Use `internal` to keep library internals replaceable.",
    ],
    codeExample: {
      title: "Mixed access on one type",
      code: `public sealed class OrderService
{
    private readonly IOrderRepository _repo;

    public OrderService(IOrderRepository repo) => _repo = repo;

    public async Task ConfirmAsync(Guid orderId)
    {
        var order = await _repo.FindAsync(orderId) ?? throw new InvalidOperationException();
        ApplyDiscount(order);
        order.Confirm();
        await _repo.SaveAsync(order);
    }

    private static void ApplyDiscount(Order order) { /* ... */ }
}`,
      output: "(implementation detail hidden; only ConfirmAsync is part of the contract)",
      walkthrough: [
        "`public ConfirmAsync` is the operation other code is allowed to call.",
        "`private ApplyDiscount` is an implementation detail, free to refactor without breaking callers.",
        "`private readonly _repo` belongs to the service and is invisible to the outside.",
      ],
    },
    practice: {
      prompt:
        "Take an existing class that has many `public` properties and audit each one. For every property, decide whether it is part of the type's contract. If not, change it to `private` (or `private` set, `public` get).",
      expectedResult:
        "The public surface of the class shrinks; methods inside it still work because nothing outside relied on the now-private members.",
      hints: [
        "Use 'Find All References' in your IDE to confirm no external caller uses each member.",
        "Migrate fields to properties with appropriate access at the same time.",
        "Compile after each change.",
      ],
      solution:
        "The exercise enforces the discipline of minimising public surface. Anything no external caller needs becomes `private` (or `internal` for cross-class but assembly-local use).",
    },
    quiz: [
      {
        kind: "concept",
        question: "What is the default access for a top-level class with no modifier?",
        options: ["`public`", "`internal`", "`private`", "`protected`"],
        correctAnswer: "`internal`",
        explanation:
          "Top-level types default to `internal`. Members of a class default to `private`. Knowing this avoids surprises in multi-project solutions.",
      },
      {
        kind: "code-reading",
        question:
          "Which line will fail to compile, given `Bar` lives in another assembly?\n```csharp\n// in assembly A\ninternal class Foo { internal void Run() { } }\n\n// in assembly B\nclass Bar { void X() { var f = new Foo(); f.Run(); } }\n```",
        options: [
          "Only `var f = new Foo();`",
          "Only `f.Run();`",
          "Both — `Foo` and its method are not visible outside assembly A.",
          "Nothing — it compiles.",
        ],
        correctAnswer: "Both — `Foo` and its method are not visible outside assembly A.",
        explanation:
          "`internal` confines visibility to the declaring assembly. Both the construction and the call fail.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is the design problem?\n```csharp\npublic class Order\n{\n    public decimal Total;\n    public void Recalculate() { Total = /* ... */; }\n}\n```",
        options: [
          "`Total` is a public field, which lets external code overwrite it and bypass `Recalculate`.",
          "`Recalculate` should be `private`.",
          "Fields are illegal in C#.",
          "Nothing is wrong.",
        ],
        correctAnswer:
          "`Total` is a public field, which lets external code overwrite it and bypass `Recalculate`.",
        explanation:
          "Make `Total` a `public decimal Total { get; private set; }`. Public mutable fields defeat encapsulation regardless of intent.",
      },
      {
        kind: "interview",
        question:
          "Why prefer `internal` over `public` for helper classes in a library?",
        options: [
          "It is faster at runtime.",
          "It keeps them out of the package's public API so you can refactor them later without breaking consumers.",
          "`internal` types cannot be used in DI.",
          "There is no real difference.",
        ],
        correctAnswer:
          "It keeps them out of the package's public API so you can refactor them later without breaking consumers.",
        explanation:
          "Anything `public` is a contract for everyone who depends on your package. Keep that surface as small as you can.",
      },
    ],
  },

  "simple-oop-coding-tasks": {
    whyItMatters:
      "OOP only sticks if you write it. Small drills — bank account, shopping cart, library book — are the fastest way to internalise the four pillars without drowning in framework noise.",
    simpleExplanation:
      "These are bite-sized exercises that ask you to model one concept (account, cart, book) using classes, encapsulation, and methods that enforce rules.",
    deepExplanation:
      "Aim for code that another junior could read aloud. Each class has one job, fields are private, methods describe intent, invariants are checked at the boundary. After you finish a drill, refactor it once: extract an interface where you can imagine a fake, add a unit test that pins the rule. That second pass is where most of the learning lives.",
    realWorldUsage:
      "Every entity in a production service — `Order`, `Invoice`, `Subscription` — is essentially one of these drills scaled up. Mastering the small version makes the large version routine.",
    explainLikeBeginner:
      "Like practising scales before playing a song. Small drills make the bigger pieces feel obvious.",
    interviewAnswer:
      "I work through small OOP drills — model a `BankAccount`, a `ShoppingCart`, an `Inventory` — focusing on private state, intent-revealing methods, and unit tests. The goal is to internalise encapsulation and clear contracts before tackling framework-heavy code.",
    commonMistakes: [
      "Solving the drill with one giant method instead of methods named after the rules.",
      "Skipping the unit test — the test is where the design hurts when it is wrong.",
      "Adding inheritance or interfaces before they are needed by the problem.",
    ],
    bestPractices: [
      "Name methods after what they do in the domain, not how they do it.",
      "Write one passing test per behaviour you implement.",
      "Refactor immediately after the test goes green — that is the cheap moment.",
    ],
    summary: [
      "Small OOP drills cement the pillars.",
      "Always write at least one test per behaviour.",
      "Refactor in the green moment, not later.",
    ],
    codeExample: {
      title: "Drill: BankAccount with overdraft rule",
      code: `public sealed class BankAccount
{
    private decimal _balance;
    private readonly decimal _overdraftLimit;

    public BankAccount(decimal opening, decimal overdraftLimit = 0)
    {
        if (opening < 0) throw new ArgumentException();
        _balance = opening;
        _overdraftLimit = overdraftLimit;
    }

    public decimal Balance => _balance;

    public void Withdraw(decimal amount)
    {
        if (amount <= 0) throw new ArgumentException();
        if (_balance - amount < -_overdraftLimit)
            throw new InvalidOperationException("Exceeds overdraft.");
        _balance -= amount;
    }
}`,
      output: "Balance after withdraw 30 from 50 with overdraft 0: 20",
      walkthrough: [
        "Private field, public read-only projection.",
        "The overdraft rule is a single guard inside `Withdraw`.",
        "Tests would cover: at limit, beyond limit, zero, negative.",
      ],
    },
    practice: {
      prompt:
        "Implement a `Library` class with a `BorrowBook(string isbn, string memberId)` and a `ReturnBook(string isbn)` method. Track loans internally. A book that is already on loan cannot be borrowed again.",
      expectedResult:
        "Borrowing a book on loan throws; returning it makes it available again; the library never exposes the raw loan map.",
      hints: [
        "Use a `Dictionary<string, string>` keyed by ISBN with the borrower as the value.",
        "Expose loans only via a read-only projection.",
        "Write tests for the borrow/return/borrow-again sequence.",
      ],
      solution:
        "Private `_loans` dictionary; `BorrowBook` checks `ContainsKey` and throws if true. `ReturnBook` calls `Remove`. Public `Loans` returns `IReadOnlyDictionary<string, string>`. Three small tests cover the main paths.",
    },
    quiz: [
      {
        kind: "concept",
        question: "What is the main goal of a small OOP drill?",
        options: [
          "To write as much code as possible.",
          "To practise encapsulation, intent-revealing methods, and small tests on a problem you can hold in your head.",
          "To explore framework features.",
          "To memorise design patterns.",
        ],
        correctAnswer:
          "To practise encapsulation, intent-revealing methods, and small tests on a problem you can hold in your head.",
        explanation:
          "Drills are deliberately tiny so the design choices stand out and you can finish them with a test in the green.",
      },
      {
        kind: "code-reading",
        question:
          "What does this assert?\n```csharp\nvar acct = new BankAccount(50, overdraftLimit: 0);\nAssert.Throws<InvalidOperationException>(() => acct.Withdraw(60));\n```",
        options: [
          "That withdrawing more than the balance throws when overdraft is zero.",
          "That `Withdraw` returns the new balance.",
          "That `Withdraw` is `async`.",
          "Nothing — the code does not compile.",
        ],
        correctAnswer: "That withdrawing more than the balance throws when overdraft is zero.",
        explanation:
          "The test pins the overdraft rule precisely at the boundary the class is responsible for.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is the design problem?\n```csharp\npublic void DoStuff(BankAccount a)\n{\n    if (a.Balance >= 50) { a.Balance -= 50; }\n}\n```",
        options: [
          "It will not compile if `Balance` has a private setter.",
          "It defeats encapsulation by performing the withdrawal rule outside the class instead of calling `a.Withdraw(50)`.",
          "`DoStuff` should be `async`.",
          "`50` should be a constant.",
        ],
        correctAnswer:
          "It defeats encapsulation by performing the withdrawal rule outside the class instead of calling `a.Withdraw(50)`.",
        explanation:
          "Even if the setter were public, the rule belongs on the account. The caller should ask, not poke.",
      },
      {
        kind: "interview",
        question: "Why are small OOP drills useful as interview prep?",
        options: [
          "They prove you can write huge applications.",
          "They show in 15 minutes whether a candidate can model a domain, hide state, and write a focused test — exactly the skills a junior backend role needs.",
          "They make you memorise framework APIs.",
          "They are not useful.",
        ],
        correctAnswer:
          "They show in 15 minutes whether a candidate can model a domain, hide state, and write a focused test — exactly the skills a junior backend role needs.",
        explanation:
          "Live-coding rounds are usually a small OOP drill; mastering the form pays back directly.",
      },
    ],
  },

  "oop-in-real-backend-projects": {
    whyItMatters:
      "Tutorials show single-file examples; real backends layer dozens of classes. Knowing how OOP plays out across controllers, services, repositories, and entities is what makes a real codebase legible.",
    simpleExplanation:
      "In a real .NET service, OOP shows up as a stack: controllers handle HTTP, services contain rules, repositories talk to the database, and entities (or domain objects) hold business state.",
    deepExplanation:
      "Each layer has one job. The controller turns HTTP into a method call on a service. The service orchestrates rules and uses repositories for persistence. The entity owns the invariants — it is the OOP heart of the system. Dependencies point inwards: controllers know services, services know repository interfaces, but entities know nothing about HTTP or SQL. This separation is what lets you swap EF Core for Dapper, or unit-test a service without standing up a database.",
    realWorldUsage:
      "A POST to `/orders/{id}/confirm` calls `OrdersController.Confirm(id)`, which calls `_orderService.ConfirmAsync(id)`, which loads via `IOrderRepository`, calls `order.Confirm()` on the entity, then saves. Three layers, each replaceable.",
    explainLikeBeginner:
      "Think of a restaurant. The waiter (controller) takes the order. The chef (service) decides how to cook it. The pantry (repository) holds ingredients. The dish (entity) is what gets served.",
    interviewAnswer:
      "I structure backends with controllers handling HTTP, services holding business rules, repositories abstracting persistence, and entities owning the domain invariants. Each layer depends on abstractions from the layer beneath it, which keeps the rules testable and the infrastructure swappable.",
    commonMistakes: [
      "Putting business rules in the controller — the controller becomes a god class and the service is a pass-through.",
      "Letting entities query the database — they should know nothing about persistence.",
      "Skipping the repository abstraction and using `DbContext` directly in services for 'simplicity', then being unable to test them.",
    ],
    bestPractices: [
      "Push rules down: controllers parse, services decide, entities enforce.",
      "Depend on `IRepository`, never on `DbContext`, inside services.",
      "Keep entities free of attributes and references that tie them to a specific framework.",
    ],
    summary: [
      "Real .NET backends layer controllers, services, repositories, entities.",
      "Dependencies point inwards toward the domain.",
      "Each layer is replaceable and testable in isolation.",
    ],
    codeExample: {
      title: "The full slice for confirming an order",
      code: `[ApiController, Route("orders")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orders;
    public OrdersController(IOrderService orders) => _orders = orders;

    [HttpPost("{id:guid}/confirm")]
    public async Task<IActionResult> Confirm(Guid id)
    {
        await _orders.ConfirmAsync(id);
        return NoContent();
    }
}

public sealed class OrderService : IOrderService
{
    private readonly IOrderRepository _repo;
    public OrderService(IOrderRepository repo) => _repo = repo;

    public async Task ConfirmAsync(Guid id)
    {
        var order = await _repo.FindAsync(id)
            ?? throw new NotFoundException("Order", id.ToString());
        order.Confirm();
        await _repo.SaveAsync(order);
    }
}`,
      output: "HTTP/1.1 204 No Content",
      walkthrough: [
        "Controller is a thin adapter — it parses the route and calls the service.",
        "Service holds the orchestration: load, mutate, save.",
        "Entity enforces the rule (`order.Confirm()` rejects empty orders, etc.).",
      ],
    },
    practice: {
      prompt:
        "Slice a tiny `/customers/{id}/deactivate` endpoint. Implement a `CustomersController`, an `ICustomerService` with `DeactivateAsync`, an `ICustomerRepository`, and a `Customer` entity that refuses to deactivate if there are unpaid invoices.",
      expectedResult:
        "The rule lives on `Customer.Deactivate`; the service orchestrates load-mutate-save; the controller is two lines.",
      hints: [
        "Inject the service into the controller via constructor.",
        "Use an in-memory repository to test the service without a database.",
        "Throw a meaningful exception (`InvalidOperationException`) when invoices are unpaid.",
      ],
      solution:
        "The endpoint returns `204` on success and translates the exception to `409 Conflict` via middleware. Each layer is testable in isolation: controller (with a fake service), service (with an in-memory repo), entity (pure unit test).",
    },
    quiz: [
      {
        kind: "concept",
        question:
          "Where do business rules belong in a layered .NET backend?",
        options: [
          "In the controller, so they are close to the HTTP route.",
          "In the database via stored procedures.",
          "On the entity and orchestrated by the service.",
          "Anywhere — it does not matter.",
        ],
        correctAnswer: "On the entity and orchestrated by the service.",
        explanation:
          "Putting rules on the entity keeps them centralised and unit-testable; the service orchestrates without re-implementing the rule.",
      },
      {
        kind: "code-reading",
        question:
          "Why is `OrdersController` easy to test even without a real database?",
        options: [
          "Because controllers are special-cased by the framework.",
          "Because it depends on `IOrderService`, which can be replaced with a fake in tests.",
          "Because `ConfirmAsync` is `async`.",
          "Because `NoContent` does not touch the database.",
        ],
        correctAnswer:
          "Because it depends on `IOrderService`, which can be replaced with a fake in tests.",
        explanation:
          "Depending on the abstraction is the unlock. The controller never sees the concrete implementation.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What design rule does this break?\n```csharp\npublic class CustomersController : ControllerBase\n{\n    private readonly AppDbContext _db;\n    public async Task<IActionResult> Deactivate(Guid id)\n    {\n        var c = await _db.Customers.FindAsync(id);\n        if (c.HasUnpaidInvoices()) return Conflict();\n        c.IsActive = false;\n        await _db.SaveChangesAsync();\n        return NoContent();\n    }\n}`",
        options: [
          "It puts persistence and business logic directly in the controller, with no service or repository abstraction.",
          "`Deactivate` is not allowed to be `async`.",
          "`FindAsync` does not exist.",
          "Nothing is wrong.",
        ],
        correctAnswer:
          "It puts persistence and business logic directly in the controller, with no service or repository abstraction.",
        explanation:
          "The controller now knows about EF Core and the business rule simultaneously. It is also untestable without spinning up the database.",
      },
      {
        kind: "interview",
        question:
          "An interviewer asks: 'Why introduce a repository when EF Core already abstracts the database?'",
        options: [
          "It does not — always use `DbContext` directly.",
          "A repository gives a domain-shaped abstraction that the service can fake in tests, and it isolates the choice of EF Core so it can be swapped or supplemented later.",
          "It is faster than EF Core.",
          "Repositories are required by C#.",
        ],
        correctAnswer:
          "A repository gives a domain-shaped abstraction that the service can fake in tests, and it isolates the choice of EF Core so it can be swapped or supplemented later.",
        explanation:
          "EF Core abstracts SQL but couples you to its API. A thin repository keeps services depending on your domain language, not on the ORM.",
      },
    ],
  },
} as ModuleContent;
