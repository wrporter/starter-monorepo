import { Effect, pipe } from 'effect';

import * as db from './contact.repo.js';
import type { Contact } from './contact.repo.js';

export class NotFoundError extends Error {
    readonly _tag = 'NotFoundError';
}

export function create(contact: Pick<Contact, 'firstName' | 'lastName' | 'email'>) {
    return db.create(contact);
}

export function list() {
    return db.list();
}

export function getById(id: string) {
    return pipe(
        Effect.tryPromise(() => db.getById(id)),
        Effect.flatMap((contact) => {
            if (contact) {
                return Effect.succeed(contact);
            }
            return Effect.fail(new NotFoundError(`Contact id '${id}' does not exist`));
        }),
    );
}

export function deleteById(id: string) {
    return Effect.tryPromise(() => db.deleteById(id));
}
