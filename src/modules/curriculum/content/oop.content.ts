import type { ModuleContent } from "./types";

export const oopContent = {
  "what-is-oop": {
    whyItMatters:
      "OOP matters because it helps us write code that is easier to understand, change, test, and reuse. Without OOP, code can become messy very quickly. Picture an ERP system with Users, Orders, Invoices, Payments, Products, Reports, Permissions, and Notifications. If everything is written in one big file or one big function, the project becomes hard to maintain. OOP helps split the system into smaller meaningful parts where each part has a clear job.",
    simpleExplanation:
      "Object-Oriented Programming, or OOP, is a way of writing code by thinking in terms of objects. An object represents something from the real world or from your application — for example User, Student, Order, Product, or Invoice. Each object has its own data and its own behavior.",
    deepExplanation:
      "OOP is built on four main ideas. Encapsulation means keeping data safe inside an object. Inheritance means one class can reuse the features of another. Polymorphism means the same method can behave differently for different objects. Abstraction means hiding details and showing only what is important. When you put these four ideas together, you can model almost any real business problem in a clean way. In .NET, every entity, service, and controller is built using these ideas.",
    realWorldUsage:
      "In a .NET application, OOP is everywhere. Entities like User, Order, and Product represent database records. Services like OrderService and PaymentService contain business logic. DTOs like OrderDto carry data between layers. Controllers handle API requests and return responses. Each of these is a class with its own data and its own behavior.",
    explainLikeBeginner:
      "Think of OOP as a way to build software using small boxes. Each box has its own information and its own actions. You ask the box to do something instead of doing it yourself. A User box knows its name and email. An Order box knows its items and how to confirm itself. This is much easier to manage than one big pile of code.",
    interviewAnswer:
      "Object-Oriented Programming is a way of designing software using objects. Each object has data and behavior. OOP is based on four ideas: encapsulation, inheritance, polymorphism, and abstraction. .NET applications use OOP to organize code into clean, reusable parts like entities, services, and controllers.",
    commonMistakes: [
      "Putting too much logic in one big class so it becomes hard to read.",
      "Creating classes that do not represent anything meaningful in the system.",
      "Mixing data access, business logic, and presentation in the same class.",
    ],
    bestPractices: [
      "Name classes after the real thing they represent, such as Order, Customer, or Invoice.",
      "Keep each class focused on one clear job.",
      "Use dependency injection to give a class the things it needs from outside.",
    ],
    summary: [
      "OOP groups data and behavior into objects with clear contracts.",
      "The four main ideas are encapsulation, inheritance, polymorphism, and abstraction.",
      ".NET applications are built with OOP to separate domain rules from infrastructure.",
    ],
    codeExample: {
      title: "A small Invoice class with data and behavior",
      code: `public class Invoice
{
    public int Id { get; set; }
    public decimal Amount { get; set; }
    public bool IsPaid { get; private set; }

    public void MarkAsPaid()
    {
        IsPaid = true;
        Console.WriteLine($"Invoice {Id} is paid");
    }
}`,
      output: "Invoice 1 is paid",
      walkthrough: [
        "Invoice is an object in the system. It has Id and Amount as data.",
        "MarkAsPaid is the behavior. It changes IsPaid and prints a message.",
        "All invoice logic lives in one clear place, which makes the code easy to read.",
      ],
    },
    practice: {
      prompt:
        "Create a Customer class with Name and Email properties. Add a method ChangeEmail(string newEmail) that checks the email contains '@' before saving it. Outside code should not be able to change Email directly.",
      expectedResult:
        "Calling customer.ChangeEmail(\"a@b.com\") updates the value. Calling it with \"bad\" throws an ArgumentException.",
      hints: [
        "Use a private setter for Email so only the class itself can change it.",
        "Throw ArgumentException when the input is invalid.",
        "Write one small test for the happy path and one for the invalid path.",
      ],
      solution:
        "Declare public string Email { get; private set; }. In ChangeEmail, check if the value contains '@'. If not, throw ArgumentException. If yes, assign it.",
    },
    quiz: [
      {
        kind: "concept",
        question: "Which sentence best describes OOP in a .NET application?",
        options: [
          "A faster way to write SQL queries.",
          "A way to organize code into objects that hold both data and behavior.",
          "A guarantee that your code will be free of bugs.",
          "A replacement for unit testing.",
        ],
        correctAnswer:
          "A way to organize code into objects that hold both data and behavior.",
        explanation:
          "OOP is about putting related data and the behavior that uses it together inside one object. It does not replace tests, and it has nothing directly to do with SQL.",
      },
      {
        kind: "code-reading",
        question:
          "Given the snippet:\n```csharp\nvar invoice = new Invoice { Id = 1, Amount = 99 };\ninvoice.MarkAsPaid();\n```\nWhat is the value of `invoice.IsPaid` after the second line?",
        options: ["true", "false", "null", "0"],
        correctAnswer: "true",
        explanation:
          "MarkAsPaid sets IsPaid to true. The property is read-only from outside, so calling the method is the only way to change it.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is wrong with this design?\n```csharp\npublic class Order\n{\n    public string Status;\n    public List<OrderLine> Lines = new();\n}\n```",
        options: [
          "Nothing — it is fine.",
          "It exposes mutable public fields, so any caller can put the order into an invalid state without validation.",
          "It should inherit from object explicitly.",
          "The list should be IEnumerable to compile.",
        ],
        correctAnswer:
          "It exposes mutable public fields, so any caller can put the order into an invalid state without validation.",
        explanation:
          "Public fields let outside code change values without any rules. The class should use properties with controlled access and methods that protect the rules.",
      },
      {
        kind: "interview",
        question:
          "Why use OOP for a small CRUD API at all?",
        options: [
          "Because the framework will not compile without it.",
          "Because OOP is required by REST.",
          "Because separating entities, services, and controllers keeps validation, persistence, and HTTP concerns easy to test and easy to change as the service grows.",
          "Because OOP makes the executable smaller.",
        ],
        correctAnswer:
          "Because separating entities, services, and controllers keeps validation, persistence, and HTTP concerns easy to test and easy to change as the service grows.",
        explanation:
          "The interviewer wants to hear that you understand the long-term benefit: clean separation of concerns and easier maintenance.",
      },
    ],
  },

  "class-vs-object": {
    whyItMatters:
      "It helps you organize code. It helps you understand how C# works. It helps separate structure from data. Confusing the two is one of the most common reasons code compiles but does the wrong thing — often by accidentally sharing data between users or requests.",
    simpleExplanation:
      "A class is a template. It describes what an object should have and what it can do. An object is a real instance created from a class. For example, Student is a class. student1 and student2 are objects, each with their own Name and Age.",
    deepExplanation:
      "A class lives in your source code. It does not take memory until you create an object from it. When you write new Student(), .NET allocates memory for a new object and gives you back a reference to it. Each object has its own copy of the data, but they share the same methods defined in the class. So if you change student1.Name, it does not affect student2.Name. They are independent.",
    realWorldUsage:
      "In a real .NET application, classes describe entities, services, DTOs, and configuration. User is a class that describes a user record. OrderService is a class that describes the operations you can do with orders. LoginRequest is a class that describes the data sent in a login API call. When the application runs, it creates objects from these classes to handle real users, real orders, and real requests.",
    explainLikeBeginner:
      "A cookie cutter is the class. Each cookie you press is an object. The cookie cutter alone is not food. You need to press it to get a real cookie. You can press it many times, and each cookie is its own thing.",
    interviewAnswer:
      "A class is a blueprint or template that defines properties and methods. An object is a real instance created from that class. For example, Car can be a class, and bmw or toyota can be objects. This matters because C# and .NET applications are built using classes and objects to organize data and behavior in a clean and reusable way.",
    commonMistakes: [
      "Using static fields to hold per-request data — the value stays the same for every user.",
      "Comparing two objects with == and being surprised that two different objects are not equal even if their fields match.",
      "Forgetting that a class with no new is just a definition. Nothing runs until you create an object from it.",
    ],
    bestPractices: [
      "Use instance state by default. Reach for static only when the data is truly shared and never changes.",
      "Use records or override Equals when you want value-based comparison.",
      "Pass objects, not classes, into methods that need real data.",
    ],
    summary: [
      "Class is the template. Object is the real thing.",
      "Each new creates an object with its own data.",
      "Static members belong to the class, not to a specific object.",
    ],
    codeExample: {
      title: "Two Student objects from one Student class",
      code: `var student1 = new Student();
student1.Name = "Ali";
student1.Age = 20;
student1.Study();

var student2 = new Student();
student2.Name = "Aisha";
student2.Age = 22;
student2.Study();

public class Student
{
    public string Name { get; set; }
    public int Age { get; set; }

    public void Study()
    {
        Console.WriteLine($"{Name} is studying");
    }
}`,
      output: "Ali is studying\nAisha is studying",
      walkthrough: [
        "Student is the class. It defines that every student has Name, Age, and Study().",
        "student1 and student2 are objects, each with their own Name and Age.",
        "Changing one student does not change the other because each object has its own data.",
      ],
    },
    practice: {
      prompt:
        "Create a Wallet class with a decimal Balance property that is read-only from outside. Add a Deposit(decimal amount) method that adds to the balance only if the amount is positive. Create two Wallet objects and show that their balances are independent.",
      expectedResult:
        "After walletA.Deposit(10) and walletB.Deposit(5), walletA.Balance is 10 and walletB.Balance is 5.",
      hints: [
        "Use public decimal Balance { get; private set; }.",
        "Guard against negative deposits inside the Deposit method.",
        "Print both balances with Console.WriteLine to see that they are independent.",
      ],
      solution:
        "Create the Wallet class with Balance and a Deposit method that validates the input. Two new Wallet() objects each get their own Balance field, so deposits do not affect each other.",
    },
    quiz: [
      {
        kind: "concept",
        question: "Which statement is true about classes and objects?",
        options: [
          "A class is created at runtime; an object is the source code.",
          "Every object of the same class shares all instance fields.",
          "A class is a template, and each object created from it has its own data.",
          "Objects exist without classes.",
        ],
        correctAnswer:
          "A class is a template, and each object created from it has its own data.",
        explanation:
          "Every object created with new gets its own copy of the instance fields, even though the methods are defined once on the class.",
      },
      {
        kind: "code-reading",
        question:
          "Given:\n```csharp\nvar a = new Counter();\nvar b = new Counter();\na.Increment();\na.Increment();\nb.Increment();\n```\nWhat are the values of a.Value and b.Value?",
        options: ["a=1, b=2", "a=2, b=1", "a=3, b=3", "a=2, b=2"],
        correctAnswer: "a=2, b=1",
        explanation:
          "Each Counter has its own Value. a was incremented twice, b was incremented once.",
      },
      {
        kind: "spot-the-bug",
        question:
          "Why is this design dangerous in a web API?\n```csharp\npublic class OrderCache\n{\n    public static List<Order> Orders = new();\n}\n```",
        options: [
          "Nothing — it is a great cache.",
          "Static fields are shared across all users and all requests, so one user can see another user's data.",
          "It needs a constructor.",
          "It will not compile.",
        ],
        correctAnswer:
          "Static fields are shared across all users and all requests, so one user can see another user's data.",
        explanation:
          "A static field belongs to the class, not to a request or a user. In a web API, this leaks data between callers.",
      },
      {
        kind: "interview",
        question:
          "How would you explain the difference between a class and an object to another .NET developer?",
        options: [
          "A class is faster than an object.",
          "An object is a class without methods.",
          "A class is a blueprint that describes structure and behavior. An object is a real instance created from that class. Each object has its own data, but all objects of the same class share the same methods.",
          "Classes and objects are the same thing in C#.",
        ],
        correctAnswer:
          "A class is a blueprint that describes structure and behavior. An object is a real instance created from that class. Each object has its own data, but all objects of the same class share the same methods.",
        explanation:
          "This is the clearest definition. It separates the template from the actual data.",
      },
    ],
  },

  encapsulation: {
    whyItMatters:
      "Encapsulation protects your data from being changed in wrong ways. A BankAccount balance should not be changed by anyone from outside. It should only change through deposit and withdraw methods. Without encapsulation, your business rules can be broken anywhere in the code, and bugs become very hard to find.",
    simpleExplanation:
      "Encapsulation means keeping the data of an object safe and only allowing access through controlled methods or properties. The data is private inside the object. The class itself decides what is allowed.",
    deepExplanation:
      "Encapsulation has two parts. First, you hide the internal data using private. Second, you give safe access through methods or properties. The class controls what is allowed. If a rule changes later, for example a minimum deposit amount, you only update it inside the class. The rest of the project keeps working the same way. This is what makes large projects easier to change over time.",
    realWorldUsage:
      "Entity classes protect important fields like PasswordHash, Balance, or Status. Service classes keep internal helpers private and expose only the main operations such as CreateOrder or ProcessPayment. Configuration classes expose values as read-only properties so they cannot be changed at runtime.",
    explainLikeBeginner:
      "An ATM does not let you reach into its cash drawer. You press buttons, and the ATM decides whether to give you money. The drawer is private. The buttons are the public methods. That is encapsulation.",
    interviewAnswer:
      "Encapsulation means hiding the internal state of an object and exposing only what is needed through methods or properties. It protects the data from invalid changes and keeps business rules inside the class. In .NET, we use access modifiers like private and properties with controlled setters to apply encapsulation.",
    commonMistakes: [
      "Making every field public so any caller can change it.",
      "Putting validation rules in the controller instead of inside the class.",
      "Exposing internal lists directly so callers can add or remove items without rules.",
    ],
    bestPractices: [
      "Use private fields and expose them only through controlled properties or methods.",
      "Return IReadOnlyList<T> for collections and provide methods to change them.",
      "Validate inputs as soon as they enter the class.",
    ],
    summary: [
      "Encapsulation keeps data safe inside the object.",
      "The class itself controls how the data can change.",
      "Business rules live inside the class, not scattered across the code.",
    ],
    codeExample: {
      title: "A BankAccount that protects its balance",
      code: `public class BankAccount
{
    private decimal _balance;

    public decimal Balance => _balance;

    public void Deposit(decimal amount)
    {
        if (amount <= 0) throw new ArgumentException("Amount must be positive");
        _balance += amount;
    }

    public void Withdraw(decimal amount)
    {
        if (amount <= 0) throw new ArgumentException("Amount must be positive");
        if (amount > _balance) throw new InvalidOperationException("Not enough money");
        _balance -= amount;
    }
}`,
      output: "Balance after deposit and withdraw: 70",
      walkthrough: [
        "_balance is private, so no outside code can change it directly.",
        "Deposit and Withdraw are the only ways to change the balance, and each one checks the input.",
        "Balance is a read-only property that simply shows the current value.",
      ],
    },
    practice: {
      prompt:
        "Create a Product class with a Price property that is read-only from outside. Add a method ApplyDiscount(decimal percent) that reduces the price. The percent must be between 0 and 100, otherwise throw an exception.",
      expectedResult:
        "After ApplyDiscount(10) on a product with Price 100, Price becomes 90. Calling ApplyDiscount(150) throws an ArgumentException.",
      hints: [
        "Use a private setter for Price.",
        "Validate the percent value inside the method.",
        "Calculate the new price as Price - (Price * percent / 100).",
      ],
      solution:
        "Declare public decimal Price { get; private set; }. Inside ApplyDiscount, check the range, then compute the new value and assign it.",
    },
    quiz: [
      {
        kind: "concept",
        question: "What does encapsulation mean?",
        options: [
          "Putting all classes in one file.",
          "Hiding internal data and exposing safe operations.",
          "Using inheritance to share behavior.",
          "Naming files in PascalCase.",
        ],
        correctAnswer: "Hiding internal data and exposing safe operations.",
        explanation:
          "Encapsulation protects the data inside an object by allowing changes only through controlled methods or properties.",
      },
      {
        kind: "code-reading",
        question:
          "What happens when this code runs?\n```csharp\nvar account = new BankAccount();\naccount.Deposit(100);\naccount.Withdraw(150);\n```",
        options: [
          "Balance becomes -50.",
          "Balance becomes 0.",
          "An InvalidOperationException is thrown.",
          "The code does nothing.",
        ],
        correctAnswer: "An InvalidOperationException is thrown.",
        explanation:
          "Withdraw checks that the amount is not greater than the balance. Since 150 > 100, the method throws an exception.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is wrong here?\n```csharp\npublic class User\n{\n    public string PasswordHash;\n}\n```",
        options: [
          "Nothing — it is fine.",
          "Anyone can change PasswordHash, which breaks security.",
          "The class needs a constructor.",
          "It will not compile.",
        ],
        correctAnswer:
          "Anyone can change PasswordHash, which breaks security.",
        explanation:
          "PasswordHash is sensitive. Exposing it as a public field lets any code overwrite it, which is unsafe. Use a private setter and a method to change it through clear rules.",
      },
      {
        kind: "interview",
        question:
          "How would you explain encapsulation in an interview?",
        options: [
          "It is a way to write short class names.",
          "It means hiding internal state and exposing only safe operations through methods or properties. It keeps business rules inside the class.",
          "It is the same as inheritance.",
          "It is only useful in tests.",
        ],
        correctAnswer:
          "It means hiding internal state and exposing only safe operations through methods or properties. It keeps business rules inside the class.",
        explanation:
          "This is the cleanest one-line definition. It also explains why we use it.",
      },
    ],
  },

  inheritance: {
    whyItMatters:
      "Inheritance removes duplicate code. When many classes share the same fields or behavior, you can put the shared parts in a base class. This is very common in .NET projects where many entities share fields like Id, CreatedAt, and UpdatedAt.",
    simpleExplanation:
      "Inheritance allows one class to reuse the properties and methods of another class. The child class gets everything from the parent and can add new things or change existing behavior.",
    deepExplanation:
      "When a class inherits from another, it receives all the public and protected members of the parent. The child class can add new members or override the parent's methods. In C#, a class can inherit from only one parent class, but it can implement many interfaces. This keeps inheritance simple and easy to follow. Inheritance is best when there is a clear is-a relationship — for example, Customer is a Person, Employee is a Person.",
    realWorldUsage:
      "A base Entity class with Id, CreatedAt, and UpdatedAt is reused by all database entities. A base ApiController in ASP.NET Core adds shared logic for all controllers. A base AuditLog class is reused by different log types like UserAuditLog and OrderAuditLog.",
    explainLikeBeginner:
      "A base car has wheels, an engine, and a steering wheel. A sports car still has all of these, but it adds extra things like a turbo. The sports car inherits from the base car.",
    interviewAnswer:
      "Inheritance lets one class reuse the members of another class. The child class extends the parent and can add or override behavior. For example, Customer and Employee can both inherit from Person. In .NET, inheritance helps remove duplicate code and create a clean hierarchy of types.",
    commonMistakes: [
      "Using inheritance for code reuse when composition would be cleaner.",
      "Building deep inheritance chains that are hard to follow.",
      "Adding inheritance just because two classes share one or two fields.",
    ],
    bestPractices: [
      "Use inheritance only when there is a clear is-a relationship.",
      "Keep the base class small and focused.",
      "Prefer composition when classes do not share a real hierarchy.",
    ],
    summary: [
      "Inheritance lets a class reuse another class.",
      "The child class can add or override behavior.",
      "Use it when there is a clear is-a relationship.",
    ],
    codeExample: {
      title: "Customer and Employee both inherit from Person",
      code: `public class Person
{
    public string Name { get; set; }
    public string Email { get; set; }
}

public class Customer : Person
{
    public string CustomerCode { get; set; }
}

public class Employee : Person
{
    public decimal Salary { get; set; }
}

var customer = new Customer { Name = "Ali", Email = "ali@example.com", CustomerCode = "C-001" };
var employee = new Employee { Name = "Aisha", Email = "aisha@example.com", Salary = 1000 };`,
      output: "Customer: Ali, C-001\nEmployee: Aisha, 1000",
      walkthrough: [
        "Person is the base class with shared fields Name and Email.",
        "Customer and Employee inherit from Person and add their own fields.",
        "Both child classes already have Name and Email without writing them again.",
      ],
    },
    practice: {
      prompt:
        "Create a base class Vehicle with properties Brand and Speed and a method Start() that prints 'Starting...'. Then create a Car class that inherits from Vehicle and adds a method Honk() that prints 'Beep beep!'.",
      expectedResult:
        "var car = new Car { Brand = \"Toyota\", Speed = 120 }; car.Start(); car.Honk(); prints 'Starting...' and 'Beep beep!'.",
      hints: [
        "Use the syntax public class Car : Vehicle.",
        "Car automatically gets Brand, Speed, and Start().",
        "Add Honk() only on Car.",
      ],
      solution:
        "Define Vehicle with Brand, Speed, and Start(). Define Car : Vehicle that adds Honk(). The Car object can call Start() from the base class and Honk() from its own class.",
    },
    quiz: [
      {
        kind: "concept",
        question: "What does inheritance allow you to do?",
        options: [
          "Create a class that reuses the fields and methods of another class.",
          "Run code faster.",
          "Hide internal data.",
          "Replace unit tests.",
        ],
        correctAnswer:
          "Create a class that reuses the fields and methods of another class.",
        explanation:
          "Inheritance lets a child class get everything from its parent and add or change behavior.",
      },
      {
        kind: "code-reading",
        question:
          "Given that Employee inherits from Person, and Person has Name and Email, what fields does an Employee object have?",
        options: [
          "Only Salary",
          "Only Name and Email",
          "Name, Email, and Salary",
          "Nothing — it must be declared again",
        ],
        correctAnswer: "Name, Email, and Salary",
        explanation:
          "Employee inherits Name and Email from Person and adds its own Salary field.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is wrong with this design?\n```csharp\npublic class Animal {}\npublic class Dog : Animal {}\npublic class Cat : Animal {}\npublic class Truck : Animal {}\n```",
        options: [
          "Nothing.",
          "Truck is not an animal. Inheritance should describe a real is-a relationship.",
          "Animal needs a method.",
          "The classes need constructors.",
        ],
        correctAnswer:
          "Truck is not an animal. Inheritance should describe a real is-a relationship.",
        explanation:
          "Inheritance models a real hierarchy. Truck does not belong under Animal.",
      },
      {
        kind: "interview",
        question:
          "When is inheritance the right choice in a .NET project?",
        options: [
          "Always — it is the cleanest pattern.",
          "Never — composition is always better.",
          "When two classes share a real is-a relationship and benefit from shared fields or behavior. Otherwise, composition is usually cleaner.",
          "When two classes share at least one method name.",
        ],
        correctAnswer:
          "When two classes share a real is-a relationship and benefit from shared fields or behavior. Otherwise, composition is usually cleaner.",
        explanation:
          "Use inheritance for true hierarchies. Use composition when classes only need to share some behavior without a parent-child relationship.",
      },
    ],
  },

  polymorphism: {
    whyItMatters:
      "Polymorphism allows you to write flexible code. You can call the same method on different objects and get the correct behavior for each one. This is the idea behind dependency injection, interfaces, and many design patterns in .NET.",
    simpleExplanation:
      "Polymorphism means the same method can behave differently depending on the object that calls it. A Payment class can have child classes like CardPayment and CashPayment, and each one has its own version of Process().",
    deepExplanation:
      "Polymorphism works through virtual and override in C#. The base class marks a method as virtual, and the child class replaces it with override. At runtime, .NET checks the real type of the object and calls the matching method. This is called runtime polymorphism. It lets you write code that works with the base type while still getting the correct behavior of each child type. Interfaces work in a similar way: you depend on an abstraction, and at runtime any implementation can be plugged in.",
    realWorldUsage:
      "Payment processors: CardPayment, CashPayment, and BankTransferPayment all share a common Process method. Notification senders: EmailNotification, SmsNotification, and PushNotification all share a Send method. Report exporters: PdfExporter, ExcelExporter, and CsvExporter all share an Export method. The calling code does not care which one it is using.",
    explainLikeBeginner:
      "The button on a remote control says 'play'. The same button works for music, movies, or audiobooks. The button is the method. The device is the object. Each device knows what 'play' means for itself.",
    interviewAnswer:
      "Polymorphism means the same method can have different behavior depending on the object type. In C#, we use virtual in the base class and override in the child class. For example, a Payment class can have child classes like CardPayment and CashPayment, each with its own Process method. This makes .NET applications flexible and easy to extend.",
    commonMistakes: [
      "Forgetting to mark the base method as virtual.",
      "Using new instead of override, which hides the method instead of replacing it.",
      "Writing big if/else chains based on the type instead of using polymorphism.",
    ],
    bestPractices: [
      "Use virtual and override when you want different behavior in child classes.",
      "Prefer interfaces when the only thing children share is the contract.",
      "Let the runtime pick the method — do not switch on the type by hand.",
    ],
    summary: [
      "Polymorphism lets the same method call produce different results based on the object type.",
      "Use virtual in the base and override in the child class.",
      "It is the foundation of dependency injection and many design patterns.",
    ],
    codeExample: {
      title: "Different payment types share the same Process method",
      code: `public class Payment
{
    public virtual void Process()
    {
        Console.WriteLine("Processing payment");
    }
}

public class CardPayment : Payment
{
    public override void Process()
    {
        Console.WriteLine("Processing card payment");
    }
}

public class CashPayment : Payment
{
    public override void Process()
    {
        Console.WriteLine("Processing cash payment");
    }
}

Payment payment = new CardPayment();
payment.Process();`,
      output: "Processing card payment",
      walkthrough: [
        "Payment defines a virtual Process method that child classes can override.",
        "CardPayment and CashPayment each provide their own Process logic.",
        "The variable is typed as Payment, but the actual object is a CardPayment, so the card version runs.",
      ],
    },
    practice: {
      prompt:
        "Create a base class Notification with a virtual Send() method that prints 'Sending notification'. Create two child classes, EmailNotification and SmsNotification, that override Send() to print 'Sending email' and 'Sending SMS' respectively. Use a list of Notification to send all of them.",
      expectedResult:
        "Looping over a List<Notification> { new EmailNotification(), new SmsNotification() } and calling Send() prints 'Sending email' and 'Sending SMS'.",
      hints: [
        "Mark Send as virtual in the base class.",
        "Use override in the child classes.",
        "Store both notifications in a list typed as Notification.",
      ],
      solution:
        "Define Notification with virtual Send. Define EmailNotification and SmsNotification with override Send. Put them in a List<Notification> and call Send on each one — the correct version runs for each object.",
    },
    quiz: [
      {
        kind: "concept",
        question: "What does polymorphism mean in C#?",
        options: [
          "Two classes with the same name.",
          "The same method call can run different behavior depending on the actual object type.",
          "A way to write SQL queries.",
          "Hiding data inside a class.",
        ],
        correctAnswer:
          "The same method call can run different behavior depending on the actual object type.",
        explanation:
          "Polymorphism is about one interface that supports many shapes of behavior.",
      },
      {
        kind: "code-reading",
        question:
          "If Payment has a virtual Process method and CardPayment overrides it, what happens here?\n```csharp\nPayment p = new CardPayment();\np.Process();\n```",
        options: [
          "Process from Payment runs.",
          "Process from CardPayment runs.",
          "The code throws an exception.",
          "Nothing happens.",
        ],
        correctAnswer: "Process from CardPayment runs.",
        explanation:
          "Even though the variable is Payment, the actual object is CardPayment, so the override runs.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is wrong here?\n```csharp\npublic class Animal\n{\n    public void Speak() => Console.WriteLine(\"...\");\n}\npublic class Dog : Animal\n{\n    public new void Speak() => Console.WriteLine(\"Woof\");\n}\nAnimal a = new Dog();\na.Speak();\n```",
        options: [
          "Nothing — Dog's Speak runs.",
          "Animal's Speak runs because new only hides the method; it does not override it.",
          "The code does not compile.",
          "It prints both lines.",
        ],
        correctAnswer:
          "Animal's Speak runs because new only hides the method; it does not override it.",
        explanation:
          "To get polymorphism, the base method must be virtual and the child must use override. Otherwise new just hides it for that variable type.",
      },
      {
        kind: "interview",
        question:
          "How is polymorphism connected to dependency injection?",
        options: [
          "It is not.",
          "Dependency injection relies on polymorphism: consumers depend on an interface or base type, and the container provides any implementation that fits.",
          "Dependency injection replaces polymorphism.",
          "They both require static classes.",
        ],
        correctAnswer:
          "Dependency injection relies on polymorphism: consumers depend on an interface or base type, and the container provides any implementation that fits.",
        explanation:
          "DI works because of polymorphism. The consumer does not care which class is injected, only that it follows the contract.",
      },
    ],
  },

  abstraction: {
    whyItMatters:
      "Abstraction keeps your code simple. When you use a class, you only need to know what it does, not how it works inside. This is the idea behind interfaces like IEmailSender, IRepository, and IPaymentGateway — the rest of the code does not care about the details.",
    simpleExplanation:
      "Abstraction means showing only the important parts of an object and hiding the details. You decide what to expose and what to keep private. The user of the class sees a clean and simple set of operations.",
    deepExplanation:
      "Abstraction is about deciding what to expose. The user of a class should see a small and clear set of operations, while the internal details stay hidden. In C#, you can create abstraction using abstract classes, interfaces, and well-designed public methods. The goal is the same: make the type easy to use without showing how it works inside. This is what makes it possible to change the implementation later without breaking the rest of the project.",
    realWorldUsage:
      "IRepository<T> hides how data is read or saved. IEmailSender hides whether emails are sent through SMTP, SendGrid, or another service. IPaymentGateway hides which provider is used to process a payment. The service code calls Send or Save, and the real work happens behind the abstraction.",
    explainLikeBeginner:
      "When you drive a car, you press the gas pedal. You do not need to know how the engine works. The pedal is the abstraction. The engine is the hidden detail.",
    interviewAnswer:
      "Abstraction means hiding the internal details of a class and showing only what is needed to use it. In .NET, we use abstract classes and interfaces to define the shape of a type without giving the implementation. For example, IEmailSender describes that we can send an email, but the actual sending logic is hidden in the implementation.",
    commonMistakes: [
      "Exposing internal methods that should be private.",
      "Making abstractions too broad or too vague to be useful.",
      "Creating an interface for every class even when there is no real benefit.",
    ],
    bestPractices: [
      "Keep the public surface of a class small.",
      "Name the abstraction after the capability, not the implementation.",
      "Hide details that may change in the future.",
    ],
    summary: [
      "Abstraction shows what an object can do, not how it does it.",
      "It makes code easier to use and easier to change later.",
      "Use abstract classes and interfaces to design clean contracts.",
    ],
    codeExample: {
      title: "A Report abstract class with a shared Save method",
      code: `public abstract class Report
{
    public abstract void Generate();

    public void Save()
    {
        Console.WriteLine("Report saved");
    }
}

public class SalesReport : Report
{
    public override void Generate()
    {
        Console.WriteLine("Generating sales report");
    }
}

var report = new SalesReport();
report.Generate();
report.Save();`,
      output: "Generating sales report\nReport saved",
      walkthrough: [
        "Report is abstract, so you cannot create it directly.",
        "Generate is abstract, so each child class must define it.",
        "Save has a default implementation that all reports share.",
      ],
    },
    practice: {
      prompt:
        "Create an abstract class Shape with an abstract method Area(). Create two children, Circle and Rectangle, that each implement Area() with the correct formula.",
      expectedResult:
        "new Circle { Radius = 2 }.Area() returns about 12.56. new Rectangle { Width = 3, Height = 4 }.Area() returns 12.",
      hints: [
        "Use the keyword abstract on both the class and the method.",
        "Circle needs a Radius property. Rectangle needs Width and Height.",
        "Use Math.PI for the circle formula.",
      ],
      solution:
        "Define Shape with abstract double Area(). Define Circle : Shape with Radius and an override Area returning Math.PI * Radius * Radius. Define Rectangle : Shape with Width and Height and an override Area returning Width * Height.",
    },
    quiz: [
      {
        kind: "concept",
        question: "What does abstraction mean in object-oriented design?",
        options: [
          "Showing only the parts of a class that matter and hiding the rest.",
          "Making the class run faster.",
          "Putting all logic in one method.",
          "Removing all comments from code.",
        ],
        correctAnswer:
          "Showing only the parts of a class that matter and hiding the rest.",
        explanation:
          "Abstraction is about exposing a small, clean set of operations and hiding the internal details.",
      },
      {
        kind: "code-reading",
        question:
          "Can you write var report = new Report(); when Report is an abstract class?",
        options: [
          "Yes, always.",
          "No, you cannot create an instance of an abstract class directly.",
          "Yes, but only inside a using block.",
          "Only if Report has no methods.",
        ],
        correctAnswer:
          "No, you cannot create an instance of an abstract class directly.",
        explanation:
          "Abstract classes can only be instantiated through their concrete child classes.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is wrong with this design?\n```csharp\npublic interface IEmailSender\n{\n    void Send(string to, string body);\n    string ConnectToSmtpServer();\n}\n```",
        options: [
          "Nothing.",
          "ConnectToSmtpServer leaks an implementation detail into the abstraction. The interface should only describe what to do, not how.",
          "The interface should be abstract.",
          "Send needs a return type.",
        ],
        correctAnswer:
          "ConnectToSmtpServer leaks an implementation detail into the abstraction. The interface should only describe what to do, not how.",
        explanation:
          "The interface should describe sending an email, not the SMTP detail. Implementation details belong inside the concrete class, not in the contract.",
      },
      {
        kind: "interview",
        question:
          "Why is abstraction important in real .NET projects?",
        options: [
          "It makes code run faster.",
          "It makes code shorter.",
          "It hides details so the rest of the project does not depend on them, which makes the implementation easy to change later.",
          "It removes the need for testing.",
        ],
        correctAnswer:
          "It hides details so the rest of the project does not depend on them, which makes the implementation easy to change later.",
        explanation:
          "Good abstractions let you swap implementations — for example, a fake email sender in tests and a real one in production — without changing the rest of the code.",
      },
    ],
  },

  "interface-vs-abstract-class": {
    whyItMatters:
      "Choosing the right one keeps your design clean. Interfaces are great for describing a capability. Abstract classes are great when child classes share both behavior and common code. Picking the wrong one makes the code harder to extend later.",
    simpleExplanation:
      "An interface defines only what to do. An abstract class can also include shared logic. A class can implement many interfaces but can inherit from only one abstract class.",
    deepExplanation:
      "An interface is a pure contract. It only lists method signatures. A class can implement many interfaces, which gives a lot of flexibility. An abstract class is a partial implementation. It can have fields, constructors, and full methods, but a class can inherit from only one abstract class. A simple rule: use an interface when you want to describe a capability like 'can be sent' or 'can be saved'. Use an abstract class when child classes share a common base with real code.",
    realWorldUsage:
      "IRepository<T>, ILogger, and IEmailSender are interfaces used with dependency injection. A base EntityBase abstract class can hold shared properties like Id and CreatedAt. The ControllerBase class in ASP.NET Core is an abstract class that gives shared controller behavior such as helper methods for HTTP responses.",
    explainLikeBeginner:
      "An interface is like a job description: it lists what the person must do. An abstract class is like an unfinished house: the walls are already built, but some rooms are left for the new owner to design.",
    interviewAnswer:
      "An interface defines only the method signatures with no implementation. An abstract class can have both method signatures and real code. In C#, a class can implement many interfaces but inherit only one abstract class. We use interfaces for contracts and dependency injection, and abstract classes when child classes need to share common logic.",
    commonMistakes: [
      "Using an abstract class when an interface is enough.",
      "Putting too many unrelated methods into one interface.",
      "Forgetting that interfaces support multiple inheritance, but classes do not.",
    ],
    bestPractices: [
      "Default to an interface unless you need shared code.",
      "Keep interfaces small and focused on one capability.",
      "Use abstract classes when a family of types shares real implementation.",
    ],
    summary: [
      "Interface = pure contract. Many interfaces per class.",
      "Abstract class = partial implementation. Only one base class per class.",
      "Pick the one that matches the design — capability or shared base.",
    ],
    codeExample: {
      title: "IEmailSender interface vs NotificationBase abstract class",
      code: `public interface IEmailSender
{
    void Send(string to, string body);
}

public abstract class NotificationBase
{
    public abstract void Send(string to, string body);

    public void LogSend(string to)
    {
        Console.WriteLine($"Sent to {to}");
    }
}

public class SmtpEmailSender : IEmailSender
{
    public void Send(string to, string body)
    {
        Console.WriteLine($"SMTP: send to {to}");
    }
}`,
      output: "SMTP: send to user@example.com",
      walkthrough: [
        "IEmailSender is an interface — it only declares Send.",
        "NotificationBase is abstract — it declares Send and also provides a real LogSend method.",
        "SmtpEmailSender implements IEmailSender and provides the real Send code.",
      ],
    },
    practice: {
      prompt:
        "Create an interface IPaymentMethod with a method Pay(decimal amount). Create two classes, CardPayment and CashPayment, that each implement IPaymentMethod with their own Pay logic.",
      expectedResult:
        "IPaymentMethod payment = new CardPayment(); payment.Pay(100); prints something like 'Charged card with 100'.",
      hints: [
        "Use the syntax public class CardPayment : IPaymentMethod.",
        "Each class must implement Pay.",
        "Console.WriteLine works fine for the example.",
      ],
      solution:
        "Define IPaymentMethod with one method Pay(decimal amount). Each implementation provides its own version. The calling code can hold any IPaymentMethod and call Pay without knowing which one it is.",
    },
    quiz: [
      {
        kind: "concept",
        question: "What is the main difference between an interface and an abstract class?",
        options: [
          "There is no difference.",
          "An interface only declares methods. An abstract class can also have real code and shared state.",
          "An abstract class cannot have methods.",
          "An interface is faster.",
        ],
        correctAnswer:
          "An interface only declares methods. An abstract class can also have real code and shared state.",
        explanation:
          "Interfaces are pure contracts. Abstract classes can also provide shared implementation.",
      },
      {
        kind: "code-reading",
        question:
          "How many interfaces can a single class implement in C#?",
        options: ["Only one", "Up to two", "Any number", "None"],
        correctAnswer: "Any number",
        explanation:
          "C# allows a class to implement as many interfaces as it needs, but only one base class.",
      },
      {
        kind: "spot-the-bug",
        question:
          "Why is this often a bad idea?\n```csharp\npublic abstract class BaseService\n{\n}\npublic class OrderService : BaseService { }\npublic class EmailService : BaseService { }\n```",
        options: [
          "Nothing — it is fine.",
          "OrderService and EmailService have nothing in common. Using inheritance with an empty base only adds confusion.",
          "BaseService should be sealed.",
          "Both classes need constructors.",
        ],
        correctAnswer:
          "OrderService and EmailService have nothing in common. Using inheritance with an empty base only adds confusion.",
        explanation:
          "Abstract classes should add real shared behavior. An empty base class adds noise without value.",
      },
      {
        kind: "interview",
        question:
          "When would you pick an abstract class over an interface?",
        options: [
          "Always — abstract classes are stronger.",
          "When the family of types shares real implementation, fields, or constructor logic that you do not want to repeat.",
          "Never — interfaces are always better.",
          "When the class is sealed.",
        ],
        correctAnswer:
          "When the family of types shares real implementation, fields, or constructor logic that you do not want to repeat.",
        explanation:
          "An abstract class is the right choice when there is real shared code that all children should reuse.",
      },
    ],
  },

  constructor: {
    whyItMatters:
      "A constructor makes sure every object starts in a valid state. An Order should always have a customer and at least one item. A User should always have a name. Without constructors, you can create objects that are half-filled and unsafe to use.",
    simpleExplanation:
      "A constructor is a special method that runs when you create an object. It sets up the initial state of the object. The constructor has the same name as the class and no return type.",
    deepExplanation:
      "A constructor has the same name as the class and no return type. A class can have many constructors, each with a different list of parameters. This is called constructor overloading. If you do not define any constructor, C# gives you a default one with no parameters. As soon as you add your own constructor, the default one is gone unless you write it yourself. In .NET, constructors are also where dependency injection happens — services receive their dependencies as constructor parameters.",
    realWorldUsage:
      "An OrderService receives IOrderRepository and IEmailSender through its constructor. An entity like Invoice may use a constructor to make sure required fields are set. A configuration class loads values from settings at construction time. Almost every service class in a .NET application uses a constructor for dependency injection.",
    explainLikeBeginner:
      "A constructor is like setting up a new phone. Before you can use it, you turn it on, sign in, and set your preferences. The constructor does this setup automatically when the object is created.",
    interviewAnswer:
      "A constructor is a special method that runs when an object is created. It sets the initial values of the object. In .NET, constructors are also used for dependency injection, where services receive the dependencies they need as constructor parameters.",
    commonMistakes: [
      "Forgetting to initialize required fields, which leaves the object in a bad state.",
      "Putting heavy work like database calls inside a constructor.",
      "Adding too many parameters, which is usually a sign the class is doing too much.",
    ],
    bestPractices: [
      "Initialize all required fields in the constructor.",
      "Use constructor parameters for dependencies and required values.",
      "Keep constructors small and fast.",
    ],
    summary: [
      "A constructor prepares an object when it is created.",
      "It makes sure every object starts in a valid state.",
      "It is the main place for dependency injection in .NET.",
    ],
    codeExample: {
      title: "Order constructor that requires id and customer",
      code: `public class Order
{
    public int Id { get; }
    public string Customer { get; }
    public DateTime CreatedAt { get; }

    public Order(int id, string customer)
    {
        if (string.IsNullOrWhiteSpace(customer))
            throw new ArgumentException("Customer is required");

        Id = id;
        Customer = customer;
        CreatedAt = DateTime.UtcNow;
    }
}

var order = new Order(1, "Ali");
Console.WriteLine($"Order {order.Id} for {order.Customer}");`,
      output: "Order 1 for Ali",
      walkthrough: [
        "The constructor takes id and customer as parameters.",
        "It validates that customer is not empty.",
        "CreatedAt is set automatically to the current time.",
      ],
    },
    practice: {
      prompt:
        "Create a Student class with Name and Age. The constructor must accept both values and throw an exception if Name is empty or Age is less than 1.",
      expectedResult:
        "new Student(\"Ali\", 20) works. new Student(\"\", 20) throws ArgumentException. new Student(\"Ali\", 0) throws ArgumentException.",
      hints: [
        "Use string.IsNullOrWhiteSpace to check Name.",
        "Throw ArgumentException with a clear message.",
        "Set the values only after validation passes.",
      ],
      solution:
        "Inside the constructor, validate Name and Age first. If either is invalid, throw ArgumentException. If both are valid, assign them to the properties.",
    },
    quiz: [
      {
        kind: "concept",
        question: "What is a constructor?",
        options: [
          "A method that runs when the program starts.",
          "A special method that runs when an object is created and sets up its initial state.",
          "A method that closes the application.",
          "A type of interface.",
        ],
        correctAnswer:
          "A special method that runs when an object is created and sets up its initial state.",
        explanation:
          "The constructor runs once per new object, right when it is created.",
      },
      {
        kind: "code-reading",
        question:
          "What happens when you write new Order(1, \"\")?\n```csharp\npublic Order(int id, string customer)\n{\n    if (string.IsNullOrWhiteSpace(customer))\n        throw new ArgumentException(\"Customer is required\");\n    Id = id;\n    Customer = customer;\n}\n```",
        options: [
          "An Order is created with empty Customer.",
          "An ArgumentException is thrown.",
          "Nothing happens.",
          "Customer is set to null.",
        ],
        correctAnswer: "An ArgumentException is thrown.",
        explanation:
          "The constructor validates input and throws an exception if Customer is empty.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is the problem here?\n```csharp\npublic class OrderService\n{\n    public OrderService()\n    {\n        var orders = LoadAllOrdersFromDatabase();\n    }\n}\n```",
        options: [
          "Nothing — it is fine.",
          "Heavy work like a database call should not happen inside a constructor.",
          "OrderService needs a property.",
          "The class needs to be sealed.",
        ],
        correctAnswer:
          "Heavy work like a database call should not happen inside a constructor.",
        explanation:
          "Constructors should be fast and simple. Load data through a method, not during construction.",
      },
      {
        kind: "interview",
        question:
          "How are constructors used for dependency injection in .NET?",
        options: [
          "Dependency injection does not use constructors.",
          "Services declare their dependencies as constructor parameters. The DI container creates the object and passes the right instances automatically.",
          "DI happens only through properties.",
          "DI requires interfaces only.",
        ],
        correctAnswer:
          "Services declare their dependencies as constructor parameters. The DI container creates the object and passes the right instances automatically.",
        explanation:
          "Constructor injection is the standard pattern in .NET. The DI container builds the object graph and supplies dependencies through constructors.",
      },
    ],
  },

  "access-modifiers": {
    whyItMatters:
      "Access modifiers protect your code. They make sure other parts of the project only use what they are allowed to use. They are the simplest tool we have to keep encapsulation in place.",
    simpleExplanation:
      "Access modifiers control who can see and use a class member. The main ones are public, private, protected, and internal.",
    deepExplanation:
      "Each access modifier controls a different scope. Public is visible everywhere. Private is visible only inside the same class. Protected is visible inside the class and its child classes. Internal is visible inside the same project. There are also protected internal and private protected for more specific cases. Good code uses the smallest scope that still works — this is what makes encapsulation effective.",
    realWorldUsage:
      "Entity properties are usually public so EF Core can read and write them. Helper methods inside a service are private because only the service itself uses them. Base entity members like CreatedAt setters may be protected so only child classes can set them. Internal is used to share code between files in the same project without exposing it to other projects.",
    explainLikeBeginner:
      "Think of a house. The front door is public — anyone can knock. Your bedroom is private — only you can enter. The hallway is protected — anyone in the family can use it. The shared family living room is internal — only people inside the house.",
    interviewAnswer:
      "Access modifiers control the visibility of classes and members. In C#, the main ones are public, private, protected, and internal. We use them to protect data, control how parts of the application interact, and keep the design clean.",
    commonMistakes: [
      "Making every field public, which breaks encapsulation.",
      "Using internal when a member should be clearly public or private.",
      "Forgetting that protected gives access to all child classes, not only the parent.",
    ],
    bestPractices: [
      "Default to private unless a wider scope is needed.",
      "Use public only for the real API of the class.",
      "Use protected only when child classes truly need access.",
    ],
    summary: [
      "Public = visible everywhere.",
      "Private = visible only in the same class.",
      "Protected = visible in the class and its child classes.",
      "Internal = visible in the same project.",
    ],
    codeExample: {
      title: "Different access levels on one Product class",
      code: `public class Product
{
    public string Name { get; set; }
    private decimal _price;
    protected int StockLevel { get; set; }
    internal string InternalCode { get; set; }

    public decimal GetPrice() => _price;

    public void SetPrice(decimal price)
    {
        if (price < 0) throw new ArgumentException("Price must be positive");
        _price = price;
    }
}`,
      output: "Product created with controlled access to its data",
      walkthrough: [
        "Name is public, so any code can read or change it.",
        "_price is private, so only the Product class can change it directly.",
        "StockLevel is protected, so child classes can read or change it.",
        "InternalCode is internal, so only code in the same project can see it.",
      ],
    },
    practice: {
      prompt:
        "Create a User class with a public Name property, a private PasswordHash field, and a public method SetPassword(string plain) that stores a hashed version (you can just call plain.GetHashCode().ToString() for the example).",
      expectedResult:
        "Outside code can set Name and call SetPassword. PasswordHash is not visible from outside.",
      hints: [
        "Use private string _passwordHash.",
        "Add a public method SetPassword that updates _passwordHash.",
        "Do not expose _passwordHash as a public property.",
      ],
      solution:
        "Declare _passwordHash as private. Add a SetPassword method that takes the plain password, hashes it, and assigns the result to _passwordHash. Name is a normal public property.",
    },
    quiz: [
      {
        kind: "concept",
        question: "Which access modifier limits visibility to the same class only?",
        options: ["public", "internal", "protected", "private"],
        correctAnswer: "private",
        explanation:
          "Private members are only visible inside the class where they are declared.",
      },
      {
        kind: "code-reading",
        question:
          "Given:\n```csharp\npublic class Animal { protected int Age { get; set; } }\npublic class Dog : Animal {\n    public void Show() { Console.WriteLine(Age); }\n}\n```\nDoes this compile?",
        options: [
          "No — Age is private.",
          "Yes — Age is protected, so Dog can access it because Dog inherits from Animal.",
          "No — protected fields cannot be used.",
          "Yes, but it prints nothing.",
        ],
        correctAnswer:
          "Yes — Age is protected, so Dog can access it because Dog inherits from Animal.",
        explanation:
          "Protected members are visible in the class itself and in any class that inherits from it.",
      },
      {
        kind: "spot-the-bug",
        question:
          "Why is this design weak?\n```csharp\npublic class BankAccount\n{\n    public decimal Balance;\n}\n```",
        options: [
          "Nothing.",
          "Balance is a public field, so anyone can change it directly without any rule.",
          "BankAccount needs a constructor.",
          "It will not compile.",
        ],
        correctAnswer:
          "Balance is a public field, so anyone can change it directly without any rule.",
        explanation:
          "Public fields break encapsulation. Use a private field with a property that has controlled access, or expose changes only through methods like Deposit and Withdraw.",
      },
      {
        kind: "interview",
        question:
          "How would you explain access modifiers in an interview?",
        options: [
          "They are required by C# but optional in real projects.",
          "Access modifiers control who can see and use a class member. They are the main tool we use to protect data and keep encapsulation in place.",
          "They only affect performance.",
          "They replace the need for tests.",
        ],
        correctAnswer:
          "Access modifiers control who can see and use a class member. They are the main tool we use to protect data and keep encapsulation in place.",
        explanation:
          "Access modifiers are a small feature with a big impact on safety and design.",
      },
    ],
  },

  "simple-oop-coding-tasks": {
    whyItMatters:
      "Reading about OOP is not enough. You learn it by writing small classes and using them in tiny programs. Practice is what turns theory into a real skill.",
    simpleExplanation:
      "These are small exercises that help you practice the main OOP ideas — classes, encapsulation, inheritance, polymorphism, and abstraction — with real types like Student, Order, Product, and BankAccount.",
    deepExplanation:
      "Start with one class and one simple rule. Add a constructor that validates the input. Add a method that protects the state. Then build something slightly bigger, like a list of objects and a service that uses them. Each small task focuses on one idea. Over time, these small habits build into the design skills you use in real .NET projects every day.",
    realWorldUsage:
      "The same patterns from practice appear in real applications. A CartService works with CartItem objects and calculates totals. A PaymentService validates and processes payments. A UserService handles user registration and password updates. Small practice classes are simple versions of the same patterns you will see in production code.",
    explainLikeBeginner:
      "Learning OOP is like learning to cook. You read recipes, but you only get good by cooking small meals. Each practice task is a small meal that teaches you one technique.",
    interviewAnswer:
      "Practical OOP tasks turn theory into real code. For example, building a BankAccount class with Deposit and Withdraw methods shows encapsulation, validation, and clean object state. These are the same patterns used in real .NET services every day.",
    commonMistakes: [
      "Skipping practice and reading only theory.",
      "Building classes without validation or behavior.",
      "Trying to add too many features to one class instead of keeping it focused.",
    ],
    bestPractices: [
      "Pick one OOP idea per task — encapsulation, inheritance, or polymorphism.",
      "Use realistic names like Student, Order, or Invoice.",
      "Keep the class small and focused on one job.",
    ],
    summary: [
      "Small coding tasks turn OOP from theory into a skill.",
      "Each task should focus on one idea.",
      "Practice with classes like Student, Order, and BankAccount.",
    ],
    codeExample: {
      title: "A small Student class with grades and an average",
      code: `public class Student
{
    public string Name { get; set; }
    public List<int> Grades { get; } = new();

    public double Average()
    {
        if (Grades.Count == 0) return 0;
        return Grades.Average();
    }
}

var student = new Student { Name = "Ali" };
student.Grades.Add(80);
student.Grades.Add(90);
Console.WriteLine($"{student.Name} average: {student.Average()}");`,
      output: "Ali average: 85",
      walkthrough: [
        "Student has a name and a list of grades.",
        "Average returns the average grade, or zero if there are no grades.",
        "The object is created, two grades are added, and the average is printed.",
      ],
    },
    practice: {
      prompt:
        "Build a small Order class that has a list of OrderItem (Name and Price). Add a method Total() that returns the sum of all item prices. Then create an order with three items and print the total.",
      expectedResult:
        "An order with items priced 10, 20, and 30 should return 60 from Total().",
      hints: [
        "Create OrderItem with Name and Price.",
        "Use a private list inside Order and expose it as IReadOnlyList<OrderItem>.",
        "Add an AddItem method so callers cannot mutate the list directly.",
      ],
      solution:
        "Define OrderItem with Name and Price. Define Order with a private List<OrderItem>, an AddItem method, and a Total method that sums the prices. Use it to add three items and print the total.",
    },
    quiz: [
      {
        kind: "concept",
        question: "Why is small coding practice important when learning OOP?",
        options: [
          "It is not — reading is enough.",
          "It turns theory into a real skill by giving you hands-on experience with classes, methods, and validation.",
          "It only matters before interviews.",
          "It replaces the need for design.",
        ],
        correctAnswer:
          "It turns theory into a real skill by giving you hands-on experience with classes, methods, and validation.",
        explanation:
          "OOP is a skill, not just a topic. Small practice tasks build the habits you will use every day.",
      },
      {
        kind: "code-reading",
        question:
          "Given:\n```csharp\nvar account = new BankAccount();\naccount.Deposit(50);\naccount.Withdraw(20);\nConsole.WriteLine(account.Balance);\n```\nIf Deposit and Withdraw work correctly, what is printed?",
        options: ["30", "20", "70", "50"],
        correctAnswer: "30",
        explanation: "50 deposited minus 20 withdrawn equals 30.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is wrong here?\n```csharp\npublic class Order\n{\n    public List<OrderItem> Items;\n    public decimal Total => Items.Sum(i => i.Price);\n}\n```",
        options: [
          "Nothing.",
          "Items is public and not initialized, so any caller can replace it or get a NullReferenceException.",
          "Total should be a method.",
          "OrderItem must be sealed.",
        ],
        correctAnswer:
          "Items is public and not initialized, so any caller can replace it or get a NullReferenceException.",
        explanation:
          "Initialize the list and keep it private. Expose it only through controlled methods like AddItem.",
      },
      {
        kind: "interview",
        question:
          "How would you talk about small OOP practice tasks in an interview?",
        options: [
          "They are only for students.",
          "They help me practice each OOP idea in isolation — encapsulation, inheritance, polymorphism — and the same patterns appear in real .NET services every day.",
          "They have no value in real work.",
          "They are required for every interview.",
        ],
        correctAnswer:
          "They help me practice each OOP idea in isolation — encapsulation, inheritance, polymorphism — and the same patterns appear in real .NET services every day.",
        explanation:
          "Small practice tasks build the habits used in production code, which is exactly what interviewers want to hear.",
      },
    ],
  },

  "oop-in-real-backend-projects": {
    whyItMatters:
      "When you join a real project, you will read code written by other .NET developers. Knowing how OOP is used in real applications helps you read the code, understand it, and contribute safely without breaking things.",
    simpleExplanation:
      "Real .NET projects are built using many classes and interfaces that work together. Entities describe data. Services contain business logic. Repositories handle the database. Controllers handle API requests. DTOs carry data between layers. Each part is a class with a clear job.",
    deepExplanation:
      "A typical .NET application is organized into layers. Entities describe the data, like User, Order, and Product. Repositories handle database access through interfaces like IOrderRepository. Services contain business logic. Controllers handle API requests. DTOs carry data between layers. Each layer is built with classes and interfaces. Dependency injection connects them. Encapsulation keeps data safe. Polymorphism lets you swap implementations. Abstraction lets you change one part without breaking the rest. This is why OOP is the foundation of every modern .NET application.",
    realWorldUsage:
      "An ERP system has services for orders, invoices, payments, and reports, all built as classes. An e-commerce API has controllers for products, carts, and checkout, each using injected services. A banking application uses entities like Account and Transaction with strict encapsulation around balances. The structure is similar across most .NET projects.",
    explainLikeBeginner:
      "Think of a company. Each person has a role: the cashier, the manager, the accountant. They each have their own job and tools, but they work together to run the business. A .NET application is the same — each class has its own job, and they work together to handle real requests.",
    interviewAnswer:
      "In real .NET applications, OOP is used to organize the code into entities, services, repositories, controllers, and DTOs. Each part is a class or interface with a clear job. Dependency injection connects them. This design makes the project easy to read, test, and extend over time.",
    commonMistakes: [
      "Putting business logic in the controller instead of a service.",
      "Skipping interfaces and tying services directly to a specific database implementation.",
      "Building classes with too many responsibilities.",
    ],
    bestPractices: [
      "Keep controllers thin — they should only handle HTTP and delegate to services.",
      "Use interfaces for services and repositories so they can be replaced or mocked.",
      "Separate the entity (database shape) from the DTO (API shape).",
    ],
    summary: [
      "OOP is the way real .NET applications are organized.",
      "Entities, services, repositories, controllers, and DTOs each have a clear role.",
      "Dependency injection connects the parts cleanly.",
    ],
    codeExample: {
      title: "A clean OrderService that depends on IOrderRepository",
      code: `public interface IOrderRepository
{
    Task<Order> GetByIdAsync(int id);
    Task AddAsync(Order order);
}

public class OrderService
{
    private readonly IOrderRepository _orders;

    public OrderService(IOrderRepository orders)
    {
        _orders = orders;
    }

    public async Task<Order> PlaceOrderAsync(Order order)
    {
        await _orders.AddAsync(order);
        return order;
    }
}`,
      output: "PlaceOrderAsync saves the order through the repository",
      walkthrough: [
        "IOrderRepository is an interface that hides the data access details.",
        "OrderService receives the repository through its constructor.",
        "The service uses the repository without knowing how it works inside.",
      ],
    },
    practice: {
      prompt:
        "Design a small CustomerService that depends on an ICustomerRepository interface. The service has a method GetCustomerNameAsync(int id) that returns the customer's name, or 'Unknown' if the customer is not found.",
      expectedResult:
        "When the repository returns a customer with Name = 'Ali', the service returns 'Ali'. When the repository returns null, the service returns 'Unknown'.",
      hints: [
        "Define ICustomerRepository with Task<Customer?> GetByIdAsync(int id).",
        "Inject the repository through the CustomerService constructor.",
        "Inside the method, await the repository call and check for null.",
      ],
      solution:
        "Define ICustomerRepository and Customer. CustomerService receives ICustomerRepository through its constructor and uses it inside GetCustomerNameAsync. If the customer is null, return 'Unknown'. Otherwise return customer.Name.",
    },
    quiz: [
      {
        kind: "concept",
        question: "Which OOP idea makes it possible to swap a real repository with a fake one in a test?",
        options: [
          "Inheritance",
          "Encapsulation",
          "Polymorphism through interfaces and dependency injection",
          "Static methods",
        ],
        correctAnswer:
          "Polymorphism through interfaces and dependency injection",
        explanation:
          "The service depends on the interface, so any implementation that matches can be plugged in — including a fake one in a test.",
      },
      {
        kind: "code-reading",
        question:
          "In this code, what is the role of OrderService?\n```csharp\npublic class OrderService\n{\n    private readonly IOrderRepository _orders;\n    public OrderService(IOrderRepository orders) => _orders = orders;\n    public Task<Order> PlaceOrderAsync(Order order) => _orders.AddAsync(order);\n}\n```",
        options: [
          "It handles HTTP requests directly.",
          "It contains business logic and uses the repository for data access.",
          "It is a DTO.",
          "It is a database table.",
        ],
        correctAnswer:
          "It contains business logic and uses the repository for data access.",
        explanation:
          "Services hold business logic. They depend on repositories or other services through interfaces.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is wrong with this controller?\n```csharp\n[HttpPost]\npublic async Task<IActionResult> CreateOrder(Order order)\n{\n    using var context = new AppDbContext();\n    context.Orders.Add(order);\n    await context.SaveChangesAsync();\n    return Ok(order);\n}\n```",
        options: [
          "Nothing — it is clean.",
          "The controller knows about the database directly. Data access should be hidden behind a service or repository, and the DbContext should be injected, not created manually.",
          "The method should be synchronous.",
          "Order should be a DTO.",
        ],
        correctAnswer:
          "The controller knows about the database directly. Data access should be hidden behind a service or repository, and the DbContext should be injected, not created manually.",
        explanation:
          "Controllers should be thin. They handle HTTP and call services. Mixing data access into the controller makes it hard to test and reuse.",
      },
      {
        kind: "interview",
        question:
          "How would you describe a clean .NET project structure using OOP?",
        options: [
          "Everything in one big class.",
          "Entities for data, services for business logic, repositories for data access, controllers for HTTP, and DTOs for the API contract — all connected through interfaces and dependency injection.",
          "Static classes everywhere.",
          "Inheritance for every relationship.",
        ],
        correctAnswer:
          "Entities for data, services for business logic, repositories for data access, controllers for HTTP, and DTOs for the API contract — all connected through interfaces and dependency injection.",
        explanation:
          "This is the standard layered design used in most modern .NET applications.",
      },
    ],
  },
} as ModuleContent;
