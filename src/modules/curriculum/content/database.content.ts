import type { ModuleContent } from "./types";

export const databaseContent: ModuleContent = {
  entity: {
    whyItMatters:
      "An entity is the noun in your domain — Order, Customer, Invoice. Naming it well and shaping it deliberately is the first decision the schema and the API both inherit.",
    simpleExplanation:
      "An entity is a thing your system stores and reasons about. It usually corresponds to a row in a table or a document in a store.",
    deepExplanation:
      "Entities have identity (an `Id` that distinguishes one from another even when fields are equal), state (their fields), and behaviour (methods that enforce rules). In .NET with EF Core, an entity is a C# class mapped to a table. Identity is usually a `Guid` or `int` primary key. Anything without stable identity (a pair of address lines, a money amount) is a value object, not an entity.",
    realWorldUsage:
      "`Order` is an entity — two orders with the same total are still different orders because they have different ids. `Money(amount, currency)` is a value object — two `Money(10, USD)` are interchangeable.",
    explainLikeBeginner:
      "Entities are like people: even twins are different individuals. Value objects are like banknotes of the same denomination: one $10 bill is as good as another.",
    interviewAnswer:
      "An entity is a domain concept with stable identity, state, and behaviour, mapped to a row in a relational database. We distinguish it from value objects, which are interchangeable on equal fields.",
    commonMistakes: [
      "Modelling everything as an entity, including values like Money or Address.",
      "Treating an entity as a bag of public setters, losing all invariants.",
      "Letting database concerns (column names, indexes) bleed into the entity's class name.",
    ],
    bestPractices: [
      "Name entities after the business noun.",
      "Give them an `Id`; default to `Guid` unless ordering matters.",
      "Encapsulate state changes behind methods.",
    ],
    summary: [
      "Entity = identity + state + behaviour.",
      "Value object = no identity, equal fields = equal value.",
      "Name after the domain, not the technical layer.",
    ],
    codeExample: {
      title: "Entity vs value object",
      code: `public sealed class Order   // entity
{
    public Guid Id { get; }
    public Money Total { get; private set; }
    public Order(Guid id, Money total) { Id = id; Total = total; }
}

public readonly record struct Money(decimal Amount, string Currency); // value object`,
      output: "(types only; identity vs equality semantics)",
      walkthrough: [
        "`Order` has an identity-only equality — two orders with the same total are not equal.",
        "`Money` is a value: equal amount and currency means equal money.",
        "Choosing the right kind reduces accidental bugs in collections and comparisons.",
      ],
    },
    practice: {
      prompt:
        "Decide for each of these whether it is an entity or a value object: `Address`, `Customer`, `Coordinates(lat, lng)`, `Invoice`. Justify each.",
      expectedResult: "Each decision is grounded in whether two instances with the same fields are interchangeable.",
      hints: [
        "If swapping one for another with the same fields would never matter, it is a value.",
        "If you would refer to it by id elsewhere, it is an entity.",
        "When in doubt, lean value object — they are simpler.",
      ],
      solution:
        "Address = value (usually). Customer = entity. Coordinates = value. Invoice = entity. Apply the same lens to your own domain types.",
    },
    quiz: [
      {
        kind: "concept",
        question: "What distinguishes an entity from a value object?",
        options: [
          "Entities are stored in databases; value objects are not.",
          "Entities have identity; two instances with the same fields are still different. Value objects have no identity; equal fields means equal value.",
          "Entities can have behaviour; value objects cannot.",
          "There is no real difference.",
        ],
        correctAnswer:
          "Entities have identity; two instances with the same fields are still different. Value objects have no identity; equal fields means equal value.",
        explanation:
          "Identity is the line between the two. Both can carry behaviour; both can be persisted.",
      },
      {
        kind: "code-reading",
        question:
          "Why is `Money` declared as a `readonly record struct` here?",
        options: [
          "To make it an entity.",
          "To get value equality, immutability, and small stack-friendly allocation.",
          "Because EF Core requires it.",
          "Records cannot be classes.",
        ],
        correctAnswer:
          "To get value equality, immutability, and small stack-friendly allocation.",
        explanation:
          "Records give value equality; `readonly` makes it immutable; `struct` keeps it efficient for small values.",
      },
      {
        kind: "spot-the-bug",
        question:
          "Why is this design awkward?\n```csharp\npublic class Address\n{\n    public Guid Id { get; set; }\n    public string Street { get; set; } = \"\";\n}\n```",
        options: [
          "Nothing.",
          "Addresses are usually values (no identity beyond their fields); adding an `Id` forces a row in the database for every copy of the same address.",
          "`Guid` is illegal here.",
          "`string Street` should be `Street?`.",
        ],
        correctAnswer:
          "Addresses are usually values (no identity beyond their fields); adding an `Id` forces a row in the database for every copy of the same address.",
        explanation:
          "Model address as an owned value object in EF Core when possible; identity is a database concern that may not belong.",
      },
      {
        kind: "interview",
        question:
          "When would you turn a value object into an entity?",
        options: [
          "Never.",
          "When the same logical value (e.g. an `Address`) needs to be referenced from multiple places, have an audit trail, or carry its own lifecycle.",
          "Always.",
          "When EF Core suggests it.",
        ],
        correctAnswer:
          "When the same logical value (e.g. an `Address`) needs to be referenced from multiple places, have an audit trail, or carry its own lifecycle.",
        explanation:
          "Identity has a cost; introduce it only when the domain or the audit trail truly needs it.",
      },
    ],
  },

  table: {
    whyItMatters:
      "Every backend developer reads schemas. Tables are the physical home of your entities; understanding columns, types, constraints, and indexes is how you reason about query performance and data integrity.",
    simpleExplanation:
      "A table is a named grid of rows and typed columns. Each row holds one record; each column has a name and a type.",
    deepExplanation:
      "Define columns with the smallest type that fits (`int` over `bigint`, `nvarchar(80)` over `nvarchar(max)`). Add constraints: `NOT NULL` where the data must exist, `UNIQUE` where the value must be one-of-a-kind, `CHECK` for simple rules, foreign keys for relationships. Indexes speed up queries by trading write throughput and disk. EF Core generates DDL from your entity configuration; reading the generated migration SQL is the fastest way to confirm what you actually shipped.",
    realWorldUsage:
      "`Orders` table holds an `Id GUID PRIMARY KEY`, `Status NVARCHAR(20) NOT NULL`, `CustomerId GUID NOT NULL REFERENCES Customers(Id)`, `CreatedAt DATETIMEOFFSET NOT NULL`.",
    explainLikeBeginner:
      "A table is a spreadsheet: rows are records, columns are properties, and the column headers say what kind of data each cell can hold.",
    interviewAnswer:
      "A table stores rows of typed data. Good schema design uses the narrowest type that fits, enforces constraints at the database level, and adds indexes only where queries demand them.",
    commonMistakes: [
      "Using `nvarchar(max)` for everything because 'it might grow' — bloats storage and slows scans.",
      "Skipping `NOT NULL` constraints and inheriting silent data quality issues.",
      "Adding indexes to every column 'just in case', then watching writes slow down.",
    ],
    bestPractices: [
      "Default to `NOT NULL` with an explicit default; nullable should be a choice.",
      "Pick a primary key strategy and keep it consistent across the schema.",
      "Add indexes for queries you actually run, not queries you imagine.",
    ],
    summary: [
      "Tables = rows × typed columns + constraints.",
      "Narrow types, explicit nullability, deliberate indexes.",
      "Read the generated SQL — it is the source of truth.",
    ],
    codeExample: {
      title: "Reading the generated DDL",
      code: `-- generated from EF Core migration for Order
CREATE TABLE [Orders] (
    [Id] uniqueidentifier NOT NULL,
    [CustomerId] uniqueidentifier NOT NULL,
    [Status] nvarchar(20) NOT NULL,
    [CreatedAt] datetimeoffset NOT NULL,
    CONSTRAINT [PK_Orders] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Orders_Customers_CustomerId]
        FOREIGN KEY ([CustomerId]) REFERENCES [Customers] ([Id]) ON DELETE CASCADE
);
CREATE INDEX [IX_Orders_CustomerId] ON [Orders] ([CustomerId]);`,
      output: "(DDL applied during migration)",
      walkthrough: [
        "Types match domain intent: `uniqueidentifier` for ids, `nvarchar(20)` capped for status.",
        "Constraints — PK, FK, NOT NULL — live in the database, not just in code.",
        "An index on the FK supports lookups of orders by customer.",
      ],
    },
    practice: {
      prompt:
        "Sketch the table for a `Customer` entity with `Id`, `Email`, `Name`, `CreatedAt`. Decide types, nullability, and a unique constraint on `Email`. Write the SQL by hand and compare to the EF migration.",
      expectedResult:
        "Your hand-written DDL is close to the generator's; the differences teach you what the framework defaults are.",
      hints: [
        "`Email` should be `UNIQUE`.",
        "`Name` length capped (e.g. 100).",
        "Choose `DATETIMEOFFSET` over `DATETIME` for time-zone safety.",
      ],
      solution:
        "Compare hand-written DDL with `dotnet ef migrations add` output. Differences (e.g. column ordering, default constraint names) are minor; the substance should match.",
    },
    quiz: [
      {
        kind: "concept",
        question:
          "Which is the safest default for a column that always has a value?",
        options: [
          "NULL allowed.",
          "NOT NULL.",
          "Computed.",
          "There is no safe default.",
        ],
        correctAnswer: "NOT NULL.",
        explanation:
          "If the value is mandatory, encode that in the schema. Nullable should be a deliberate choice.",
      },
      {
        kind: "code-reading",
        question:
          "What does the `IX_Orders_CustomerId` index optimise?",
        options: [
          "Inserts into the orders table.",
          "Lookups of orders by customer id.",
          "Sorting orders by status.",
          "Nothing useful.",
        ],
        correctAnswer: "Lookups of orders by customer id.",
        explanation:
          "Indexes on foreign keys speed up `WHERE CustomerId = ?` queries and joins on the FK.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is wrong with this column choice?\n```sql\n[Status] nvarchar(max) NULL\n```",
        options: [
          "Nothing.",
          "`nvarchar(max)` is far wider than needed for a short status string, and `NULL` makes 'no status' indistinguishable from 'unknown' — both hurt schema quality.",
          "`nvarchar` is illegal.",
          "Status must be `int`.",
        ],
        correctAnswer:
          "`nvarchar(max)` is far wider than needed for a short status string, and `NULL` makes 'no status' indistinguishable from 'unknown' — both hurt schema quality.",
        explanation:
          "Bound the length (`nvarchar(20)`) and disallow nulls with a default. Constraints document intent.",
      },
      {
        kind: "interview",
        question:
          "When should you NOT add an index?",
        options: [
          "Never — always index everything.",
          "When the column is rarely filtered on or when the table is write-heavy and the index would slow inserts more than it helps reads.",
          "When the column is the primary key.",
          "When there are no foreign keys.",
        ],
        correctAnswer:
          "When the column is rarely filtered on or when the table is write-heavy and the index would slow inserts more than it helps reads.",
        explanation:
          "Indexes are not free. Measure the read benefit against the write cost before adding one.",
      },
    ],
  },

  "primary-key": {
    whyItMatters:
      "The primary key is how every other table refers to this one. Picking the wrong shape leads to fragmented indexes, leaky URLs, and migrations you cannot reverse.",
    simpleExplanation:
      "The primary key is the column (or columns) that uniquely identify a row in a table.",
    deepExplanation:
      "Two common choices in .NET: `Guid` (random, ideal for distributed systems and APIs that expose ids) and `int`/`bigint` identity (compact, sequential, friendly to indexes). Guids fragment clustered indexes unless you use `sequential` Guids (`Guid.CreateVersion7()` in .NET 9+ or `NEWSEQUENTIALID()` in SQL Server). Compound primary keys are valid but harder to reason about; default to a single surrogate key.",
    realWorldUsage:
      "`Orders.Id` is a `Guid`, exposed in URLs like `/orders/8f3a...`. `OrderLines` has `(OrderId, LineNumber)` as a compound PK because lines are scoped to their parent.",
    explainLikeBeginner:
      "The primary key is the row's unique badge number. No two badges are the same in the same table.",
    interviewAnswer:
      "The primary key is the column or columns that uniquely identify a row. We pick between sequential ints and Guids based on whether the id is exposed externally and whether the system is distributed; we use sequential Guids when both matter.",
    commonMistakes: [
      "Using a random `Guid` as a clustered primary key on a high-write table — fragmentation problems.",
      "Exposing internal integer ids in public URLs — easy to enumerate.",
      "Adding 'Id' columns to junction tables instead of using a natural compound PK.",
    ],
    bestPractices: [
      "Sequential Guids (`Guid.CreateVersion7()` or DB-generated) for distributed-friendly, index-friendly ids.",
      "Surrogate keys by default; compound keys when the semantic relationship is natural.",
      "Never expose raw incremental ints in public APIs.",
    ],
    summary: [
      "PK = unique identity for a row.",
      "Choose between sequential ints and Guids deliberately.",
      "Compound PKs exist; surrogate keys are the default.",
    ],
    codeExample: {
      title: "Sequential Guid in C# 12",
      code: `public sealed class Order
{
    public Guid Id { get; }
    public Order() => Id = Guid.CreateVersion7(); // sequential
}

// EF Core fluent config
modelBuilder.Entity<Order>()
    .HasKey(o => o.Id);
modelBuilder.Entity<Order>()
    .Property(o => o.Id)
    .ValueGeneratedNever(); // we generate it in code`,
      output: "Generated id: 0190ad3a-...",
      walkthrough: [
        "`Guid.CreateVersion7()` produces a Guid with timestamp ordering.",
        "Sequential Guids index well even when clustered.",
        "EF Core's `ValueGeneratedNever` says we provide the value, not the database.",
      ],
    },
    practice: {
      prompt:
        "For a `Tag` entity that is referenced by many `Post` rows, choose a primary key type. Justify the choice. Then write the EF Core configuration.",
      expectedResult:
        "You can articulate why `int` may suit a small lookup table and why `Guid` may suit a high-write distributed system.",
      hints: [
        "Tags are usually low-write; `int` is fine.",
        "Compound PKs are useful for `PostTag` join tables.",
        "Use `HasKey` in fluent config.",
      ],
      solution:
        "`Tag` with `int Id` is reasonable; `PostTag` uses `(PostId, TagId)` as a compound key. The choice is grounded in cardinality and write patterns.",
    },
    quiz: [
      {
        kind: "concept",
        question:
          "Which primary key strategy fragments a clustered index the least when rows are inserted concurrently?",
        options: [
          "Random Guid (`Guid.NewGuid()`).",
          "Sequential Guid (`Guid.CreateVersion7()` or `NEWSEQUENTIALID()`).",
          "Compound key of two random columns.",
          "It does not matter.",
        ],
        correctAnswer:
          "Sequential Guid (`Guid.CreateVersion7()` or `NEWSEQUENTIALID()`).",
        explanation:
          "Sequential Guids keep new rows appended at the end of the clustered index instead of inserting into random pages.",
      },
      {
        kind: "code-reading",
        question:
          "Why is `ValueGeneratedNever()` configured for `Id`?",
        options: [
          "Because the column is computed in the database.",
          "Because the application generates the Guid in code (`Guid.CreateVersion7()`), so EF Core should not try to.",
          "Because Guids cannot have values.",
          "It is required for foreign keys.",
        ],
        correctAnswer:
          "Because the application generates the Guid in code (`Guid.CreateVersion7()`), so EF Core should not try to.",
        explanation:
          "Without `ValueGeneratedNever`, EF tries to defer Guid generation, which conflicts with code-generated ids.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What problem does this URL hint at?\n`GET /users/42`",
        options: [
          "It is fine.",
          "An integer id is enumerable — `/users/41`, `/users/43` lets an attacker guess valid ids and probe access controls.",
          "`42` is not a valid id.",
          "URLs cannot use numbers.",
        ],
        correctAnswer:
          "An integer id is enumerable — `/users/41`, `/users/43` lets an attacker guess valid ids and probe access controls.",
        explanation:
          "Use opaque ids (Guids) in public URLs to make enumeration attacks meaningless.",
      },
      {
        kind: "interview",
        question:
          "Why are compound primary keys sometimes preferred over surrogate keys?",
        options: [
          "They are faster.",
          "They express the natural relationship in junction tables (e.g. `(PostId, TagId)`) and prevent duplicate pairs without an extra unique constraint.",
          "They are required by EF Core.",
          "There is no benefit.",
        ],
        correctAnswer:
          "They express the natural relationship in junction tables (e.g. `(PostId, TagId)`) and prevent duplicate pairs without an extra unique constraint.",
        explanation:
          "Surrogate keys add a layer; compound keys can be exactly what the relationship needs.",
      },
    ],
  },

  "foreign-key": {
    whyItMatters:
      "Foreign keys are the database's way of guaranteeing your data still makes sense after a thousand writes. Skip them and orphaned rows quietly pile up.",
    simpleExplanation:
      "A foreign key is a column that points at a primary key in another table. It enforces the relationship at the database level.",
    deepExplanation:
      "Configure FKs with EF Core via `HasOne`/`WithMany`. Choose the delete behaviour deliberately: `Cascade` removes children with the parent, `Restrict` refuses the delete if children exist, `SetNull` orphans the children. Defaults vary by relationship — always read the migration SQL and pick the explicit behaviour for your domain.",
    realWorldUsage:
      "`OrderLines.OrderId` references `Orders.Id` with `ON DELETE CASCADE`: deleting an order removes its lines automatically and atomically.",
    explainLikeBeginner:
      "A foreign key is a sticker on a paper that says 'belongs to file 42'. The system refuses to throw away file 42 if there are papers pointing at it (or it shreds them with it, depending on the rule).",
    interviewAnswer:
      "A foreign key links rows in one table to rows in another and enforces that link at the database level. We pick the delete behaviour (cascade, restrict, set-null) based on whether the children's existence depends on the parent.",
    commonMistakes: [
      "Forgetting to add an index on the foreign-key column — every join becomes a scan.",
      "Defaulting to cascade delete on relationships where a soft delete is the real intent.",
      "Letting the application enforce referential integrity that the database could enforce for free.",
    ],
    bestPractices: [
      "Add an index on the FK column.",
      "Be explicit about delete behaviour in the EF Core configuration.",
      "Prefer DB-level cascades over application code for atomic cleanup.",
    ],
    summary: [
      "FKs enforce relationships at the DB level.",
      "Index the FK column.",
      "Choose delete behaviour deliberately.",
    ],
    codeExample: {
      title: "FK + index + cascade",
      code: `modelBuilder.Entity<OrderLine>()
    .HasOne<Order>()
    .WithMany(o => o.Lines)
    .HasForeignKey(l => l.OrderId)
    .OnDelete(DeleteBehavior.Cascade);

modelBuilder.Entity<OrderLine>()
    .HasIndex(l => l.OrderId);`,
      output: `-- generated DDL
ALTER TABLE [OrderLines] ADD CONSTRAINT [FK_OrderLines_Orders_OrderId]
    FOREIGN KEY ([OrderId]) REFERENCES [Orders] ([Id]) ON DELETE CASCADE;
CREATE INDEX [IX_OrderLines_OrderId] ON [OrderLines] ([OrderId]);`,
      walkthrough: [
        "Fluent config sets relationship, FK column, and delete behaviour explicitly.",
        "The index supports `WHERE OrderId = ?` lookups and joins.",
        "Cascade keeps the database consistent without application code.",
      ],
    },
    practice: {
      prompt:
        "Model an `Invoice` with many `InvoicePayment` children. Decide whether deleting an invoice should cascade to payments or restrict. Configure EF Core and inspect the generated migration.",
      expectedResult:
        "Your choice is reflected in the migration SQL; you can defend it from an audit perspective.",
      hints: [
        "Financial data usually wants `Restrict` — losing payments silently is bad.",
        "If your domain truly wants cascade, document why.",
        "Always pair with an index on the FK column.",
      ],
      solution:
        "`Restrict` is the conservative choice for payments. The audit story improves: an invoice cannot disappear while payments exist; the application must clean up explicitly.",
    },
    quiz: [
      {
        kind: "concept",
        question: "What does a foreign key enforce?",
        options: [
          "Uniqueness of a column.",
          "That every value in the FK column either is `NULL` or matches a primary key in the referenced table.",
          "An automatic index.",
          "Nothing — FKs are documentation only.",
        ],
        correctAnswer:
          "That every value in the FK column either is `NULL` or matches a primary key in the referenced table.",
        explanation:
          "Referential integrity: the FK guarantees the link is valid for as long as it exists.",
      },
      {
        kind: "code-reading",
        question:
          "Given `OnDelete(DeleteBehavior.Cascade)`, what happens when you `DELETE FROM Orders WHERE Id = ?`?",
        options: [
          "The order is deleted, but its lines remain orphaned.",
          "The delete is rejected because lines exist.",
          "The order and its dependent lines are deleted in the same transaction.",
          "Nothing happens.",
        ],
        correctAnswer:
          "The order and its dependent lines are deleted in the same transaction.",
        explanation:
          "Cascade lets the database remove dependent rows automatically.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is wrong with this schema?\n```sql\nALTER TABLE OrderLines ADD CONSTRAINT FK_OrderLines_OrderId\n    FOREIGN KEY (OrderId) REFERENCES Orders(Id);\n-- no index on OrderLines.OrderId\n```",
        options: [
          "Nothing.",
          "Without an index on `OrderLines.OrderId`, every query that filters or joins on it scans the table — performance degrades as the table grows.",
          "Foreign keys must come with indexes automatically.",
          "The syntax is invalid.",
        ],
        correctAnswer:
          "Without an index on `OrderLines.OrderId`, every query that filters or joins on it scans the table — performance degrades as the table grows.",
        explanation:
          "Some databases auto-index FKs; SQL Server does not. Always add the index explicitly.",
      },
      {
        kind: "interview",
        question:
          "When would you choose `Restrict` over `Cascade`?",
        options: [
          "Never.",
          "When the children represent records you must not silently lose (payments, audit logs); `Restrict` forces a deliberate cleanup path.",
          "Always — cascades are dangerous.",
          "When the FK is nullable.",
        ],
        correctAnswer:
          "When the children represent records you must not silently lose (payments, audit logs); `Restrict` forces a deliberate cleanup path.",
        explanation:
          "Both are valid; the choice is a domain-driven trade-off between automatic cleanup and audit safety.",
      },
    ],
  },

  "simple-sql-queries": {
    whyItMatters:
      "Even when you use EF Core, the database thinks in SQL. Reading and writing simple queries is what lets you diagnose 'why is this slow' without guessing.",
    simpleExplanation:
      "SQL is the language used to read and modify relational data. The core verbs are `SELECT`, `INSERT`, `UPDATE`, `DELETE`.",
    deepExplanation:
      "Start with the four shapes you will write daily: filter (`WHERE`), pick columns (`SELECT col1, col2`), order (`ORDER BY`), and limit (`TOP n` or `LIMIT n`). Joins combine tables (`JOIN ... ON`). Aggregates count or sum groups (`GROUP BY`). Practising these by hand makes EF Core's `LINQ` translation predictable, and it makes you faster at reading query plans when something is slow.",
    realWorldUsage:
      "`SELECT Id, Status, Total FROM Orders WHERE CustomerId = @cid ORDER BY CreatedAt DESC OFFSET 0 ROWS FETCH NEXT 20 ROWS ONLY` — the SQL behind a typical paged 'list my orders' endpoint.",
    explainLikeBeginner:
      "SQL is asking the database in plain words: 'show me these columns from this table where this is true'.",
    interviewAnswer:
      "SQL is the relational query language. The core skills are filtering with `WHERE`, projecting with `SELECT`, joining tables, and ordering or paging the result. Even when using an ORM, the developer should be able to read the generated SQL to reason about performance.",
    commonMistakes: [
      "`SELECT *` everywhere — fetches columns you do not need and breaks if the schema changes.",
      "Not parameterising — concatenating user input creates SQL injection vulnerabilities.",
      "Forgetting `ORDER BY` on paged queries, getting non-deterministic results.",
    ],
    bestPractices: [
      "Project only the columns you need.",
      "Always parameterise — `@id`, not `'+id+'`.",
      "Pair `OFFSET/FETCH` with a deterministic `ORDER BY`.",
    ],
    summary: [
      "Filter, project, join, order, page — the daily SQL shapes.",
      "Parameterise everything.",
      "Read the generated SQL when EF Core feels slow.",
    ],
    codeExample: {
      title: "Filter + project + page",
      code: `SELECT o.Id, o.Status, o.Total
FROM Orders o
WHERE o.CustomerId = @customerId
  AND o.Status = 'Confirmed'
ORDER BY o.CreatedAt DESC
OFFSET 0 ROWS FETCH NEXT 20 ROWS ONLY;`,
      output: `Id        Status      Total
8f3a...   Confirmed   42.50
1c01...   Confirmed   18.00
...`,
      walkthrough: [
        "Filter narrows the rows; project narrows the columns.",
        "Parameterised `@customerId` prevents injection.",
        "`OFFSET/FETCH` paginates deterministically because `ORDER BY` is present.",
      ],
    },
    practice: {
      prompt:
        "Write a SQL query that returns the top 5 customers by total order value in the last 30 days. Include only customers with at least 2 orders.",
      expectedResult:
        "A `JOIN` + `GROUP BY` + `HAVING` + `ORDER BY` query that produces the right shape.",
      hints: [
        "Aggregate with `SUM(o.Total)` per customer.",
        "Filter the date range with `WHERE`.",
        "Use `HAVING COUNT(*) >= 2` for the order-count condition.",
      ],
      solution:
        "`SELECT TOP 5 c.Id, c.Name, SUM(o.Total) AS Total FROM Customers c JOIN Orders o ON o.CustomerId = c.Id WHERE o.CreatedAt >= DATEADD(day, -30, GETUTCDATE()) GROUP BY c.Id, c.Name HAVING COUNT(*) >= 2 ORDER BY Total DESC;`",
    },
    quiz: [
      {
        kind: "concept",
        question:
          "Why is `SELECT * FROM Orders` a problem in production code?",
        options: [
          "It is the fastest possible query.",
          "It returns every column, including ones the application does not need, and it silently changes shape when the schema evolves.",
          "It is illegal SQL.",
          "It causes deadlocks.",
        ],
        correctAnswer:
          "It returns every column, including ones the application does not need, and it silently changes shape when the schema evolves.",
        explanation:
          "List the columns you actually consume; the explicit shape acts as a contract.",
      },
      {
        kind: "code-reading",
        question:
          "Why is `@customerId` used instead of string concatenation?",
        options: [
          "Style preference.",
          "Parameterisation: the driver sends the value separately from the SQL text, which prevents SQL injection and lets the planner cache the query.",
          "It is slower.",
          "It is required by EF Core.",
        ],
        correctAnswer:
          "Parameterisation: the driver sends the value separately from the SQL text, which prevents SQL injection and lets the planner cache the query.",
        explanation:
          "Parameterise every user-supplied value, every time, with no exceptions.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is wrong here?\n```sql\nSELECT Id, Status FROM Orders OFFSET 0 ROWS FETCH NEXT 20 ROWS ONLY;\n```",
        options: [
          "Nothing.",
          "There is no `ORDER BY`, so the rows returned for a given page are not deterministic — page 1 and page 2 may overlap.",
          "`OFFSET/FETCH` is illegal.",
          "`Status` is not a column.",
        ],
        correctAnswer:
          "There is no `ORDER BY`, so the rows returned for a given page are not deterministic — page 1 and page 2 may overlap.",
        explanation:
          "Paging without ordering is undefined behaviour. Add `ORDER BY` on a stable column (often the PK).",
      },
      {
        kind: "interview",
        question:
          "How do you investigate a slow EF Core query?",
        options: [
          "Rewrite it as raw SQL and hope.",
          "Capture the generated SQL (e.g. via `ToQueryString()` or logging), run it against the database with a query plan, and decide whether the issue is missing indexes, wrong join order, or fetching too much data.",
          "Restart the application.",
          "Lower the log level.",
        ],
        correctAnswer:
          "Capture the generated SQL (e.g. via `ToQueryString()` or logging), run it against the database with a query plan, and decide whether the issue is missing indexes, wrong join order, or fetching too much data.",
        explanation:
          "Read the plan; the bottleneck is almost always visible there.",
      },
    ],
  },

  insert: {
    whyItMatters:
      "INSERT is how data enters your database. Done badly, you write duplicates, lose audits, or block other writers; done well, you keep your data clean and your inserts fast.",
    simpleExplanation:
      "`INSERT INTO table (cols) VALUES (...)` adds a row. EF Core does this via `DbContext.Add` plus `SaveChanges`.",
    deepExplanation:
      "Two layers to keep in mind: the SQL itself (always list columns, always parameterise) and the transaction model (a single `SaveChanges` writes everything in one transaction by default). For bulk loads, consider `EF Core Bulk Extensions` or raw `SqlBulkCopy` — `DbContext.AddRange` issues one INSERT per row, which is slow at scale.",
    realWorldUsage:
      "`POST /orders` issues `INSERT INTO Orders (Id, CustomerId, Status, Total, CreatedAt) VALUES (@p0, ...)`. EF Core then inserts each `OrderLine` in the same transaction.",
    explainLikeBeginner:
      "INSERT is filing a new row into the spreadsheet. You name every column you are setting.",
    interviewAnswer:
      "INSERT writes new rows. We always list columns explicitly, parameterise values, and group related inserts in one transaction (EF Core's `SaveChanges` by default). For bulk operations we step outside the ORM.",
    commonMistakes: [
      "Letting EF Core run row-by-row inserts for thousands of records in one request.",
      "Omitting the column list and relying on positional order — fragile to schema changes.",
      "Inserting without a transaction so a partial failure leaves the database half-updated.",
    ],
    bestPractices: [
      "List columns explicitly in handwritten SQL.",
      "Use `SaveChanges` once per logical unit of work.",
      "Reach for bulk libraries when row counts exceed a few hundred.",
    ],
    summary: [
      "INSERT writes rows; list columns; parameterise.",
      "Group writes in one transaction.",
      "Bulk insert needs a different tool than `DbContext.AddRange` at scale.",
    ],
    codeExample: {
      title: "EF Core insert vs raw SQL",
      code: `// EF Core (single transaction by default)
var order = new Order(Guid.CreateVersion7(), customerId);
order.AddLine("SKU-A", 1);
_db.Orders.Add(order);
await _db.SaveChangesAsync();

// Raw, when you need it
const string sql = @"INSERT INTO Orders (Id, CustomerId, Status, CreatedAt)
                     VALUES (@id, @cid, 'Pending', SYSUTCDATETIME());";
await _db.Database.ExecuteSqlInterpolatedAsync($"...");`,
      output: "1 row inserted into Orders; n rows inserted into OrderLines (one round-trip via SaveChanges).",
      walkthrough: [
        "`SaveChanges` opens a transaction, writes parent and children, commits.",
        "Raw SQL is parameterised — never concatenate.",
        "Bulk loads use `EFCore.BulkExtensions` or `SqlBulkCopy`.",
      ],
    },
    practice: {
      prompt:
        "Write an `InsertManyAsync(IEnumerable<Customer>)` method. Use `AddRange` + `SaveChanges` for up to 1,000 rows; switch to a bulk extension for larger batches. Measure both.",
      expectedResult:
        "You can see the latency cliff where row-by-row inserts stop being acceptable.",
      hints: [
        "Use `Stopwatch` for timing.",
        "Try 10, 1,000, 100,000 rows.",
        "Inspect the SQL with EF Core logging.",
      ],
      solution:
        "Below a few hundred rows, EF Core is fine. Above that, a bulk path is dramatically faster. Pick the tool by row count, not by habit.",
    },
    quiz: [
      {
        kind: "concept",
        question:
          "What does `DbContext.SaveChangesAsync` do by default for a series of `Add` calls?",
        options: [
          "Issues each insert in its own transaction.",
          "Writes everything in one transaction so the change is atomic.",
          "Skips inserts that already exist.",
          "Logs but does not write.",
        ],
        correctAnswer:
          "Writes everything in one transaction so the change is atomic.",
        explanation:
          "Atomicity is the default unless you configure otherwise.",
      },
      {
        kind: "code-reading",
        question:
          "Why is the raw SQL example written with `ExecuteSqlInterpolatedAsync`?",
        options: [
          "Style.",
          "It safely parameterises interpolated values; the SQL is sent with placeholders, not the user input concatenated.",
          "It is faster.",
          "It is required for `INSERT`.",
        ],
        correctAnswer:
          "It safely parameterises interpolated values; the SQL is sent with placeholders, not the user input concatenated.",
        explanation:
          "Interpolated SQL helpers are safe by design; raw concatenation is the dangerous path.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is wrong with this loop?\n```csharp\nforeach (var c in customers) { _db.Customers.Add(c); await _db.SaveChangesAsync(); }\n```",
        options: [
          "Nothing.",
          "It opens a new transaction per row, multiplying database round-trips and crippling throughput for large lists.",
          "`Add` should be `AddAsync`.",
          "`Customers` is not a `DbSet`.",
        ],
        correctAnswer:
          "It opens a new transaction per row, multiplying database round-trips and crippling throughput for large lists.",
        explanation:
          "Batch via `AddRange` + single `SaveChangesAsync`, or use a bulk extension for very large batches.",
      },
      {
        kind: "interview",
        question:
          "When does EF Core's per-row INSERT stop being good enough?",
        options: [
          "Never; EF Core scales infinitely.",
          "Around a few hundred to a few thousand rows depending on row size and network latency; beyond that, switch to `SqlBulkCopy` or an EF Core bulk extension.",
          "Above ten rows.",
          "Above one million rows.",
        ],
        correctAnswer:
          "Around a few hundred to a few thousand rows depending on row size and network latency; beyond that, switch to `SqlBulkCopy` or an EF Core bulk extension.",
        explanation:
          "The exact threshold is workload-specific; measure it for your data and your network.",
      },
    ],
  },

  update: {
    whyItMatters:
      "Update is where concurrency bites: two requests change the same row at once, one wins, one loses, and your data is inconsistent. Getting update strategy right is a senior-level concern.",
    simpleExplanation:
      "`UPDATE table SET col = ... WHERE ...` modifies existing rows. EF Core does this via change tracking after `SaveChanges`.",
    deepExplanation:
      "Two strategies for concurrency. Optimistic: assume conflicts are rare, detect them with a `rowversion` (or timestamp) column, retry or fail explicitly. Pessimistic: take a lock so the row cannot change while you read and write — rare in web APIs, common in batch jobs. ASP.NET Core defaults to optimistic; configure a concurrency token in EF Core to enable it.",
    realWorldUsage:
      "`PUT /orders/{id}` updates a row with `WHERE Id = @id AND RowVersion = @rv`. If no rows match, throw a 409 Conflict and let the client re-fetch and retry.",
    explainLikeBeginner:
      "Update is editing an existing row. The question is what happens when two people edit the same row at the same time.",
    interviewAnswer:
      "Update modifies existing rows. In web APIs we usually use optimistic concurrency — a `rowversion` token detects conflicting writes — and translate conflicts into a 409 Conflict so the client can re-fetch and retry. Pessimistic locking is reserved for cases where conflicts are common and retries are expensive.",
    commonMistakes: [
      "Updating without a `WHERE` clause — silently wiping every row.",
      "Ignoring concurrency tokens and overwriting another writer's change.",
      "Using `UPDATE ... SELECT` patterns that race with concurrent writers.",
    ],
    bestPractices: [
      "Add a `rowversion` (or `RowVersion`) column to entities you update.",
      "Wrap `SaveChanges` in a `try/catch (DbUpdateConcurrencyException)` and translate to 409.",
      "Always include the PK in the `WHERE` clause.",
    ],
    summary: [
      "Update needs a precise `WHERE`.",
      "Use rowversion + optimistic concurrency for web APIs.",
      "Translate conflicts to 409 Conflict for clients.",
    ],
    codeExample: {
      title: "Optimistic concurrency in EF Core",
      code: `public class Order
{
    public Guid Id { get; set; }
    public string Status { get; set; } = "Pending";
    [Timestamp] public byte[]? RowVersion { get; set; }
}

try
{
    order.Status = "Confirmed";
    await _db.SaveChangesAsync();
}
catch (DbUpdateConcurrencyException)
{
    throw new ConflictException("Order changed concurrently. Reload and retry.");
}`,
      output: "On a concurrent update, ConflictException -> HTTP 409 with a retry hint.",
      walkthrough: [
        "`[Timestamp]` makes EF Core include `RowVersion` in the `WHERE` clause and update its value on success.",
        "If another writer changed the row, the `WHERE` matches zero rows and `DbUpdateConcurrencyException` is thrown.",
        "The application translates that into a 409 the client knows how to handle.",
      ],
    },
    practice: {
      prompt:
        "Add a `[Timestamp]` `RowVersion` to a `Product` entity. Simulate two concurrent updates and confirm one of them throws `DbUpdateConcurrencyException`.",
      expectedResult:
        "The concurrency token detects the conflict deterministically.",
      hints: [
        "Two `DbContext` instances simulate two clients.",
        "Update one, then the other, then call `SaveChangesAsync` on each.",
        "Catch and report.",
      ],
      solution:
        "Optimistic concurrency works as expected. You can return 409 from the API and let the client refresh and retry — a clean, atomic interaction.",
    },
    quiz: [
      {
        kind: "concept",
        question:
          "Which concurrency strategy does ASP.NET Core most commonly use for HTTP APIs?",
        options: [
          "Pessimistic — take a row lock for the duration of the request.",
          "Optimistic — detect conflicts on commit via a rowversion or timestamp column.",
          "No concurrency control.",
          "Two-phase commit.",
        ],
        correctAnswer:
          "Optimistic — detect conflicts on commit via a rowversion or timestamp column.",
        explanation:
          "Web APIs are short-lived; optimistic concurrency keeps locks out of the request path.",
      },
      {
        kind: "code-reading",
        question:
          "What does `[Timestamp]` change in the generated `UPDATE` statement?",
        options: [
          "Adds `ORDER BY RowVersion`.",
          "Adds `WHERE RowVersion = @oldRv` and updates `RowVersion` to a new value as part of the write.",
          "Disables the update.",
          "Nothing.",
        ],
        correctAnswer:
          "Adds `WHERE RowVersion = @oldRv` and updates `RowVersion` to a new value as part of the write.",
        explanation:
          "If the WHERE matches zero rows, EF Core knows someone else changed the row and throws.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is wrong with this code?\n```csharp\nawait _db.Database.ExecuteSqlInterpolatedAsync($\"UPDATE Orders SET Status = 'Confirmed'\");\n```",
        options: [
          "Nothing.",
          "No `WHERE` clause — every order in the table is updated to `Confirmed`.",
          "`ExecuteSqlInterpolatedAsync` cannot run UPDATE.",
          "It is missing `await`.",
        ],
        correctAnswer:
          "No `WHERE` clause — every order in the table is updated to `Confirmed`.",
        explanation:
          "Forgetting the `WHERE` is the classic UPDATE disaster. Always include it; review every update SQL before merging.",
      },
      {
        kind: "interview",
        question:
          "How would you handle a `DbUpdateConcurrencyException` in an HTTP API?",
        options: [
          "Crash the application.",
          "Translate it to a 409 Conflict response so the client can re-fetch the latest state and decide what to do (retry, prompt user, abort).",
          "Ignore it.",
          "Retry indefinitely.",
        ],
        correctAnswer:
          "Translate it to a 409 Conflict response so the client can re-fetch the latest state and decide what to do (retry, prompt user, abort).",
        explanation:
          "409 is the standard signal for 'your version is stale'. Retries belong to the client, not the server.",
      },
    ],
  },

  delete: {
    whyItMatters:
      "Delete is permanent — or is it? Soft deletes, cascades, and audit trails determine whether a wrong delete is recoverable or a Sunday-evening incident.",
    simpleExplanation:
      "`DELETE FROM table WHERE ...` removes rows. EF Core does this via `Remove` + `SaveChanges`.",
    deepExplanation:
      "Two patterns dominate. Hard delete: the row is physically removed; cascades and foreign keys decide what happens to children. Soft delete: a `DeletedAt` column is set, the row remains, and a global query filter hides it from default queries. Soft delete is the safer default for user-facing data because it preserves history.",
    realWorldUsage:
      "`DELETE /orders/{id}` either physically removes the row (and cascades to lines) or sets `Order.DeletedAt = now` depending on the policy. Auditors love the soft-delete trail.",
    explainLikeBeginner:
      "Hard delete is throwing the file in the shredder. Soft delete is marking the folder 'archived' and moving it to a back room.",
    interviewAnswer:
      "Delete removes rows. We default to soft delete for user-facing entities — a `DeletedAt` timestamp and a global query filter — because it preserves history and is forgiving of mistakes. Hard delete is reserved for cases where retention is forbidden.",
    commonMistakes: [
      "Hard-deleting customer data without considering audit or compliance requirements.",
      "Forgetting to filter out soft-deleted rows in custom queries, leaking deleted data.",
      "Cascading deletes across relationships you did not intend to cascade.",
    ],
    bestPractices: [
      "Default to soft delete for user-facing entities.",
      "Use EF Core query filters to hide soft-deleted rows globally.",
      "Audit the delete: who, when, why.",
    ],
    summary: [
      "Soft delete preserves history; hard delete frees space.",
      "Use query filters to hide soft-deleted rows.",
      "Audit deletes — they are high-impact actions.",
    ],
    codeExample: {
      title: "Soft delete with global query filter",
      code: `public class Customer
{
    public Guid Id { get; set; }
    public string Name { get; set; } = "";
    public DateTimeOffset? DeletedAt { get; set; }
}

modelBuilder.Entity<Customer>()
    .HasQueryFilter(c => c.DeletedAt == null);

public async Task DeleteAsync(Guid id)
{
    var c = await _db.Customers.FindAsync(id)
        ?? throw new NotFoundException();
    c.DeletedAt = DateTimeOffset.UtcNow;
    await _db.SaveChangesAsync();
}`,
      output: "After delete: customer hidden from queries; row still present with DeletedAt set.",
      walkthrough: [
        "Adding a nullable `DeletedAt` is non-destructive.",
        "Query filter hides soft-deleted rows from every query by default.",
        "`IgnoreQueryFilters()` opts back in when an admin tool needs to see them.",
      ],
    },
    practice: {
      prompt:
        "Convert a hard-delete `DELETE /orders/{id}` endpoint to a soft delete with `DeletedAt` and a global query filter. Add an admin endpoint that lists soft-deleted orders.",
      expectedResult:
        "Normal endpoints behave as before; the admin endpoint reveals soft-deleted rows.",
      hints: [
        "Use `HasQueryFilter` in the model config.",
        "Use `IgnoreQueryFilters()` in the admin query.",
        "Audit who performed the delete.",
      ],
      solution:
        "The soft-delete pattern adds resilience without breaking existing behaviour. Admin tooling can reveal deletes for recovery or audit.",
    },
    quiz: [
      {
        kind: "concept",
        question: "Which deletion strategy preserves history by default?",
        options: [
          "Hard delete.",
          "Soft delete via a `DeletedAt` flag and a global query filter.",
          "Cascade delete.",
          "Truncate.",
        ],
        correctAnswer:
          "Soft delete via a `DeletedAt` flag and a global query filter.",
        explanation:
          "Soft delete is recoverable and audit-friendly; hard delete is final.",
      },
      {
        kind: "code-reading",
        question:
          "What happens when you query `_db.Customers` after the example's delete?",
        options: [
          "The customer is returned as before.",
          "The customer is excluded by the global query filter and does not appear in results.",
          "EF Core throws.",
          "All customers disappear.",
        ],
        correctAnswer:
          "The customer is excluded by the global query filter and does not appear in results.",
        explanation:
          "Query filters silently constrain every LINQ query on the entity until `IgnoreQueryFilters()` is called.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is risky here?\n```csharp\nawait _db.Database.ExecuteSqlInterpolatedAsync($\"DELETE FROM Customers WHERE Id = {id}\");\n```",
        options: [
          "Nothing.",
          "It bypasses the soft-delete query filter and any audit logic that lives on `SaveChanges`, hard-deleting the row outside the application's normal flow.",
          "It is illegal syntax.",
          "`ExecuteSqlInterpolatedAsync` is unsafe.",
        ],
        correctAnswer:
          "It bypasses the soft-delete query filter and any audit logic that lives on `SaveChanges`, hard-deleting the row outside the application's normal flow.",
        explanation:
          "Raw SQL routes around all the safety nets the application carefully set up. Use it deliberately.",
      },
      {
        kind: "interview",
        question:
          "When is a hard delete the correct choice?",
        options: [
          "Always.",
          "When the law requires removal (right-to-be-forgotten, retention limits) or when the data has no business value once deleted.",
          "Never.",
          "When the row is small.",
        ],
        correctAnswer:
          "When the law requires removal (right-to-be-forgotten, retention limits) or when the data has no business value once deleted.",
        explanation:
          "Compliance trumps recovery: GDPR-style requirements may mandate hard delete.",
      },
    ],
  },

  select: {
    whyItMatters:
      "Most queries are reads. Knowing how to project, join, and aggregate efficiently is what makes endpoints fast and dashboards practical.",
    simpleExplanation:
      "`SELECT` reads rows from one or more tables. You choose the columns, the filter, the order, and the limit.",
    deepExplanation:
      "Three habits separate good reads from bad: project only the columns you need (`SELECT a.Id, a.Name` not `SELECT *`), filter at the database (`WHERE` clause) rather than in memory, and use joins or subqueries with intention. In EF Core, `Select` on a `LINQ` query controls projection — without it, EF materialises the full entity, which can fetch ten times more data than you need.",
    realWorldUsage:
      "`_db.Orders.Where(o => o.Status == \"Confirmed\").Select(o => new OrderSummary(o.Id, o.Total)).ToList()` returns lean DTOs straight from the database.",
    explainLikeBeginner:
      "SELECT is asking 'show me these columns where this is true'. Pick less, get less.",
    interviewAnswer:
      "`SELECT` reads rows. We project to the smallest shape the caller needs, filter at the database, and avoid materialising full entities when only a few fields are required. In EF Core that means using `Select(o => new SomeDto(...))` rather than fetching the entity.",
    commonMistakes: [
      "`SELECT *` followed by mapping in C# — slower and noisier than projecting on the server.",
      "Filtering in memory (`ToList().Where(...)`) instead of in SQL.",
      "Forgetting to await `ToListAsync` and seeing it block synchronously.",
    ],
    bestPractices: [
      "Project to DTOs in the LINQ query.",
      "Compose filters as `IQueryable` before materialising.",
      "Use `AsNoTracking()` for read-only queries to skip change tracking.",
    ],
    summary: [
      "Read narrowly: project the columns you need.",
      "Filter at the database, not in memory.",
      "`AsNoTracking()` for read-only paths.",
    ],
    codeExample: {
      title: "EF Core projection to DTO",
      code: `var summaries = await _db.Orders
    .AsNoTracking()
    .Where(o => o.Status == "Confirmed")
    .OrderByDescending(o => o.CreatedAt)
    .Take(20)
    .Select(o => new OrderSummary(o.Id, o.CustomerId, o.Total))
    .ToListAsync();`,
      output: `Generated SQL: SELECT TOP 20 o.Id, o.CustomerId, o.Total
FROM Orders o WHERE o.Status = N'Confirmed' ORDER BY o.CreatedAt DESC`,
      walkthrough: [
        "`AsNoTracking` skips EF Core change tracking — fewer allocations on reads.",
        "`Select` projects to the small DTO; SQL Server reads only those columns.",
        "`Take(20)` lands as `SELECT TOP 20` — paging at the database.",
      ],
    },
    practice: {
      prompt:
        "Build a `GetCustomerOrdersSummary(customerId, pageSize)` method that projects to `OrderSummary(Id, Status, Total)` and returns the most recent N orders. Verify by inspecting the generated SQL.",
      expectedResult:
        "The SQL projects only three columns and uses `TOP n`.",
      hints: [
        "Use `Select(new OrderSummary(...))` in LINQ.",
        "Use `AsNoTracking()`.",
        "Inspect SQL with `.ToQueryString()`.",
      ],
      solution:
        "Projection turns a 'fetch the entity' query into a 'fetch what we need' query. On wide tables the difference is dramatic.",
    },
    quiz: [
      {
        kind: "concept",
        question: "Why prefer `.Select(o => new OrderSummary(...))` over fetching the entity?",
        options: [
          "It is style.",
          "It produces SQL that reads only the columns you need; less data over the wire, less memory used.",
          "It is required for `ToList`.",
          "There is no difference.",
        ],
        correctAnswer:
          "It produces SQL that reads only the columns you need; less data over the wire, less memory used.",
        explanation:
          "Projection turns a 'select *' into a 'select a, b, c'. The savings scale with table width.",
      },
      {
        kind: "code-reading",
        question:
          "What does `AsNoTracking()` change about the example query?",
        options: [
          "It hides the rows from other queries.",
          "It tells EF Core not to track returned entities for change detection, reducing memory overhead on read-only paths.",
          "It executes the query synchronously.",
          "It disables filtering.",
        ],
        correctAnswer:
          "It tells EF Core not to track returned entities for change detection, reducing memory overhead on read-only paths.",
        explanation:
          "Change tracking has a cost. If you do not intend to update the results, skip it.",
      },
      {
        kind: "spot-the-bug",
        question:
          "Why is this slow?\n```csharp\nvar orders = (await _db.Orders.ToListAsync())\n    .Where(o => o.Status == \"Confirmed\")\n    .ToList();\n```",
        options: [
          "Nothing.",
          "`ToListAsync()` pulls every row into memory; the `Where` then runs in C# — the database does no filtering.",
          "`ToList()` cannot follow `ToListAsync()`.",
          "`Status` is not a column.",
        ],
        correctAnswer:
          "`ToListAsync()` pulls every row into memory; the `Where` then runs in C# — the database does no filtering.",
        explanation:
          "Compose filters on `IQueryable` before materialising. The example fetches the whole table to find a few rows.",
      },
      {
        kind: "interview",
        question:
          "When would you NOT use `AsNoTracking()`?",
        options: [
          "When the query is read-only.",
          "When you intend to mutate the returned entities and save them — without tracking, EF Core does not detect changes.",
          "Always.",
          "Never.",
        ],
        correctAnswer:
          "When you intend to mutate the returned entities and save them — without tracking, EF Core does not detect changes.",
        explanation:
          "No-tracking is for reads only. Updates need the change tracker.",
      },
    ],
  },

  "ef-core-basics": {
    whyItMatters:
      "EF Core is the default ORM in .NET. Understanding the change tracker, query translation, and migrations is the daily toolkit for backend developers.",
    simpleExplanation:
      "EF Core maps C# classes to database tables and translates LINQ queries into SQL.",
    deepExplanation:
      "Three pillars to internalise. The `DbContext` is your unit of work; it holds the change tracker and the connection. `DbSet<T>` represents a table; LINQ over it composes into SQL. Migrations capture schema changes as code, applied in order via `dotnet ef database update`. Configure entities with conventions, attributes, or fluent API (`OnModelCreating`) — fluent is the most powerful and the recommended default at scale.",
    realWorldUsage:
      "An `AppDbContext` exposes `DbSet<Order>` and `DbSet<Customer>`. Services inject the context, query and mutate, then call `SaveChangesAsync` once per request.",
    explainLikeBeginner:
      "EF Core is the translator between your C# objects and SQL tables. You write `db.Orders.Where(...)` and it speaks SQL underneath.",
    interviewAnswer:
      "EF Core is Microsoft's ORM: it maps C# entities to tables, translates LINQ to SQL, tracks changes, and manages schema with migrations. We configure it via the fluent API, keep the `DbContext` scoped per request, and call `SaveChanges` once per logical unit of work.",
    commonMistakes: [
      "Using the `DbContext` as a singleton — it is not thread-safe and is meant to be scoped per request.",
      "Mixing change-tracking queries with `AsNoTracking()` queries without thinking about which is which.",
      "Forgetting to apply migrations and being surprised the schema is stale.",
    ],
    bestPractices: [
      "Register `DbContext` with `AddDbContext` so it is scoped per request.",
      "Configure entities in `OnModelCreating` with the fluent API.",
      "Run `dotnet ef migrations add` for every schema change; never hand-edit the database.",
    ],
    summary: [
      "DbContext = unit of work; scoped per request.",
      "LINQ → SQL via translation.",
      "Migrations are versioned schema changes.",
    ],
    codeExample: {
      title: "Minimal DbContext + service usage",
      code: `public class AppDbContext : DbContext
{
    public DbSet<Order> Orders => Set<Order>();
    public AppDbContext(DbContextOptions<AppDbContext> o) : base(o) { }

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<Order>().HasKey(o => o.Id);
        b.Entity<Order>().Property(o => o.Status).HasMaxLength(20).IsRequired();
    }
}

// Program.cs
builder.Services.AddDbContext<AppDbContext>(opts =>
    opts.UseSqlServer(builder.Configuration.GetConnectionString("Default")));`,
      output: "DbContext resolved per request from DI; queries and writes go through it.",
      walkthrough: [
        "`AppDbContext` exposes the tables and configures the model.",
        "`AddDbContext` registers it with scoped lifetime — one per request.",
        "Services inject `AppDbContext` via constructor.",
      ],
    },
    practice: {
      prompt:
        "Set up an EF Core context for `Product`. Add a migration, apply it, and seed three rows. Verify the inserted data via `SELECT *` (or LINQ).",
      expectedResult:
        "Migration runs cleanly; rows appear; you can query them back via LINQ.",
      hints: [
        "Use `dotnet ef migrations add Initial`.",
        "Use `dotnet ef database update`.",
        "Seed via `OnModelCreating` `HasData` or a startup hook.",
      ],
      solution:
        "Now you have the full loop: code change → migration → apply → query. The same cycle scales to production.",
    },
    quiz: [
      {
        kind: "concept",
        question:
          "What lifetime should `DbContext` typically have in an ASP.NET Core app?",
        options: [
          "Singleton.",
          "Scoped — one instance per HTTP request.",
          "Transient — one per call.",
          "It does not matter.",
        ],
        correctAnswer:
          "Scoped — one instance per HTTP request.",
        explanation:
          "`AddDbContext` registers as scoped by default. Singletons are unsafe; transients defeat the change tracker.",
      },
      {
        kind: "code-reading",
        question:
          "What does `b.Entity<Order>().Property(o => o.Status).HasMaxLength(20).IsRequired()` produce in SQL?",
        options: [
          "`Status nvarchar(20) NOT NULL`.",
          "`Status nvarchar(max) NULL`.",
          "`Status text`.",
          "Nothing — fluent config is C# only.",
        ],
        correctAnswer: "`Status nvarchar(20) NOT NULL`.",
        explanation:
          "Fluent configuration drives the generated DDL.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What problem is this?\n```csharp\nbuilder.Services.AddSingleton<AppDbContext>(); // not AddDbContext\n```",
        options: [
          "Nothing.",
          "`DbContext` is not thread-safe and is designed to be scoped; making it a singleton causes concurrent-access bugs.",
          "`AddSingleton` does not exist.",
          "It is the same as `AddDbContext`.",
        ],
        correctAnswer:
          "`DbContext` is not thread-safe and is designed to be scoped; making it a singleton causes concurrent-access bugs.",
        explanation:
          "Use `AddDbContext` for scoped lifetime and pooled connections.",
      },
      {
        kind: "interview",
        question:
          "How would you investigate the SQL EF Core generates for a query?",
        options: [
          "Read the code very carefully.",
          "Call `.ToQueryString()` on the `IQueryable`, or enable EF Core logging with parameter values to see the actual SQL on the wire.",
          "Profile the application.",
          "Restart the database.",
        ],
        correctAnswer:
          "Call `.ToQueryString()` on the `IQueryable`, or enable EF Core logging with parameter values to see the actual SQL on the wire.",
        explanation:
          "Reading the generated SQL is how you confirm assumptions and diagnose performance.",
      },
    ],
  },

  dbcontext: {
    whyItMatters:
      "DbContext is the unit-of-work in EF Core. Mis-handling its lifetime, concurrency, or transaction scope is the source of most EF Core bugs.",
    simpleExplanation:
      "A `DbContext` represents a session with the database: it holds the change tracker, the connection, and your `DbSet<T>` properties.",
    deepExplanation:
      "Three rules of thumb. (1) Scope it per request — `AddDbContext` does this. (2) Treat it as a unit of work — accumulate changes, call `SaveChangesAsync` once. (3) Do not pass it across threads. For background work, prefer `IDbContextFactory<TContext>` to create a fresh context per operation.",
    realWorldUsage:
      "A controller injects `AppDbContext`; the action loads, mutates, and calls `SaveChangesAsync` once before returning. A background `IHostedService` uses an `IDbContextFactory` because there is no request scope.",
    explainLikeBeginner:
      "DbContext is the open notebook on the database. You write a few changes, save once, and close it.",
    interviewAnswer:
      "`DbContext` is EF Core's unit of work and session boundary. We scope it per HTTP request, accumulate changes via the change tracker, and persist them with a single `SaveChangesAsync`. For background work we use `IDbContextFactory` to avoid sharing a context across threads.",
    commonMistakes: [
      "Sharing a `DbContext` across `await` points that move between threads (rare in ASP.NET Core but possible).",
      "Calling `SaveChangesAsync` inside a loop — multiplying round-trips.",
      "Holding the same `DbContext` for the lifetime of a background service.",
    ],
    bestPractices: [
      "One `DbContext` per request, scoped via DI.",
      "One `SaveChangesAsync` per logical unit of work.",
      "Use `IDbContextFactory` for background jobs.",
    ],
    summary: [
      "DbContext = session + unit of work.",
      "Scoped per request.",
      "Background jobs need a factory, not the scoped instance.",
    ],
    codeExample: {
      title: "Factory for background work",
      code: `// Program.cs
builder.Services.AddDbContextFactory<AppDbContext>(opts =>
    opts.UseSqlServer(connectionString));

public class OrderArchiver : BackgroundService
{
    private readonly IDbContextFactory<AppDbContext> _factory;
    public OrderArchiver(IDbContextFactory<AppDbContext> f) => _factory = f;

    protected override async Task ExecuteAsync(CancellationToken ct)
    {
        while (!ct.IsCancellationRequested)
        {
            using var db = _factory.CreateDbContext();
            // ... do work, SaveChanges, dispose ...
            await Task.Delay(TimeSpan.FromMinutes(5), ct);
        }
    }
}`,
      output: "Background work uses its own DbContext per iteration, never shares the scoped one.",
      walkthrough: [
        "`AddDbContextFactory` registers a thread-safe factory.",
        "Background services resolve a context per iteration.",
        "`using` ensures it is disposed promptly.",
      ],
    },
    practice: {
      prompt:
        "Write a `BackgroundService` that wakes up every minute, queries pending orders, and marks them as processed. Use `IDbContextFactory` rather than injecting `AppDbContext` directly.",
      expectedResult:
        "The service runs without lifetime mismatches and never leaks a context.",
      hints: [
        "Inject `IDbContextFactory<AppDbContext>`.",
        "Create and dispose per iteration.",
        "Honour the cancellation token in the loop.",
      ],
      solution:
        "Background services and request-scoped contexts are different beasts. The factory pattern keeps them apart cleanly.",
    },
    quiz: [
      {
        kind: "concept",
        question:
          "What pattern does EF Core's `DbContext` model directly?",
        options: [
          "Singleton.",
          "Unit of work — accumulate changes, commit atomically.",
          "Strategy.",
          "Adapter.",
        ],
        correctAnswer:
          "Unit of work — accumulate changes, commit atomically.",
        explanation:
          "The change tracker queues changes; `SaveChanges` flushes them in one transaction.",
      },
      {
        kind: "code-reading",
        question:
          "Why does `OrderArchiver` use `IDbContextFactory` instead of injecting `AppDbContext` directly?",
        options: [
          "Style.",
          "A `BackgroundService` is a singleton; the scoped `DbContext` lifetime would mismatch and the same instance would be shared across iterations.",
          "It is required by `BackgroundService`.",
          "Factories are faster.",
        ],
        correctAnswer:
          "A `BackgroundService` is a singleton; the scoped `DbContext` lifetime would mismatch and the same instance would be shared across iterations.",
        explanation:
          "Lifetime mismatch is the canonical reason to reach for the factory.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is wrong here?\n```csharp\nforeach (var c in customers) { c.Status = \"X\"; await _db.SaveChangesAsync(); }\n```",
        options: [
          "Nothing.",
          "It calls `SaveChangesAsync` per row, opening a transaction each time; batch the change-tracker writes by calling `SaveChangesAsync` once outside the loop.",
          "`SaveChangesAsync` cannot be inside a loop.",
          "`c.Status` is read-only.",
        ],
        correctAnswer:
          "It calls `SaveChangesAsync` per row, opening a transaction each time; batch the change-tracker writes by calling `SaveChangesAsync` once outside the loop.",
        explanation:
          "Save once at the end. The change tracker already batches the updates.",
      },
      {
        kind: "interview",
        question:
          "What does it mean to say `DbContext` is 'not thread-safe'?",
        options: [
          "It cannot be used in async code.",
          "Concurrent access from multiple threads can corrupt the internal state of the change tracker; one logical operation must run on one thread at a time.",
          "It uses too much memory.",
          "It cannot be disposed.",
        ],
        correctAnswer:
          "Concurrent access from multiple threads can corrupt the internal state of the change tracker; one logical operation must run on one thread at a time.",
        explanation:
          "Use one context per operation, dispose promptly, and never share across parallel work.",
      },
    ],
  },

  migrations: {
    whyItMatters:
      "Migrations are version control for your schema. Without them, every environment drifts and 'works on my machine' becomes a way of life.",
    simpleExplanation:
      "A migration is a code file describing how to change the schema (add a column, create a table). Running migrations applies those changes in order.",
    deepExplanation:
      "Each migration has `Up` (apply) and `Down` (revert) methods generated from your model changes. Migrations are checked into source control with their snapshot of the model. The flow: change the entity → `dotnet ef migrations add Name` → review the generated SQL → `dotnet ef database update` (or apply at startup). Never edit applied migrations — add a new one.",
    realWorldUsage:
      "`dotnet ef migrations add AddCustomerEmailIndex` then `dotnet ef database update` adds a unique index on `Customers.Email` in every environment as part of deployment.",
    explainLikeBeginner:
      "Migrations are a list of changes the database has agreed to. You ship them with the code so every environment ends up identical.",
    interviewAnswer:
      "Migrations are version-controlled descriptions of schema changes. We add one per logical change, review the generated SQL, commit it, and apply it in CI/CD so every environment moves through the same sequence of states.",
    commonMistakes: [
      "Editing an applied migration — different environments now have different histories.",
      "Skipping the review step and pushing a migration that includes accidental drops.",
      "Running `dotnet ef database update` against production from a developer machine.",
    ],
    bestPractices: [
      "One migration per logical change with a descriptive name.",
      "Review the generated SQL before committing.",
      "Apply migrations from the deployment pipeline, not from local machines, in production.",
    ],
    summary: [
      "Migrations version your schema.",
      "Add → review → commit → apply.",
      "Never edit an applied migration.",
    ],
    codeExample: {
      title: "A small migration",
      code: `dotnet ef migrations add AddCustomerEmailIndex
dotnet ef database update

// generated migration
public partial class AddCustomerEmailIndex : Migration
{
    protected override void Up(MigrationBuilder mb) =>
        mb.CreateIndex("IX_Customers_Email", "Customers", "Email", unique: true);
    protected override void Down(MigrationBuilder mb) =>
        mb.DropIndex("IX_Customers_Email", "Customers");
}`,
      output: "Index applied: IX_Customers_Email; reversible via Down.",
      walkthrough: [
        "`add` generates the migration; `update` applies it.",
        "Both `Up` and `Down` are explicit, making rollback possible.",
        "The migration file is checked into source control.",
      ],
    },
    practice: {
      prompt:
        "Add a `IsArchived` boolean to `Product`, generate a migration, review it, and apply it. Then write a follow-up migration that backfills `IsArchived = 0` for existing rows.",
      expectedResult:
        "Two migrations applied in sequence; the schema is consistent and the data is non-null.",
      hints: [
        "Use a default value to avoid `NOT NULL` violation on existing rows.",
        "Inspect the generated SQL.",
        "Test the `Down` migration in a scratch database.",
      ],
      solution:
        "Migrations + a small data-fix migration is the safe pattern for non-trivial column additions.",
    },
    quiz: [
      {
        kind: "concept",
        question: "Why must you never edit an applied migration?",
        options: [
          "Editing is forbidden by the compiler.",
          "Once a migration is applied in any environment, changing its `Up` method makes other environments diverge — apply a new migration instead.",
          "Editing is encouraged.",
          "Migrations are not files.",
        ],
        correctAnswer:
          "Once a migration is applied in any environment, changing its `Up` method makes other environments diverge — apply a new migration instead.",
        explanation:
          "Migrations are a forward-only history; corrections come as new entries.",
      },
      {
        kind: "code-reading",
        question:
          "What does `mb.CreateIndex(..., unique: true)` produce in the schema?",
        options: [
          "A column.",
          "A unique index that prevents duplicate `Email` values at the database level.",
          "A foreign key.",
          "Nothing.",
        ],
        correctAnswer:
          "A unique index that prevents duplicate `Email` values at the database level.",
        explanation:
          "Unique indexes are enforced by the database; the application cannot bypass them by accident.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is wrong with this deployment step?\n```\ndotnet ef database update --connection \"...\" -- on a developer machine, against prod\n```",
        options: [
          "Nothing.",
          "Running ad-hoc updates against production from a developer machine bypasses CI/CD, leaves no audit trail, and is prone to running outdated migrations.",
          "`update` does not exist.",
          "Migrations cannot target prod.",
        ],
        correctAnswer:
          "Running ad-hoc updates against production from a developer machine bypasses CI/CD, leaves no audit trail, and is prone to running outdated migrations.",
        explanation:
          "Apply migrations from a deployment pipeline that is reviewed, repeatable, and logged.",
      },
      {
        kind: "interview",
        question:
          "How would you handle a migration that needs to add a non-nullable column to an existing table?",
        options: [
          "Add it directly and hope.",
          "Add the column as nullable with a default first, backfill the data in a follow-up step, then make it non-nullable in a third migration — to keep each step reversible.",
          "Drop the table and recreate it.",
          "Skip the migration.",
        ],
        correctAnswer:
          "Add the column as nullable with a default first, backfill the data in a follow-up step, then make it non-nullable in a third migration — to keep each step reversible.",
        explanation:
          "Multi-step migrations let you keep production safe through the change.",
      },
    ],
  },

  "repository-pattern-with-database": {
    whyItMatters:
      "A repository wraps EF Core so services can be tested without spinning up a database. It also acts as the seam where you can swap or supplement persistence.",
    simpleExplanation:
      "A repository is an interface plus an implementation that exposes domain-shaped methods (`GetByIdAsync`, `SaveAsync`) and hides the ORM.",
    deepExplanation:
      "The pattern earns its keep when (1) you want to fake persistence in unit tests, (2) you need to swap or add a second store, or (3) you want to centralise query shapes. The argument against it is duplication of `DbContext` — that is fair for tiny apps. For anything beyond a single feature, the repository abstraction usually pays back.",
    realWorldUsage:
      "`IOrderRepository` exposes `Task<Order?> FindAsync(Guid id)` and `Task SaveAsync(Order order)`. The EF implementation uses `DbContext`; the test implementation uses a dictionary.",
    explainLikeBeginner:
      "A repository is the librarian. You ask 'do you have book X?'; they go find it. You do not walk into the stacks yourself.",
    interviewAnswer:
      "The repository pattern wraps a persistence mechanism behind a domain-shaped interface. We use it to keep services depending on domain language and to enable in-memory fakes for unit tests, while EF Core handles the real implementation.",
    commonMistakes: [
      "Building a generic repository (`IRepository<T>`) that mirrors EF Core — adds indirection without abstracting anything.",
      "Leaking `IQueryable<T>` out of the repository, exposing the ORM through the abstraction.",
      "Skipping the repository because the project is 'small enough' and finding tests impossible later.",
    ],
    bestPractices: [
      "Build one repository per aggregate or entity, with methods named after the operation.",
      "Return materialised types (entities, DTOs), not `IQueryable`.",
      "Provide a memory-backed implementation for tests.",
    ],
    summary: [
      "Repositories are seams between services and persistence.",
      "Domain-shaped methods, not CRUD primitives.",
      "Memory fakes power fast unit tests.",
    ],
    codeExample: {
      title: "Repository + EF Core + in-memory fake",
      code: `public interface IOrderRepository
{
    Task<Order?> FindAsync(Guid id);
    Task SaveAsync(Order order);
}

public sealed class EfOrderRepository(AppDbContext db) : IOrderRepository
{
    public Task<Order?> FindAsync(Guid id) =>
        db.Orders.FirstOrDefaultAsync(o => o.Id == id);

    public async Task SaveAsync(Order order)
    {
        db.Orders.Update(order);
        await db.SaveChangesAsync();
    }
}

// Test double
public sealed class InMemoryOrderRepository : IOrderRepository
{
    private readonly Dictionary<Guid, Order> _store = new();
    public Task<Order?> FindAsync(Guid id) => Task.FromResult(_store.GetValueOrDefault(id));
    public Task SaveAsync(Order order) { _store[order.Id] = order; return Task.CompletedTask; }
}`,
      output: "Service depends on IOrderRepository; production uses EF, tests use the dictionary.",
      walkthrough: [
        "The interface speaks the domain, not SQL.",
        "EF implementation handles real persistence.",
        "In-memory implementation makes service unit tests cheap.",
      ],
    },
    practice: {
      prompt:
        "Wrap an EF Core `Product` table behind `IProductRepository` with `FindAsync`, `ListAsync(filter)`, `SaveAsync`. Write a service that depends only on the interface; cover it with unit tests using an in-memory implementation.",
      expectedResult:
        "Service tests run in milliseconds without a database.",
      hints: [
        "Keep methods coarse — `ListAsync(filter)` instead of leaking `IQueryable`.",
        "Use the in-memory implementation in the test project only.",
        "Verify the EF implementation with an integration test.",
      ],
      solution:
        "Two implementations of one interface. The service is now testable in milliseconds; the integration test confirms the EF wiring works end-to-end.",
    },
    quiz: [
      {
        kind: "concept",
        question: "What is the main pay-off of the repository pattern in .NET?",
        options: [
          "Faster runtime queries.",
          "A seam where services depend on a domain-shaped interface, enabling in-memory fakes for tests and isolating the choice of ORM.",
          "Smaller deployment size.",
          "Required by EF Core.",
        ],
        correctAnswer:
          "A seam where services depend on a domain-shaped interface, enabling in-memory fakes for tests and isolating the choice of ORM.",
        explanation:
          "Testability and isolation are the genuine benefits — performance is unaffected.",
      },
      {
        kind: "code-reading",
        question:
          "Why does `IOrderRepository` return `Order?` instead of `IQueryable<Order>`?",
        options: [
          "Style.",
          "Returning `IQueryable` would leak the ORM through the abstraction, letting consumers build queries that bypass the repository's intent.",
          "`IQueryable` is illegal in interfaces.",
          "Performance.",
        ],
        correctAnswer:
          "Returning `IQueryable` would leak the ORM through the abstraction, letting consumers build queries that bypass the repository's intent.",
        explanation:
          "Materialise at the boundary; expose intent-bearing methods.",
      },
      {
        kind: "spot-the-bug",
        question:
          "What is wrong with this design?\n```csharp\npublic interface IRepository<T>\n{\n    IQueryable<T> Query();\n    void Add(T entity);\n    void Save();\n}\n```",
        options: [
          "Nothing.",
          "It mirrors EF Core 1:1 with `IQueryable` — adding ceremony but no abstraction. Consumers still need ORM knowledge to use it.",
          "Generics are illegal here.",
          "`Save` should be async.",
        ],
        correctAnswer:
          "It mirrors EF Core 1:1 with `IQueryable` — adding ceremony but no abstraction. Consumers still need ORM knowledge to use it.",
        explanation:
          "Build one repository per aggregate with domain-named methods; generic CRUD repositories are usually the wrong granularity.",
      },
      {
        kind: "interview",
        question:
          "When is the repository pattern overkill?",
        options: [
          "Never.",
          "In a tiny single-service application with one feature, where the abstraction has no test or swap to justify it.",
          "Always.",
          "When the database is large.",
        ],
        correctAnswer:
          "In a tiny single-service application with one feature, where the abstraction has no test or swap to justify it.",
        explanation:
          "Use it when you have at least two implementations (real + test) or a real plan to swap storage.",
      },
    ],
  },
};
