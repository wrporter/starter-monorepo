import { contacts } from '@repo/database';

import { db } from '../../db';

export type Contact = typeof contacts.$inferInsert;

export function create(contact: Pick<Contact, 'firstName' | 'lastName' | 'email'>) {
    return db.insert(contacts).values(contact).returning();
}

export function list() {
    return db.select().from(contacts);
}
