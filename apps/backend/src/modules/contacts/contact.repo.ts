import { contacts } from '@repo/database';
import { eq } from 'drizzle-orm';

import { db } from '../../db.js';

type ContactRepo = typeof contacts.$inferInsert;
export interface Contact extends ContactRepo {}

export function create(contact: Pick<Contact, 'firstName' | 'lastName' | 'email'>) {
    return db.insert(contacts).values(contact).returning();
}

export function list() {
    return db.select().from(contacts);
}

export async function getByEmail(email: string): Promise<Contact | undefined> {
    return db
        .select()
        .from(contacts)
        .where(eq(contacts.email, email))
        .limit(1)
        .then((list) => list[0]);
}
