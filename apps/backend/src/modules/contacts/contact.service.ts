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

export function getByEmail(email: string) {
    return pipe(
        Effect.tryPromise(() => db.getByEmail(email)),
        Effect.flatMap((contact) => {
            if (contact) {
                return Effect.succeed(contact);
            }
            return Effect.fail(new NotFoundError(`Contact email '${email}' does not exist`));
        }),
    );
}
