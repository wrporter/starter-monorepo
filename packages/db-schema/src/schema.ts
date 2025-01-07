import { index, pgTable, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core';

export const contacts = pgTable(
  'contacts',
  {
    id: uuid().primaryKey().notNull().defaultRandom(),
    email: varchar({ length: 40 }).notNull(),
    firstName: varchar({ length: 20 }).notNull(),
    lastName: varchar({ length: 20 }).notNull(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
  },
  (table) => ({
    emailIndex: uniqueIndex().on(table.email),
    firstNameIndex: index().on(table.firstName),
    lastNameIndex: index().on(table.lastName),
  }),
);
