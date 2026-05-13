import type { ModuleContent } from "./types";

export const databaseContent: ModuleContent = {
  entity: {
    whyItMatters:
      "Entities are how your .NET code talks to the database. Every Customer, Order, or Invoice you save and load goes through an entity class. Getting them right is what makes the rest of the data layer simple and safe.",
    simpleExplanation:
      "An entity is a C# class that represents a row in a database table. Each property maps to a column. EF Core uses entities to read and write data.",
    deepExplanation:
      "An entity has properties for each column and usually an Id property for the primary key. EF Core tracks entities while they are loaded, so when you change a property and call SaveChanges, the framework generates the right UPDATE statement. Entities can also have navigation properties — references to other entities — that map to foreign key relationships.",
    realWorldUsage:
      "A Customer entity has Id, Name, Email, and a list of Orders. An Order entity has Id, CustomerId, CreatedAt, and a list of OrderLines. Each entity matches one table. The service layer loads, modifies, and saves entities through EF Core.",
    explainLikeBeginner:
      "An entity is like a printed form. Each form has labeled fields (Name, Date, Total). Each form fills one row in a binder (the table). The class describes what the form looks like.",
    interviewAnswer:
      "An entity is a C# class that maps to a row in a database table. Properties map to columns. EF Core uses entities to load data, track changes, and save updates. Entities are the foundation of the data layer in a .NET application.",
    commonMistakes: [
      "Mixing API attributes and database attributes on the same class.",
      "Forgetting to include navigation properties for relationships.",
      "Exposing the entity directly through the API instead of using a DTO.",
    ],
    bestPractices: [
      "Keep entities focused on the database.",
      "Use clear names that match the real world (Customer, Order, Invoice).",
      "Use navigation properties to express relationships.",
    ],
    summary: [
      "An entity = a row in a table, expressed as a C# class.",
      "EF Core tracks entities and saves changes automatically.",
      "Entities live in the data layer, not in the API contract.",
    ],
    codeExample: {
      title: "A simple Customer entity with one related list",
      code: `public class Customer
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public List<Order> Orders { get; set; } = new();
}

public class Order
{
    public int Id { get; set; }
    public int CustomerId { get; set; }
    public Customer? Customer { get; set; }
    public decimal Total { get; set; }
}`,
      output: "Two entities — one for customers and one for orders, connected by CustomerId.",
      walkthrough: [
        "Customer maps to the Customers table.",
        "Order maps to the Orders table and has a CustomerId foreign key.",
        "Navigation properties (Orders and Customer) describe the relationship.",
      ],
    },
    practice: {
      prompt:
        "Define an Invoice entity with Id, Number (string), CreatedAt (DateTime), Total (decimal), and a CustomerId foreign key. Add a navigation property Customer back to the Customer entity.",
      expectedResult:
        "Invoice has five scalar properties and one navigation property to Customer.",
      hints: [
        "Use int Id and int CustomerId.",
        "Add a Customer? property as the navigation.",
        "Use decimal for monetary values.",
      ],
      solution:
        "Define Invoice with Id, Number, CreatedAt, Total, CustomerId, and a nullable Customer? property. EF Core uses CustomerId as the foreign key and Customer as the navigation.",
    },
    quiz: [
      {
        kind: "concept",
        question: "What is an entity in .NET?",
        options: [
          "A controller.",
          "A C# class that maps to a row in a database table.",
          "A type of HTTP response.",
          "A configuration file.",
        ],
        correctAnswer:
          "A C# class that maps to a row in a database table.",
        explanation:
          "Entities are the foundation of the data layer in .NET applications using EF Core.",
      },
      {
        kind: "code-reading",
        question:
          "What does this property do?\n```csharp\npublic List<Order> Orders { get; set; } = new();\n```",
        options: [
          "It is just a list.",
          "It is a navigation property that lets EF Core load the orders related to this entity.",
          "It is a database column.",
          "It is a controller method.",
        ],
        correctAnswer:
          "It is a navigation property that lets EF Core load the orders related to this entity.",
        explanation:
          "Navigation properties describe relationships between entities.",
      },
      {
        kind: "spot-the-bug",
        question:
          "Why is this design weak?\n```csharp\npublic class Order\n{\n    public int Id { get; set; }\n    [JsonPropertyName(\"order_total\")]\n    public decimal Total { get; set; }\n}\n```",
        options: [
          "Nothing.",
          "It mixes API serialization attributes into the entity. Entities should focus on the database; API shape belongs to DTOs.",
          "It needs a constructor.",
          "JsonPropertyName does not exist.",
        ],
        correctAnswer:
          "It mixes API serialization attributes into the entity. Entities should focus on the database; API shape belongs to DTOs.",
        explanation:
          "Keep entities clean. Use DTOs for the API.",
      },
      {
        kind: "interview",
        question:
          "How would you describe entities in a real .NET application?",
        options: [
          "They are the same as DTOs.",
          "They are C# classes that map to database tables. EF Core uses them to read, track changes, and save updates. Entities live in the data layer and stay separate from the API.",
          "They are configuration objects.",
          "They are middleware.",
        ],
        correctAnswer:
          "They are C# classes that map to database tables. EF Core uses them to read, track changes, and save updates. Entities live in the data layer and stay separate from the API.",
        explanation:
          "This is the standard role of entities in modern .NET applications.",
      },
    ],
  },

  table: {
    whyItMatters:
      "Tables are the basic unit of storage in a relational database. Every entity maps to a table. Knowing how tables work — rows, columns, types, constraints — is the foundation of any data work in .NET.",
    simpleExplanation:
      "A table is a collection of rows and columns in a database. Each row is one record. Each column has a name and a data type. Tables are linked together by keys.",
    deepExplanation:
      "A table has a schema that defines its columns: their names, types, nullability, and constraints. Rows are added with INSERT, read with SELECT, changed with UPDATE, and removed with DELETE. Real tables also have indexes for fast lookups and constraints like UNIQUE or NOT NULL to enforce rules. EF Core creates and updates tables based on entity classes through migrations.",
    realWorldUsage:
      "A Customers table stores customer records. An Orders table stores order records, linked to Customers through CustomerId. A Products table stores product records. Every .NET application that uses a relational database has tables like these.",
    explainLikeBeginner:
      "A table is like a spreadsheet. Each row is one item. Each column has a header. The header says what the value means. Different tables track different things — customers, orders, products.",
    interviewAnswer:
      "A table is the basic storage unit in a relational database. It has columns with types and rows with data. Each entity in .NET maps to one table. Tables are connected by keys, and constraints like NOT NULL and UNIQUE enforce data quality.",
    commonMistakes: [
      "Storing everything in one big table.",
      "Skipping NOT NULL and UNIQUE constraints.",
      "Using vague column names like Field1 instead of clear ones like CustomerName.",
    ],
    bestPractices: [
      "One entity per table.",
      "Use clear, descriptive column names.",
      "Apply constraints to enforce data rules at the database level.",
    ],
    summary: [
      "A table = rows + columns.",
      "Each row is a record. Each column has a name and a type.",
      "Tables are linked by keys.",
    ],
    codeExample: {
      title: "A Customers table created from an EF Core entity",
      code: `public class Customer
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}

// Equivalent SQL
// CREATE TABLE Customers (
//     Id INT PRIMARY KEY IDENTITY,
//     Name NVARCHAR(MAX) NOT NULL,
//     Email NVARCHAR(MAX) NOT NULL
// );`,
      output: "A Customers table with three columns and a primary key on Id.",
      walkthrough: [
        "EF Core picks the table name from the DbSet property.",
        "Each property becomes a column.",
        "Id is the primary key by convention.",
      ],
    },
    practice: {
      prompt:
        "Design a Products table with Id (primary key), Name, Price, and CategoryId. Write the SQL CREATE TABLE statement, then express it as a C# entity that EF Core can use.",
      expectedResult:
        "A Products entity with four properties and an equivalent SQL CREATE TABLE statement that includes the primary key and a foreign key column.",
      hints: [
        "Use INT for Id and CategoryId.",
        "Use DECIMAL(18,2) for Price.",
        "Use NVARCHAR(MAX) for Name.",
      ],
      solution:
        "Create a Product class with Id, Name, Price, CategoryId. The CREATE TABLE statement defines the columns and the primary key on Id, plus a foreign key on CategoryId.",
    },
    quiz: [
      {
        kind: "concept",
        question: "What is a table in a relational database?",
        options: [
          "A class in C#.",
          "A collection of rows and columns that stores records of one kind, like Customers or Orders.",
          "A file on disk.",
          "An HTTP endpoint.",
        ],
        correctAnswer:
          "A collection of rows and columns that stores records of one kind, like Customers or Orders.",
        explanation:
          "Tables are the basic unit of storage in relational databases.",
      },
      {
        kind: "code-reading",
        question:
          "What does this SQL do?\n`CREATE TABLE Customers (Id INT PRIMARY KEY, Name NVARCHAR(100));`",
        options: [
          "Deletes a table.",
          "Creates a Customers table with two columns and Id as the primary key.",
          "Selects all rows.",
          "Updates the Name column.",
        ],
        correctAnswer:
          "Creates a Customers table with two columns and Id as the primary key.",
        explanation:
          "CREATE TABLE defines the structure of a new table.",
      },
      {
        kind: "spot-the-bug",
        question:
          "Why is this design weak?\n`CREATE TABLE Data (Field1 NVARCHAR, Field2 NVARCHAR, Field3 NVARCHAR);`",
        options: [
          "Nothing.",
          "Column names are vague and tell you nothing about the data. Use clear names like CustomerName, Email, and PhoneNumber.",
          "It needs a key.",
          "NVARCHAR is not allowed.",
        ],
        correctAnswer:
          "Column names are vague and tell you nothing about the data. Use clear names like CustomerName, Email, and PhoneNumber.",
        explanation:
          "Clear column names make queries readable and reduce bugs.",
      },
      {
        kind: "interview",
        question:
          "How are entities and tables connected in EF Core?",
        options: [
          "They are not.",
          "EF Core maps each entity class to a table. Properties become columns. Conventions handle most of the mapping; you can override them with attributes or Fluent API.",
          "Only manually.",
          "Through middleware.",
        ],
        correctAnswer:
          "EF Core maps each entity class to a table. Properties become columns. Conventions handle most of the mapping; you can override them with attributes or Fluent API.",
        explanation:
          "Entity-to-table mapping is the core of how EF Core works.",
      },
    ],
  },

  "primary-key": {
    whyItMatters:
      "Primary keys are how the database uniquely identifies a row. Without them, you cannot reliably update, delete, or join data. Every well-designed table has a primary key.",
    simpleExplanation:
      "A primary key is a column (or a set of columns) whose value uniquely identifies each row in a table. The most common pattern in .NET is an Id column with an auto-generated integer.",
    deepExplanation:
      "A primary key has two rules: it cannot be null, and it must be unique. EF Core uses the property named Id (or {ClassName}Id) as the primary key by convention. Most databases generate the value automatically through IDENTITY (SQL Server), SERIAL (PostgreSQL), or AUTO_INCREMENT (MySQL). You can also use a Guid as a primary key when you need globally unique values.",
    realWorldUsage:
      "Customers.Id is the primary key. Orders.Id is the primary key. Products.Id is the primary key. Every entity in a typical .NET application has an Id primary key that EF Core uses to track and update the row.",
    explainLikeBeginner:
      "A primary key is like a customer number on a receipt. Every customer gets a unique number. The shop uses that number to find the customer's records quickly.",
    interviewAnswer:
      "A primary key uniquely identifies each row in a table. It must be unique and not null. In .NET, EF Core uses an Id property by convention, usually with an auto-generated integer or a Guid.",
    commonMistakes: [
      "Using a business value like Email as the primary key — these can change.",
      "Forgetting to set the primary key, which leaves the table without a reliable identifier.",
      "Mixing primary key types across the database without a clear reason.",
    ],
    bestPractices: [
      "Use Id (int or Guid) as the primary key.",
      "Let the database generate the value automatically.",
      "Keep the primary key separate from business data.",
    ],
    summary: [
      "A primary key uniquely identifies each row.",
      "It must be unique and not null.",
      "EF Core uses Id by convention.",
    ],
    codeExample: {
      title: "Primary key on a Customer entity",
      code: `public class Customer
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}

// Equivalent SQL
// CREATE TABLE Customers (
//     Id INT IDENTITY PRIMARY KEY,
//     Name NVARCHAR(100) NOT NULL
// );`,
      output: "Customers table with an auto-generated Id as the primary key.",
      walkthrough: [
        "Id is the primary key by convention in EF Core.",
        "IDENTITY tells SQL Server to generate the value automatically.",
        "The application never sets Id manually when creating a new customer.",
      ],
    },
    practice: {
      prompt:
        "Define a Product entity with a primary key. Then write the equivalent SQL CREATE TABLE statement and explain why an Id column is better than using Name as the primary key.",
      expectedResult:
        "A Product entity with int Id, a CREATE TABLE statement that uses Id as the primary key with IDENTITY, and a clear note that Name can change but the primary key should not.",
      hints: [
        "Use int Id and a string Name property.",
        "In SQL, use IDENTITY PRIMARY KEY for Id.",
        "Explain that business values like Name can change and so should not be the key.",
      ],
      solution:
        "Define Product with int Id and string Name. Write CREATE TABLE Products (Id INT IDENTITY PRIMARY KEY, Name NVARCHAR(200) NOT NULL). Add a note: business values change; primary keys should not.",
    },
    quiz: [
      {
        kind: "concept",
        question: "What is a primary key?",
        options: [
          "Any field in a table.",
          "A column whose value uniquely identifies each row and cannot be null.",
          "A foreign key.",
          "A nullable column.",
        ],
        correctAnswer:
          "A column whose value uniquely identifies each row and cannot be null.",
        explanation:
          "Primary keys must be unique and not null.",
      },
      {
        kind: "code-reading",
        question:
          "In this entity, which property is the primary key?\n```csharp\npublic class Order { public int Id { get; set; } public DateTime CreatedAt { get; set; } }\n```",
        options: [
          "CreatedAt",
          "Id",
          "Both",
          "Neither",
        ],
        correctAnswer: "Id",
        explanation:
          "EF Core uses Id as the primary key by convention.",
      },
      {
        kind: "spot-the-bug",
        question:
          "Why is Email a bad primary key for Customers?",
        options: [
          "Email is too short.",
          "Email can change when the customer updates it, which means every related table's foreign keys would need to update too.",
          "Email cannot be a string.",
          "Primary keys must be numbers.",
        ],
        correctAnswer:
          "Email can change when the customer updates it, which means every related table's foreign keys would need to update too.",
        explanation:
          "Use stable, non-business values like an auto-generated Id.",
      },
      {
        kind: "interview",
        question:
          "When should you use a Guid as a primary key instead of int?",
        options: [
          "Always.",
          "When the value needs to be globally unique across systems, generated by the client, or hard to guess for security reasons. int is simpler for single-database applications.",
          "Never.",
          "Only for tests.",
        ],
        correctAnswer:
          "When the value needs to be globally unique across systems, generated by the client, or hard to guess for security reasons. int is simpler for single-database applications.",
        explanation:
          "Pick the type that fits the use case, not the popular choice.",
      },
    ],
  },

  "foreign-key": {
    whyItMatters:
      "Foreign keys are how tables connect to each other. They keep the data consistent — you cannot have an order pointing to a customer that does not exist. Foreign keys are at the heart of every relational design.",
    simpleExplanation:
      "A foreign key is a column in one table that points to the primary key of another table. It expresses a relationship, like 'this order belongs to this customer'.",
    deepExplanation:
      "If you have a Customer table and an Order table, the Order table has a CustomerId column. CustomerId is a foreign key pointing to Customers.Id. The database enforces this — you cannot insert an order with a CustomerId that does not exist. EF Core uses navigation properties on the entity to express the relationship. When you load an Order, you can include the related Customer with .Include(o => o.Customer).",
    realWorldUsage:
      "Orders.CustomerId points to Customers.Id. OrderLines.OrderId points to Orders.Id. Invoices.CustomerId points to Customers.Id. Almost every real .NET database is full of foreign keys that express how the entities connect.",
    explainLikeBeginner:
      "A foreign key is like writing your customer number on a receipt. The receipt belongs to your customer record. The number is the link between the receipt and the customer.",
    interviewAnswer:
      "A foreign key is a column that references the primary key of another table to express a relationship. The database enforces referential integrity — you cannot insert a row pointing to a missing parent. EF Core uses navigation properties and foreign key columns to express relationships in C#.",
    commonMistakes: [
      "Forgetting to declare the relationship in EF Core, so the foreign key is not created.",
      "Allowing the foreign key to be nullable when the relationship is required.",
      "Skipping cascade behavior, which can cause unexpected delete failures.",
    ],
    bestPractices: [
      "Match the type of the foreign key to the primary key it references.",
      "Use clear naming like CustomerId for Customer references.",
      "Decide cascade delete behavior explicitly.",
    ],
    summary: [
      "Foreign key = a column that references another table's primary key.",
      "It expresses relationships and enforces consistency.",
      "EF Core uses navigation properties to model relationships in C#.",
    ],
    codeExample: {
      title: "An Order with a CustomerId foreign key",
      code: `public class Customer
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class Order
{
    public int Id { get; set; }
    public int CustomerId { get; set; }
    public Customer? Customer { get; set; }
    public decimal Total { get; set; }
}

// Equivalent SQL
// CREATE TABLE Orders (
//     Id INT PRIMARY KEY IDENTITY,
//     CustomerId INT NOT NULL,
//     Total DECIMAL(18, 2),
//     FOREIGN KEY (CustomerId) REFERENCES Customers(Id)
// );`,
      output: "Orders table with a foreign key on CustomerId pointing to Customers.Id.",
      walkthrough: [
        "Order has a CustomerId column.",
        "Customer is the navigation property that EF Core uses to load the parent.",
        "The database refuses an order with a CustomerId that does not exist.",
      ],
    },
    practice: {
      prompt:
        "Define an Invoice entity with a foreign key CustomerId pointing to Customer. Add a navigation property and write the SQL FOREIGN KEY constraint.",
      expectedResult:
        "Invoice has Id, CustomerId, Customer?, and Total. The SQL includes FOREIGN KEY (CustomerId) REFERENCES Customers(Id).",
      hints: [
        "Use int CustomerId in Invoice.",
        "Add public Customer? Customer { get; set; } as the navigation.",
        "In SQL, add FOREIGN KEY (CustomerId) REFERENCES Customers(Id).",
      ],
      solution:
        "Define Invoice with CustomerId, the navigation property, and the foreign key. EF Core builds the constraint when you run migrations.",
    },
    quiz: [
      {
        kind: "concept",
        question: "What is a foreign key?",
        options: [
          "A primary key from another database.",
          "A column that references the primary key of another table to express a relationship.",
          "A nullable column.",
          "An index.",
        ],
        correctAnswer:
          "A column that references the primary key of another table to express a relationship.",
        explanation:
          "Foreign keys connect tables and enforce consistency.",
      },
      {
        kind: "code-reading",
        question:
          "What does this property indicate?\n```csharp\npublic int CustomerId { get; set; }\npublic Customer? Customer { get; set; }\n```",
        options: [
          "Two separate concepts.",
          "CustomerId is the foreign key column. Customer is the navigation property EF Core uses to load the related customer.",
          "Both are primary keys.",
          "Both are ignored by EF Core.",
        ],
        correctAnswer:
          "CustomerId is the foreign key column. Customer is the navigation property EF Core uses to load the related customer.",
        explanation:
          "EF Core uses both to express a relationship cleanly.",
      },
      {
        kind: "spot-the-bug",
        question:
          "Why does this INSERT fail?\n`INSERT INTO Orders (CustomerId, Total) VALUES (999, 100);` when there is no customer with Id 999.",
        options: [
          "Nothing fails.",
          "The foreign key constraint stops the insert because there is no parent customer with Id 999.",
          "Total is missing.",
          "INSERT is the wrong command.",
        ],
        correctAnswer:
          "The foreign key constraint stops the insert because there is no parent customer with Id 999.",
        explanation:
          "Foreign keys protect the database from orphan rows.",
      },
      {
        kind: "interview",
        question:
          "How does EF Core model relationships between entities?",
        options: [
          "Through static methods.",
          "Through navigation properties (Customer, Orders) and foreign key columns (CustomerId). Conventions or Fluent API connect them.",
          "Through HTTP requests.",
          "Through controllers.",
        ],
        correctAnswer:
          "Through navigation properties (Customer, Orders) and foreign key columns (CustomerId). Conventions or Fluent API connect them.",
        explanation:
          "This is the standard EF Core relationship pattern.",
      },
    ],
  },

  "simple-sql-queries": {
    whyItMatters:
      "Even when you use EF Core, you still need to read SQL during debugging, performance work, and database reviews. Knowing basic SQL gives you confidence in every data-related task.",
    simpleExplanation:
      "SQL is the language used to talk to a relational database. The most important commands are SELECT (read), INSERT (create), UPDATE (change), and DELETE (remove).",
    deepExplanation:
      "A SELECT statement reads rows from a table. You choose columns, filter with WHERE, sort with ORDER BY, and limit with TOP or LIMIT. INSERT adds new rows. UPDATE changes existing rows. DELETE removes rows. SQL also supports JOINs to combine data from multiple tables. EF Core converts your LINQ queries into SQL, so understanding the result helps you write efficient queries.",
    realWorldUsage:
      "A team writes SELECT queries when reviewing production data. A developer runs an INSERT to seed a new lookup table. A migration uses UPDATE to fix data. A SELECT with a JOIN reports orders per customer. These are everyday tasks in .NET projects.",
    explainLikeBeginner:
      "SQL is like asking the librarian for books. SELECT is 'show me'. INSERT is 'add this book'. UPDATE is 'change the cover'. DELETE is 'remove this book'.",
    interviewAnswer:
      "SQL is the standard language for working with relational databases. The most common commands are SELECT, INSERT, UPDATE, and DELETE. .NET developers use SQL directly for debugging and reports, and indirectly through EF Core for application queries.",
    commonMistakes: [
      "Running UPDATE or DELETE without a WHERE clause.",
      "SELECT * everywhere, even when only a few columns are needed.",
      "Not testing queries against a representative dataset.",
    ],
    bestPractices: [
      "Always include a WHERE clause for UPDATE and DELETE.",
      "Select only the columns you need.",
      "Format queries clearly with line breaks for each clause.",
    ],
    summary: [
      "SQL is the language for relational databases.",
      "The core commands are SELECT, INSERT, UPDATE, DELETE.",
      "Even with EF Core, reading SQL is a daily .NET skill.",
    ],
    codeExample: {
      title: "Four basic SQL commands on a Customers table",
      code: `-- Read
SELECT Id, Name, Email FROM Customers WHERE IsActive = 1 ORDER BY Name;

-- Create
INSERT INTO Customers (Name, Email, IsActive)
VALUES ('Ali', 'ali@example.com', 1);

-- Update
UPDATE Customers SET Email = 'new@example.com' WHERE Id = 5;

-- Delete
DELETE FROM Customers WHERE Id = 5;`,
      output: "Each command does what the keyword says.",
      walkthrough: [
        "SELECT reads rows filtered by WHERE.",
        "INSERT adds one new row with the values provided.",
        "UPDATE and DELETE always need a WHERE clause to avoid changing everything.",
      ],
    },
    practice: {
      prompt:
        "Write four SQL statements on a Products table: read the names and prices of products that cost more than 100, insert a new product, update one product's price, and delete a product by id.",
      expectedResult:
        "Four valid SQL statements with proper WHERE clauses where needed.",
      hints: [
        "Use SELECT Name, Price FROM Products WHERE Price > 100.",
        "INSERT INTO Products (Name, Price) VALUES (...).",
        "Include WHERE Id = X on UPDATE and DELETE.",
      ],
      solution:
        "Write the four statements with the right structure. Always include a WHERE clause on UPDATE and DELETE to avoid affecting all rows.",
    },
    quiz: [
      {
        kind: "concept",
        question: "Which command reads data from a table?",
        options: ["INSERT", "UPDATE", "SELECT", "DELETE"],
        correctAnswer: "SELECT",
        explanation:
          "SELECT is the SQL command for reading rows.",
      },
      {
        kind: "code-reading",
        question:
          "What does this query return?\n`SELECT Name FROM Customers WHERE IsActive = 1;`",
        options: [
          "All customers.",
          "The Name column for all customers where IsActive is 1.",
          "Nothing — IsActive is a boolean.",
          "An error.",
        ],
        correctAnswer:
          "The Name column for all customers where IsActive is 1.",
        explanation:
          "SELECT reads the chosen columns from the rows that match WHERE.",
      },
      {
        kind: "spot-the-bug",
        question:
          "Why is this dangerous?\n`UPDATE Customers SET Email = 'x@example.com';`",
        options: [
          "Nothing.",
          "There is no WHERE clause, so every customer in the table gets the same email.",
          "UPDATE cannot be used.",
          "Email is too short.",
        ],
        correctAnswer:
          "There is no WHERE clause, so every customer in the table gets the same email.",
        explanation:
          "Always include a WHERE clause on UPDATE and DELETE.",
      },
      {
        kind: "interview",
        question:
          "Why should .NET developers know SQL even when they use EF Core?",
        options: [
          "They should not.",
          "Because EF Core translates LINQ into SQL, debugging performance issues requires reading the generated SQL. Many production tasks also need direct SQL.",
          "Because EF Core is being removed.",
          "Because SQL is faster than LINQ.",
        ],
        correctAnswer:
          "Because EF Core translates LINQ into SQL, debugging performance issues requires reading the generated SQL. Many production tasks also need direct SQL.",
        explanation:
          "SQL is not optional in real .NET work, even with an ORM.",
      },
    ],
  },

  insert: {
    whyItMatters:
      "INSERT is how new data enters the database. Every signup, every order, every audit log starts with an INSERT. Knowing how it works helps you understand what your application is really doing.",
    simpleExplanation:
      "INSERT adds new rows to a table. You specify the table, the columns, and the values to insert.",
    deepExplanation:
      "The basic form is INSERT INTO Table (Column1, Column2) VALUES (Value1, Value2). You can also insert multiple rows in one statement, or insert from the result of a SELECT. EF Core calls INSERT when you add an entity and call SaveChanges. The database fills in identity columns automatically, and constraints like NOT NULL and FOREIGN KEY are checked before the row is stored.",
    realWorldUsage:
      "An e-commerce API inserts a new row into Orders for every checkout. A registration flow inserts a new row into Users. A migration inserts seed data into lookup tables. A reporting job inserts summary rows into a daily totals table.",
    explainLikeBeginner:
      "INSERT is like adding a new entry to your address book. You write down the name and the phone number, and now the entry is there. The database does the same with rows in a table.",
    interviewAnswer:
      "INSERT adds new rows to a table. You give the table, the columns, and the values. In .NET, EF Core generates an INSERT when you call SaveChanges after adding an entity. Constraints like NOT NULL and FOREIGN KEY are enforced by the database.",
    commonMistakes: [
      "Forgetting required columns and getting a NOT NULL error.",
      "Inserting wrong data types (a string into an int column).",
      "Inserting without a related parent row, breaking foreign key constraints.",
    ],
    bestPractices: [
      "Always list the columns you are inserting into.",
      "Use parameterized queries to avoid SQL injection.",
      "Insert related parent rows before child rows.",
    ],
    summary: [
      "INSERT adds new rows.",
      "Specify the table, the columns, and the values.",
      "EF Core handles INSERT automatically through SaveChanges.",
    ],
    codeExample: {
      title: "Inserting a customer with both raw SQL and EF Core",
      code: `-- Raw SQL
INSERT INTO Customers (Name, Email, IsActive)
VALUES ('Ali', 'ali@example.com', 1);

// EF Core
var customer = new Customer { Name = "Ali", Email = "ali@example.com" };
_db.Customers.Add(customer);
await _db.SaveChangesAsync();
// customer.Id is now set by the database`,
      output: "A new row in Customers with the values provided.",
      walkthrough: [
        "Raw SQL lists the columns and values explicitly.",
        "EF Core adds the entity and SaveChanges generates the INSERT.",
        "After SaveChanges, the entity's Id is set from the database.",
      ],
    },
    practice: {
      prompt:
        "Write an INSERT statement that adds a new product with Name = 'Laptop', Price = 1200, and CategoryId = 3. Then show the equivalent EF Core code.",
      expectedResult:
        "INSERT INTO Products (Name, Price, CategoryId) VALUES ('Laptop', 1200, 3) and the matching EF Core call.",
      hints: [
        "Use INSERT INTO with explicit column names.",
        "Use _db.Products.Add(product) and await SaveChangesAsync().",
        "Make sure CategoryId 3 exists in the parent table.",
      ],
      solution:
        "Write the INSERT statement with the three columns. In EF Core, create a Product object and add it through the DbSet, then SaveChangesAsync. EF Core generates the SQL automatically.",
    },
    quiz: [
      {
        kind: "concept",
        question: "What does INSERT do?",
        options: [
          "Reads rows.",
          "Adds new rows to a table.",
          "Deletes rows.",
          "Joins tables.",
        ],
        correctAnswer: "Adds new rows to a table.",
        explanation:
          "INSERT is the command for creating new records.",
      },
      {
        kind: "code-reading",
        question:
          "What happens after this line in EF Core?\n```csharp\n_db.Customers.Add(customer); await _db.SaveChangesAsync();\n```",
        options: [
          "Nothing.",
          "The customer is sent to the database as an INSERT, and EF Core fills in the generated Id.",
          "The customer is deleted.",
          "A SELECT is sent.",
        ],
        correctAnswer:
          "The customer is sent to the database as an INSERT, and EF Core fills in the generated Id.",
        explanation:
          "Add and SaveChanges together produce the INSERT.",
      },
      {
        kind: "spot-the-bug",
        question:
          "Why does this fail?\n`INSERT INTO Orders (CustomerId, Total) VALUES (999, 99.5);` when CustomerId 999 does not exist.",
        options: [
          "Nothing.",
          "The foreign key constraint fails because the parent customer does not exist.",
          "The price is too high.",
          "INSERT cannot have decimals.",
        ],
        correctAnswer:
          "The foreign key constraint fails because the parent customer does not exist.",
        explanation:
          "Foreign keys are enforced at INSERT time.",
      },
      {
        kind: "interview",
        question:
          "Why is it a good idea to list the columns explicitly in an INSERT?",
        options: [
          "It is not.",
          "Listing columns protects the query from breaking when the table schema changes — for example, when a new nullable column is added.",
          "It is shorter.",
          "It is required.",
        ],
        correctAnswer:
          "Listing columns protects the query from breaking when the table schema changes — for example, when a new nullable column is added.",
        explanation:
          "Explicit column lists are safer and easier to read.",
      },
    ],
  },

  update: {
    whyItMatters:
      "UPDATE is how existing data changes. Every profile change, every status update, every recalculated total goes through an UPDATE. Knowing how it works keeps your data safe from accidental mass updates.",
    simpleExplanation:
      "UPDATE changes the values in existing rows. You specify the table, the new values, and a WHERE clause to choose which rows to change.",
    deepExplanation:
      "The basic form is UPDATE Table SET Column = Value WHERE Condition. The WHERE clause is critical — without it, every row in the table is updated. EF Core generates UPDATE statements when you modify a tracked entity and call SaveChanges. The framework tracks which properties changed and updates only those columns by default.",
    realWorldUsage:
      "A customer updates their email. An order's status moves from Pending to Paid. A product's price is adjusted during a promotion. A user's password hash is changed after a reset. Every business action that changes existing data ends with an UPDATE.",
    explainLikeBeginner:
      "UPDATE is like editing a contact in your phone. You find the contact (WHERE) and change one field (SET). The rest of the contacts stay the same.",
    interviewAnswer:
      "UPDATE changes the values of existing rows in a table. The WHERE clause picks which rows. In .NET, EF Core tracks changes on entities and generates UPDATE statements automatically when SaveChanges is called.",
    commonMistakes: [
      "Running UPDATE without a WHERE clause, which changes every row.",
      "Updating fields that should not be changed, like CreatedAt.",
      "Forgetting to start a transaction when multiple updates must succeed together.",
    ],
    bestPractices: [
      "Always include a WHERE clause.",
      "Update only the fields that need to change.",
      "Wrap related updates in a transaction.",
    ],
    summary: [
      "UPDATE changes existing rows.",
      "The WHERE clause picks which rows.",
      "EF Core handles UPDATE automatically when you modify tracked entities.",
    ],
    codeExample: {
      title: "Updating a customer's email with raw SQL and EF Core",
      code: `-- Raw SQL
UPDATE Customers SET Email = 'new@example.com' WHERE Id = 5;

// EF Core
var customer = await _db.Customers.FindAsync(5);
if (customer != null)
{
    customer.Email = "new@example.com";
    await _db.SaveChangesAsync();
}`,
      output: "Email column for customer 5 is updated.",
      walkthrough: [
        "Raw SQL changes only the Email column for customer 5.",
        "EF Core loads the tracked entity, changes the property, and SaveChanges generates the UPDATE.",
        "Only the changed column is included in the update statement.",
      ],
    },
    practice: {
      prompt:
        "Write an UPDATE statement that changes the Status of order 10 to 'Paid'. Then show the equivalent EF Core code.",
      expectedResult:
        "UPDATE Orders SET Status = 'Paid' WHERE Id = 10 and a matching EF Core call.",
      hints: [
        "Always include WHERE Id = 10.",
        "Use FindAsync to load the tracked entity in EF Core.",
        "Set the property and call SaveChangesAsync.",
      ],
      solution:
        "Write UPDATE Orders SET Status = 'Paid' WHERE Id = 10. In EF Core, load the order, set order.Status = 'Paid', and await SaveChangesAsync().",
    },
    quiz: [
      {
        kind: "concept",
        question: "What does UPDATE do?",
        options: [
          "Adds new rows.",
          "Changes the values in existing rows that match the WHERE clause.",
          "Deletes rows.",
          "Creates tables.",
        ],
        correctAnswer:
          "Changes the values in existing rows that match the WHERE clause.",
        explanation:
          "UPDATE modifies existing data based on the WHERE clause.",
      },
      {
        kind: "code-reading",
        question:
          "What does this query do?\n`UPDATE Orders SET Status = 'Paid' WHERE Id = 10;`",
        options: [
          "Inserts a new order.",
          "Sets the Status of the order with Id 10 to 'Paid'.",
          "Deletes order 10.",
          "Creates the Orders table.",
        ],
        correctAnswer:
          "Sets the Status of the order with Id 10 to 'Paid'.",
        explanation:
          "UPDATE changes the Status column for the rows matching WHERE.",
      },
      {
        kind: "spot-the-bug",
        question:
          "Why is this dangerous?\n`UPDATE Products SET Price = 0;`",
        options: [
          "Nothing.",
          "There is no WHERE clause, so every product in the table is set to a price of 0.",
          "Price cannot be 0.",
          "UPDATE cannot run.",
        ],
        correctAnswer:
          "There is no WHERE clause, so every product in the table is set to a price of 0.",
        explanation:
          "Always include a WHERE clause to avoid mass updates.",
      },
      {
        kind: "interview",
        question:
          "How does EF Core decide which columns to include in an UPDATE?",
        options: [
          "It always updates every column.",
          "By default, EF Core tracks which properties changed and only updates those columns. You can configure it for more or less granular updates.",
          "It never updates anything.",
          "Only static columns.",
        ],
        correctAnswer:
          "By default, EF Core tracks which properties changed and only updates those columns. You can configure it for more or less granular updates.",
        explanation:
          "Change tracking is one of the main features of EF Core.",
      },
    ],
  },

  delete: {
    whyItMatters:
      "DELETE removes data from the database. A wrong DELETE can wipe out important records in seconds. Knowing the rules keeps your data safe and your team's trust in the system.",
    simpleExplanation:
      "DELETE removes rows from a table. You specify the table and a WHERE clause to choose which rows to remove. Without the WHERE clause, every row is deleted.",
    deepExplanation:
      "The basic form is DELETE FROM Table WHERE Condition. Foreign key constraints can stop the delete if other rows depend on this one, unless cascade delete is configured. EF Core generates DELETE statements when you Remove an entity and call SaveChanges. Many real applications prefer soft deletes — marking a row as inactive — to keep history and recover from mistakes.",
    realWorldUsage:
      "An admin deletes a test order. A scheduled job deletes expired sessions. A migration deletes obsolete lookup rows. A soft-delete flow sets IsDeleted = true instead of running a real DELETE so the data can be recovered.",
    explainLikeBeginner:
      "DELETE is like shredding a paper from your filing cabinet. You need to find the right paper first (WHERE), then shred it. If you skip the search, you shred every paper in the cabinet.",
    interviewAnswer:
      "DELETE removes rows from a table based on the WHERE clause. Without WHERE, the entire table is emptied. In .NET, EF Core generates DELETE statements through Remove and SaveChanges. Real applications often prefer soft deletes for safety and audit purposes.",
    commonMistakes: [
      "Running DELETE without a WHERE clause.",
      "Deleting parent rows before child rows, causing foreign key errors.",
      "Hard deleting instead of soft deleting when history is important.",
    ],
    bestPractices: [
      "Always include a WHERE clause.",
      "Test the delete with a SELECT first to confirm the right rows match.",
      "Use soft deletes for data that may need to be restored.",
    ],
    summary: [
      "DELETE removes rows that match the WHERE clause.",
      "Without WHERE, the entire table is emptied.",
      "Real applications often prefer soft deletes.",
    ],
    codeExample: {
      title: "Deleting a customer with raw SQL and EF Core",
      code: `-- Raw SQL
DELETE FROM Customers WHERE Id = 5;

// EF Core
var customer = await _db.Customers.FindAsync(5);
if (customer != null)
{
    _db.Customers.Remove(customer);
    await _db.SaveChangesAsync();
}`,
      output: "Customer 5 is removed from the table.",
      walkthrough: [
        "Raw SQL deletes only the customer with Id 5.",
        "EF Core loads the entity, marks it for removal, and SaveChanges generates the DELETE.",
        "Foreign key constraints will reject the delete if other tables reference this customer.",
      ],
    },
    practice: {
      prompt:
        "Write a DELETE statement that removes a single product by id, then show the EF Core equivalent. Add a comment explaining the danger of leaving out the WHERE clause.",
      expectedResult:
        "DELETE FROM Products WHERE Id = 7; with a clear note that omitting WHERE deletes every product.",
      hints: [
        "Always include WHERE Id = 7.",
        "Use FindAsync, Remove, and SaveChangesAsync in EF Core.",
        "Add a comment about the risk of missing WHERE.",
      ],
      solution:
        "Write the DELETE statement with WHERE. In EF Core, load the product, remove it, and call SaveChangesAsync. The comment reminds the reader that DELETE without WHERE is dangerous.",
    },
    quiz: [
      {
        kind: "concept",
        question: "What happens if you run DELETE without a WHERE clause?",
        options: [
          "Nothing.",
          "Every row in the table is removed.",
          "Only one row is deleted.",
          "The table is dropped.",
        ],
        correctAnswer:
          "Every row in the table is removed.",
        explanation:
          "Always include a WHERE clause to avoid mass deletes.",
      },
      {
        kind: "code-reading",
        question:
          "What does this code do?\n```csharp\n_db.Customers.Remove(customer);\nawait _db.SaveChangesAsync();\n```",
        options: [
          "Adds a new customer.",
          "Generates a DELETE statement for that customer and sends it to the database.",
          "Updates a customer.",
          "Reads a customer.",
        ],
        correctAnswer:
          "Generates a DELETE statement for that customer and sends it to the database.",
        explanation:
          "Remove plus SaveChanges produces the DELETE.",
      },
      {
        kind: "spot-the-bug",
        question:
          "Why does this fail in some databases?\n`DELETE FROM Customers WHERE Id = 5;` when Orders has a row with CustomerId = 5.",
        options: [
          "Nothing.",
          "The foreign key on Orders.CustomerId stops the delete because removing the customer would leave orphan orders.",
          "Customers cannot be deleted.",
          "Id is wrong.",
        ],
        correctAnswer:
          "The foreign key on Orders.CustomerId stops the delete because removing the customer would leave orphan orders.",
        explanation:
          "Either configure cascade delete, delete the children first, or use a soft delete.",
      },
      {
        kind: "interview",
        question:
          "When would you prefer a soft delete over a hard delete?",
        options: [
          "Never.",
          "When you need to keep history, recover from mistakes, comply with audit rules, or maintain references in related tables.",
          "Always.",
          "Only in tests.",
        ],
        correctAnswer:
          "When you need to keep history, recover from mistakes, comply with audit rules, or maintain references in related tables.",
        explanation:
          "Soft deletes are the default in many real systems because data is precious.",
      },
    ],
  },

  select: {
    whyItMatters:
      "SELECT is the most common SQL command. Every report, every API list endpoint, and every dashboard chart starts with a SELECT. Knowing how to write efficient ones is a core .NET skill.",
    simpleExplanation:
      "SELECT reads rows from one or more tables. You choose the columns, filter with WHERE, sort with ORDER BY, and limit the results.",
    deepExplanation:
      "SELECT Column1, Column2 FROM Table is the basic form. You filter with WHERE, group with GROUP BY, aggregate with COUNT/SUM/AVG, sort with ORDER BY, and limit with TOP (SQL Server) or LIMIT (PostgreSQL/MySQL). You can combine tables with JOIN. EF Core converts LINQ queries into SELECT statements. Knowing what the generated SQL looks like helps you tune performance.",
    realWorldUsage:
      "A list endpoint reads paged customers with SELECT TOP. A daily report sums orders by date. A dashboard query joins Orders, Customers, and Products. A health check queries SELECT COUNT(*) FROM Sessions to detect activity.",
    explainLikeBeginner:
      "SELECT is like asking the librarian for specific books. You name the books, the topics, and the order you want them in. The librarian gives you the matching books.",
    interviewAnswer:
      "SELECT reads data from one or more tables. You can choose columns, filter rows with WHERE, sort with ORDER BY, group, aggregate, and join. EF Core translates LINQ queries into SELECT statements, and reading the generated SQL is part of debugging performance.",
    commonMistakes: [
      "Using SELECT * instead of listing the needed columns.",
      "Forgetting WHERE on large tables, which loads everything into memory.",
      "Sorting without an index, which slows the query.",
    ],
    bestPractices: [
      "Select only the columns you need.",
      "Use WHERE to limit the rows.",
      "Add indexes for columns used in WHERE and ORDER BY.",
    ],
    summary: [
      "SELECT reads rows from tables.",
      "Use WHERE, ORDER BY, and aggregates to shape the result.",
      "EF Core converts LINQ into SELECT.",
    ],
    codeExample: {
      title: "Reading customers with raw SQL and LINQ",
      code: `-- Raw SQL
SELECT TOP 10 Id, Name, Email
FROM Customers
WHERE IsActive = 1
ORDER BY Name;

// EF Core LINQ equivalent
var customers = await _db.Customers
    .Where(c => c.IsActive)
    .OrderBy(c => c.Name)
    .Take(10)
    .Select(c => new { c.Id, c.Name, c.Email })
    .ToListAsync();`,
      output: "Up to 10 active customers sorted by name, with only the chosen columns.",
      walkthrough: [
        "WHERE keeps only active customers.",
        "ORDER BY sorts by name.",
        "TOP 10 (or Take in LINQ) limits the result.",
      ],
    },
    practice: {
      prompt:
        "Write a SELECT that returns the top 5 products by Price in descending order, showing only Id, Name, and Price. Also write the equivalent LINQ query.",
      expectedResult:
        "SELECT TOP 5 Id, Name, Price FROM Products ORDER BY Price DESC and the equivalent LINQ chain.",
      hints: [
        "Use TOP 5 or LIMIT 5 depending on the database.",
        "Use OrderByDescending(p => p.Price) in LINQ.",
        "Use Select(p => new { p.Id, p.Name, p.Price }) to shape the result.",
      ],
      solution:
        "Write SELECT TOP 5 Id, Name, Price FROM Products ORDER BY Price DESC. The LINQ version chains OrderByDescending, Take, and Select.",
    },
    quiz: [
      {
        kind: "concept",
        question: "What does SELECT do?",
        options: [
          "Adds rows.",
          "Reads rows from one or more tables.",
          "Deletes rows.",
          "Creates tables.",
        ],
        correctAnswer: "Reads rows from one or more tables.",
        explanation:
          "SELECT is the SQL command for reading data.",
      },
      {
        kind: "code-reading",
        question:
          "What does this LINQ query produce?\n```csharp\n_db.Customers.Where(c => c.IsActive).OrderBy(c => c.Name).Take(10);\n```",
        options: [
          "All customers.",
          "Up to 10 active customers sorted by name.",
          "Random customers.",
          "An error.",
        ],
        correctAnswer:
          "Up to 10 active customers sorted by name.",
        explanation:
          "Where filters, OrderBy sorts, and Take limits — the same shape as SQL.",
      },
      {
        kind: "spot-the-bug",
        question:
          "Why is this query slow on a large table?\n`SELECT * FROM Orders ORDER BY CreatedAt DESC;`",
        options: [
          "Nothing.",
          "It selects every column and sorts the entire table. Without a WHERE clause and an index on CreatedAt, the database scans and sorts everything.",
          "ORDER BY is not allowed.",
          "DESC is invalid.",
        ],
        correctAnswer:
          "It selects every column and sorts the entire table. Without a WHERE clause and an index on CreatedAt, the database scans and sorts everything.",
        explanation:
          "Always limit columns, rows, and add indexes for sorts.",
      },
      {
        kind: "interview",
        question:
          "How would you optimize a slow SELECT in a .NET application?",
        options: [
          "Always rewrite it in raw SQL.",
          "Look at the generated SQL, check the execution plan, add indexes for WHERE and ORDER BY columns, select only needed columns, and avoid loading unrelated data.",
          "Disable EF Core.",
          "Increase the database size.",
        ],
        correctAnswer:
          "Look at the generated SQL, check the execution plan, add indexes for WHERE and ORDER BY columns, select only needed columns, and avoid loading unrelated data.",
        explanation:
          "This is the standard query-tuning approach in real .NET work.",
      },
    ],
  },

  "ef-core-basics": {
    whyItMatters:
      "EF Core is the most common ORM in .NET. It lets you read and write data using C# classes and LINQ instead of raw SQL. Knowing it well means most data work becomes a few lines of clear code.",
    simpleExplanation:
      "Entity Framework Core, or EF Core, is the data access library used in most modern .NET applications. It maps C# classes (entities) to database tables and lets you query data with LINQ.",
    deepExplanation:
      "EF Core has three main parts: entities (your classes), the DbContext (the connection to the database), and DbSet<T> properties (one per entity, like a virtual table). You query with LINQ, and EF Core translates it into SQL. You modify entities and call SaveChanges, and EF Core generates INSERT, UPDATE, and DELETE statements. Migrations let you evolve the schema as the model changes.",
    realWorldUsage:
      "An OrderService uses _db.Orders.Where(o => o.CustomerId == customerId).ToListAsync() to load a customer's orders. A repository uses _db.Customers.FindAsync(id) to load by primary key. A reporting query uses Include and Select to project DTOs directly. Almost every modern .NET application uses EF Core for data access.",
    explainLikeBeginner:
      "EF Core is like a smart translator. You speak C# (LINQ), and it speaks SQL to the database. You do not need to write SQL by hand for most queries, but you can if you need to.",
    interviewAnswer:
      "EF Core is the .NET ORM that maps C# classes to database tables and lets you query data with LINQ. It supports change tracking, migrations, and async APIs. EF Core is the default data access tool in most modern .NET applications.",
    commonMistakes: [
      "Loading too much data by not using Where or Select.",
      "Forgetting to use AsNoTracking for read-only queries.",
      "Calling sync methods in async code, which can deadlock the application.",
    ],
    bestPractices: [
      "Use async methods (ToListAsync, FindAsync, SaveChangesAsync).",
      "Use Select to project DTOs directly in queries.",
      "Use AsNoTracking for read-only queries to save memory.",
    ],
    summary: [
      "EF Core is the main .NET ORM.",
      "It maps entities to tables and translates LINQ to SQL.",
      "It supports change tracking, migrations, and async APIs.",
    ],
    codeExample: {
      title: "Reading and saving with EF Core",
      code: `public class AppDbContext : DbContext
{
    public DbSet<Customer> Customers => Set<Customer>();

    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        options.UseSqlServer("Server=.;Database=Shop;Trusted_Connection=True;");
    }
}

// Reading
using var db = new AppDbContext();
var activeCustomers = await db.Customers
    .Where(c => c.IsActive)
    .ToListAsync();

// Writing
db.Customers.Add(new Customer { Name = "Ali", Email = "ali@example.com" });
await db.SaveChangesAsync();`,
      output: "Loaded active customers and inserted a new one.",
      walkthrough: [
        "AppDbContext defines the connection and the DbSet<Customer>.",
        "Where + ToListAsync is the LINQ way to filter and load.",
        "Add + SaveChangesAsync inserts a new row.",
      ],
    },
    practice: {
      prompt:
        "Define an AppDbContext with two DbSets: Customers and Orders. Write a method GetCustomerWithOrders(int id) that loads one customer and includes their orders, then returns it.",
      expectedResult:
        "The method loads the customer with the given id including the related orders, or returns null when the customer does not exist.",
      hints: [
        "Use _db.Customers.Include(c => c.Orders).",
        "Use FirstOrDefaultAsync(c => c.Id == id).",
        "Return null when nothing is found.",
      ],
      solution:
        "Write _db.Customers.Include(c => c.Orders).FirstOrDefaultAsync(c => c.Id == id). EF Core builds a SQL join and returns the customer with their orders.",
    },
    quiz: [
      {
        kind: "concept",
        question: "What is EF Core?",
        options: [
          "A unit testing framework.",
          "An ORM that maps C# classes to database tables and translates LINQ into SQL.",
          "A web server.",
          "A logging library.",
        ],
        correctAnswer:
          "An ORM that maps C# classes to database tables and translates LINQ into SQL.",
        explanation:
          "EF Core is the standard data access library in modern .NET.",
      },
      {
        kind: "code-reading",
        question:
          "What does this code do?\n```csharp\nvar list = await _db.Orders.Where(o => o.Total > 100).ToListAsync();\n```",
        options: [
          "Deletes orders.",
          "Loads all orders with Total greater than 100 as a list, asynchronously.",
          "Updates orders.",
          "Creates orders.",
        ],
        correctAnswer:
          "Loads all orders with Total greater than 100 as a list, asynchronously.",
        explanation:
          "Where + ToListAsync is the standard async read pattern.",
      },
      {
        kind: "spot-the-bug",
        question:
          "Why is this code slow?\n```csharp\nvar all = await _db.Customers.ToListAsync();\nvar active = all.Where(c => c.IsActive).ToList();\n```",
        options: [
          "Nothing.",
          "It loads every customer into memory first, then filters in C#. The Where should run inside the EF Core query so SQL does the filtering.",
          "It needs async.",
          "Where is not supported.",
        ],
        correctAnswer:
          "It loads every customer into memory first, then filters in C#. The Where should run inside the EF Core query so SQL does the filtering.",
        explanation:
          "Filter as early as possible, inside the query, to keep the result small.",
      },
      {
        kind: "interview",
        question:
          "What is AsNoTracking and when should you use it?",
        options: [
          "It is unrelated.",
          "AsNoTracking tells EF Core to skip change tracking. Use it for read-only queries to save memory and CPU.",
          "It deletes data.",
          "It disables async.",
        ],
        correctAnswer:
          "AsNoTracking tells EF Core to skip change tracking. Use it for read-only queries to save memory and CPU.",
        explanation:
          "AsNoTracking is one of the simplest EF Core performance wins.",
      },
    ],
  },

  dbcontext: {
    whyItMatters:
      "DbContext is the bridge between your application and the database. Every EF Core query, save, and migration goes through it. Knowing how to use it correctly is one of the most important .NET skills.",
    simpleExplanation:
      "DbContext is the EF Core class that represents a session with the database. It holds the connection, the DbSet properties for each entity, and the change tracker.",
    deepExplanation:
      "A DbContext is usually registered with dependency injection as scoped, meaning one instance per HTTP request. Inside, it tracks the entities you load, knows which ones have changed, and generates the right SQL when you call SaveChanges. The DbContext also configures conventions through OnModelCreating, where you can customize names, relationships, and constraints with the Fluent API.",
    realWorldUsage:
      "An AppDbContext has DbSet<Customer>, DbSet<Order>, and DbSet<Product>. A service receives the DbContext through its constructor. The service uses LINQ on the DbSets to read and write data. Every request gets its own DbContext instance through dependency injection.",
    explainLikeBeginner:
      "DbContext is like a notebook for the database. You write in it, EF Core reads what you wrote, and when you say 'save', it sends everything to the database in one trip.",
    interviewAnswer:
      "DbContext is the EF Core class that represents a session with the database. It holds DbSet properties, tracks changes, and generates SQL. We register it as scoped in dependency injection so each HTTP request has its own instance.",
    commonMistakes: [
      "Using one DbContext instance across multiple threads.",
      "Creating a new DbContext manually instead of receiving it through DI.",
      "Holding the DbContext open for too long, which keeps memory and connections busy.",
    ],
    bestPractices: [
      "Register the DbContext as scoped in dependency injection.",
      "Use one DbContext per HTTP request.",
      "Keep operations short — load, change, save, and let the request end.",
    ],
    summary: [
      "DbContext is the EF Core session with the database.",
      "It holds DbSets and tracks changes.",
      "Register it as scoped in dependency injection.",
    ],
    codeExample: {
      title: "A DbContext registered with dependency injection",
      code: `public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Order> Orders => Set<Order>();
}

// Program.cs
builder.Services.AddDbContext<AppDbContext>(opts =>
    opts.UseSqlServer(builder.Configuration.GetConnectionString("Default")));

// A service receives the DbContext
public class CustomerService
{
    private readonly AppDbContext _db;
    public CustomerService(AppDbContext db) => _db = db;

    public Task<Customer?> GetByIdAsync(int id) => _db.Customers.FindAsync(id).AsTask();
}`,
      output: "The service uses the DbContext provided through DI.",
      walkthrough: [
        "AppDbContext takes options through its constructor for configuration.",
        "AddDbContext registers it as scoped.",
        "CustomerService receives an AppDbContext per HTTP request.",
      ],
    },
    practice: {
      prompt:
        "Define an AppDbContext with DbSet<Product> and DbSet<Category>. Register it in Program.cs and inject it into a ProductService that loads a product by id.",
      expectedResult:
        "The ProductService.GetByIdAsync method returns the product with the given id or null when not found.",
      hints: [
        "Use DbContextOptions<AppDbContext> in the constructor.",
        "Register with AddDbContext in Program.cs.",
        "Inject AppDbContext into the service and use FindAsync.",
      ],
      solution:
        "Define AppDbContext with the constructor and two DbSets. Register with AddDbContext. Inject AppDbContext into ProductService and use _db.Products.FindAsync(id) to load one product.",
    },
    quiz: [
      {
        kind: "concept",
        question: "What is DbContext?",
        options: [
          "A web controller.",
          "An EF Core class that represents a session with the database and holds DbSet properties for each entity.",
          "A type of DTO.",
          "A logging service.",
        ],
        correctAnswer:
          "An EF Core class that represents a session with the database and holds DbSet properties for each entity.",
        explanation:
          "DbContext is the heart of EF Core's data access model.",
      },
      {
        kind: "code-reading",
        question:
          "What does AddDbContext do?\n```csharp\nbuilder.Services.AddDbContext<AppDbContext>(opts => opts.UseSqlServer(connectionString));\n```",
        options: [
          "Adds a controller.",
          "Registers AppDbContext as a scoped service and configures it to use SQL Server with the given connection string.",
          "Opens a database connection immediately.",
          "Disables EF Core.",
        ],
        correctAnswer:
          "Registers AppDbContext as a scoped service and configures it to use SQL Server with the given connection string.",
        explanation:
          "AddDbContext is the standard way to register a DbContext.",
      },
      {
        kind: "spot-the-bug",
        question:
          "Why is this design risky?\n```csharp\npublic static class Db\n{\n    public static AppDbContext Context = new AppDbContext();\n}\n```",
        options: [
          "Nothing.",
          "DbContext is not thread-safe and not designed to live for the whole application. It should be scoped per request through DI.",
          "It needs await.",
          "Static is required.",
        ],
        correctAnswer:
          "DbContext is not thread-safe and not designed to live for the whole application. It should be scoped per request through DI.",
        explanation:
          "Always use DI to get a fresh DbContext per request.",
      },
      {
        kind: "interview",
        question:
          "Why is DbContext registered as scoped?",
        options: [
          "Because it is faster.",
          "Because a scoped lifetime means one instance per HTTP request, which matches how change tracking and unit-of-work are designed to work.",
          "Because singleton is not allowed.",
          "Because it has no constructor.",
        ],
        correctAnswer:
          "Because a scoped lifetime means one instance per HTTP request, which matches how change tracking and unit-of-work are designed to work.",
        explanation:
          "Scoped is the right lifetime for DbContext in almost every web application.",
      },
    ],
  },

  migrations: {
    whyItMatters:
      "Migrations let you change the database schema in a safe, repeatable way. They are how you keep the database in sync with your code as the application evolves. Every real .NET project uses them.",
    simpleExplanation:
      "A migration is a file that describes a change to the database schema. EF Core generates the file based on changes to your entities, and you apply it to update the database.",
    deepExplanation:
      "When you change an entity — add a property, remove a column, rename a table — EF Core compares the new model to the old model and generates a migration file with the differences as code. The Up method applies the change. The Down method reverts it. You run dotnet ef migrations add to create one and dotnet ef database update to apply it. In production, migrations are usually applied through a deploy script or a startup hook.",
    realWorldUsage:
      "A team adds a new column to Customers — EF Core generates a migration. A column is renamed — another migration. A new table for AuditLog is added — another migration. Each migration is reviewed in pull requests and applied automatically during deployment.",
    explainLikeBeginner:
      "A migration is like a recipe for the database. Each recipe describes one change — add this column, rename that table. When you cook the recipe (apply the migration), the database changes accordingly.",
    interviewAnswer:
      "Migrations are EF Core's way of evolving the database schema over time. You change your entities, EF Core generates a migration, and you apply it with dotnet ef database update. Migrations are version-controlled and applied during deployment so every environment ends up with the same schema.",
    commonMistakes: [
      "Editing migrations after they have been applied to other environments.",
      "Skipping the review of generated migrations.",
      "Running migrations manually in production without a script.",
    ],
    bestPractices: [
      "Add migrations with clear names like AddCustomerEmailColumn.",
      "Review the generated SQL before applying it.",
      "Apply migrations as part of the deployment pipeline.",
    ],
    summary: [
      "Migrations describe schema changes in code.",
      "Use dotnet ef migrations add to create one and dotnet ef database update to apply it.",
      "Every real .NET project uses migrations to keep the database in sync.",
    ],
    codeExample: {
      title: "Adding a migration and updating the database",
      code: `# Add a new column to Customer in the entity
public class Customer
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // new
}

# Create a migration from the model change
dotnet ef migrations add AddCustomerCreatedAt

# Apply it to the database
dotnet ef database update`,
      output: "A new migration file is created and the database is updated.",
      walkthrough: [
        "The entity change is the source of truth.",
        "dotnet ef migrations add generates the migration file.",
        "dotnet ef database update applies the change to the database.",
      ],
    },
    practice: {
      prompt:
        "Add an IsActive boolean property to a Customer entity. Create a migration named AddCustomerIsActive and apply it. Then write down the dotnet ef commands you used.",
      expectedResult:
        "A new migration file appears in the project, and the Customers table has an IsActive column after the update.",
      hints: [
        "Update the entity first.",
        "Run dotnet ef migrations add AddCustomerIsActive.",
        "Run dotnet ef database update to apply the migration.",
      ],
      solution:
        "Add the property to Customer. Run the two dotnet ef commands. The migration file appears under Migrations/, and the database is updated.",
    },
    quiz: [
      {
        kind: "concept",
        question: "What is a migration?",
        options: [
          "A new feature in C#.",
          "A file that describes a change to the database schema based on differences in the entity model.",
          "A type of DTO.",
          "A test framework.",
        ],
        correctAnswer:
          "A file that describes a change to the database schema based on differences in the entity model.",
        explanation:
          "Migrations are how EF Core evolves the database schema over time.",
      },
      {
        kind: "code-reading",
        question:
          "What does this command do?\n`dotnet ef database update`",
        options: [
          "Creates a migration.",
          "Applies pending migrations to the database.",
          "Deletes the database.",
          "Inserts data.",
        ],
        correctAnswer:
          "Applies pending migrations to the database.",
        explanation:
          "It runs the Up methods of each pending migration in order.",
      },
      {
        kind: "spot-the-bug",
        question:
          "Why is editing an applied migration risky?",
        options: [
          "It is not.",
          "Other environments have already applied the original migration. Editing it leads to inconsistent schemas and broken deployments.",
          "Migrations are immutable.",
          "It deletes the project.",
        ],
        correctAnswer:
          "Other environments have already applied the original migration. Editing it leads to inconsistent schemas and broken deployments.",
        explanation:
          "Instead of editing an applied migration, add a new one with the correction.",
      },
      {
        kind: "interview",
        question:
          "How are migrations usually applied in production?",
        options: [
          "Manually by developers.",
          "Through the deployment pipeline, often by running dotnet ef database update or executing the generated SQL script as part of the release process.",
          "They are not applied in production.",
          "They are applied by the database engine alone.",
        ],
        correctAnswer:
          "Through the deployment pipeline, often by running dotnet ef database update or executing the generated SQL script as part of the release process.",
        explanation:
          "Automation makes migrations reliable and repeatable.",
      },
    ],
  },

  "repository-pattern-with-database": {
    whyItMatters:
      "The repository pattern keeps your data access clean and your services testable. It hides EF Core behind an interface so the rest of the code only talks to a clear contract. This is how most real .NET projects organize the data layer.",
    simpleExplanation:
      "A repository is a class that hides data access behind a clean interface. Services depend on the interface, not on EF Core directly. This makes the service easier to test and the data access easier to change.",
    deepExplanation:
      "An IRepository<T> describes the operations available — GetByIdAsync, AddAsync, ListAsync, RemoveAsync. The implementation uses the DbContext to do the work. Services depend on the interface and stay focused on business logic. In tests, the repository can be replaced with a fake. There is debate about whether EF Core itself is already a repository, but most teams still keep a thin repository for the test and design benefits.",
    realWorldUsage:
      "ICustomerRepository hides EF Core calls for customers. IOrderRepository handles orders. The OrderService depends on IOrderRepository, not on AppDbContext. Unit tests use a fake IOrderRepository to test business logic without a real database.",
    explainLikeBeginner:
      "A repository is like a librarian. You do not search the shelves yourself. You tell the librarian which book you want, and they bring it back. The shelves (database) can be reorganized without changing how you ask.",
    interviewAnswer:
      "The repository pattern hides data access behind an interface. Services depend on the interface instead of on EF Core directly, which makes them easier to test and the data access easier to change. The implementation uses the DbContext to do the work.",
    commonMistakes: [
      "Building a generic repository that adds no value over the DbSet.",
      "Mixing business logic into the repository.",
      "Skipping interfaces, which couples services to EF Core.",
    ],
    bestPractices: [
      "Keep repositories focused on data access only.",
      "Define interfaces that match the business needs, not the database.",
      "Use the repository to expose async, narrow methods.",
    ],
    summary: [
      "Repositories hide EF Core behind an interface.",
      "Services depend on the interface, not the DbContext.",
      "This pattern keeps data access testable and replaceable.",
    ],
    codeExample: {
      title: "A simple repository for Customer",
      code: `public interface ICustomerRepository
{
    Task<Customer?> GetByIdAsync(int id);
    Task<IReadOnlyList<Customer>> ListActiveAsync();
    Task AddAsync(Customer customer);
}

public class CustomerRepository : ICustomerRepository
{
    private readonly AppDbContext _db;
    public CustomerRepository(AppDbContext db) => _db = db;

    public Task<Customer?> GetByIdAsync(int id) =>
        _db.Customers.FirstOrDefaultAsync(c => c.Id == id);

    public async Task<IReadOnlyList<Customer>> ListActiveAsync() =>
        await _db.Customers.Where(c => c.IsActive).ToListAsync();

    public async Task AddAsync(Customer customer)
    {
        _db.Customers.Add(customer);
        await _db.SaveChangesAsync();
    }
}`,
      output: "A clean repository that hides EF Core and exposes a clear contract.",
      walkthrough: [
        "The interface describes the operations the rest of the code needs.",
        "The implementation uses the DbContext to do the work.",
        "Services depend on the interface, not on AppDbContext.",
      ],
    },
    practice: {
      prompt:
        "Define an IOrderRepository with GetByIdAsync, ListForCustomerAsync, and AddAsync. Implement it using AppDbContext. Then write a small OrderService that depends on IOrderRepository and adds a new order.",
      expectedResult:
        "OrderService uses IOrderRepository to load and save orders, with no direct dependency on AppDbContext.",
      hints: [
        "Define the interface with three async methods.",
        "Implement OrderRepository using the DbContext.",
        "Inject IOrderRepository into OrderService.",
      ],
      solution:
        "Define IOrderRepository with the three methods. Implement OrderRepository using AppDbContext. OrderService receives IOrderRepository through its constructor and uses it for all data access.",
    },
    quiz: [
      {
        kind: "concept",
        question: "What does a repository do?",
        options: [
          "It runs HTTP requests.",
          "It hides data access behind an interface so services can depend on the interface instead of EF Core directly.",
          "It manages dependency injection.",
          "It replaces the controller.",
        ],
        correctAnswer:
          "It hides data access behind an interface so services can depend on the interface instead of EF Core directly.",
        explanation:
          "This separation is what makes the service easier to test and the data access easier to change.",
      },
      {
        kind: "code-reading",
        question:
          "Why does this repository expose IReadOnlyList<Customer> instead of List<Customer>?\n```csharp\nTask<IReadOnlyList<Customer>> ListActiveAsync();\n```",
        options: [
          "It does not matter.",
          "IReadOnlyList signals that the caller should not modify the list, which keeps the contract clean and prevents unexpected side effects.",
          "List is forbidden.",
          "IReadOnlyList is required by EF Core.",
        ],
        correctAnswer:
          "IReadOnlyList signals that the caller should not modify the list, which keeps the contract clean and prevents unexpected side effects.",
        explanation:
          "Returning read-only collections is a small habit that pays off in larger projects.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is wrong with this repository?\n```csharp\npublic class OrderRepository\n{\n    public bool CanCustomerPlaceOrder(Customer c) { return c.IsActive && c.HasCredit; }\n}\n```",
        options: [
          "Nothing.",
          "Business logic does not belong in a repository. Repositories should only handle data access. This method should live in a service.",
          "The method should be async.",
          "It needs more parameters.",
        ],
        correctAnswer:
          "Business logic does not belong in a repository. Repositories should only handle data access. This method should live in a service.",
        explanation:
          "Keep each layer focused on its job.",
      },
      {
        kind: "interview",
        question:
          "Why introduce a repository when EF Core already abstracts the database?",
        options: [
          "It does not — always use DbContext directly.",
          "A repository gives a domain-shaped abstraction that services can depend on, makes services easy to test with fakes, and isolates the choice of EF Core so it can be replaced or extended later.",
          "It is faster than EF Core.",
          "It is required by C#.",
        ],
        correctAnswer:
          "A repository gives a domain-shaped abstraction that services can depend on, makes services easy to test with fakes, and isolates the choice of EF Core so it can be replaced or extended later.",
        explanation:
          "Repositories add value through cleaner contracts and easier testing, not by being faster.",
      },
    ],
  },
};
