import * as db from './contact.repo.js';
import type { Contact } from './contact.repo.js';

export class NotFoundError extends Error {}

export function create(contact: Pick<Contact, 'firstName' | 'lastName' | 'email'>) {
  return db.create(contact);
}

export function list() {
  return db.list();
}

export function getById(id: string) {
  return db.getById(id);
}

export function deleteById(id: string) {
  return db.deleteById(id);
}
