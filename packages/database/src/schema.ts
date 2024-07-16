import { index, pgTable, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core';

export const contacts = pgTable(
    'contacts',
    {
        id: uuid('id').primaryKey().notNull().defaultRandom(),
        email: varchar('email', { length: 40 }).notNull(),
        firstName: varchar('first_name', { length: 20 }).notNull(),
        lastName: varchar('last_name', { length: 20 }).notNull(),
        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at').notNull().defaultNow(),
    },
    (table) => ({
        emailIndex: uniqueIndex('email_index').on(table.email),
        firstNameIndex: index('first_name_index').on(table.firstName),
        lastNameIndex: index('last_name_index').on(table.lastName),
    }),
);
