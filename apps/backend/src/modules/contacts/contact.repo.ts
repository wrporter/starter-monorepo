/* v8 ignore start */
import { contacts } from '@repo/db-schema';
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

export async function getById(id: string): Promise<Contact | undefined> {
  return db
    .select()
    .from(contacts)
    .where(eq(contacts.id, id))
    .limit(1)
    .then((list) => list[0]);
}

export async function deleteById(id: string): Promise<void> {
  await db.delete(contacts).where(eq(contacts.id, id));
}
