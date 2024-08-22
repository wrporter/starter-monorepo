# Title

Author: Wesley Porter

Date: 2024-08-22

Status: proposed

## Context

One area the JavaScript ecosystem has performed well on is database object-relational mapping (ORM) libraries. Prisma is the most popular choice, but comes with the following drawbacks, primarily due to its abstractions.

- Prisma maintains its own schema, migration, and query language abstractions. While these abstractions are powerful for switching database technologies, such as Mongo to PostgreSQL, such a use case is not common and would require a significant amount of work to migrate the data. The abstraction layer also introduces a large learning curve and complexity for developers.
- Prisma does not provide the same amount of control over migrations and queries.
- Prisma makes it more challenging to optimize queries for performance. By default, all relational data is fetched. This can easily lead to performance issues as data scales.

Drizzle is a new ORM that aims to provide a more developer-friendly experience with less abstraction. It is lightweight, type-safe, and is a great fit for SQL databases. Its migrations are vanilla SQL, which makes it easier to understand and control. It also provides a query builder that allows for more control over the queries that are executed.

## Decision

Use Drizzle ORM for database interactions.

## Consequences

Although Drizzle is gaining rapid adoption, it is a new project and may not have the same level of community support as Prisma. However, we believe that the tradeoffs are worth it for the lower learning curve and increased control over database interactions. Due to Drizzle's vanilla-like approach, it will also be easier to replace if needed in the future.

If a project requires a NoSQL database, we will evaluate the best tool for the job at that time. Drizzle does not support NoSQL databases.
