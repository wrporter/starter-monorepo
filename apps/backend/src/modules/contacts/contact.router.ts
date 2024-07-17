import { Effect } from 'effect';
import type { FastifyInstance } from 'fastify';

import type { Contact } from './contact.repo';
import { create, getByEmail, list } from './contact.service';

interface ContactParams {
    email: string;
}

export async function contactRouter(fastify: FastifyInstance) {
    fastify.get('/contacts', () => list());
    fastify.get<{ Params: ContactParams }>('/contacts/:email', (request, reply) => {
        Effect.runPromise(
            Effect.match(getByEmail(request.params.email), {
                onSuccess: (contact) => reply.send(contact),
                onFailure: (error) => {
                    if (error._tag === 'NotFoundError') {
                        reply.status(404).send({ message: error.message });
                    }
                },
            }),
        );
    });
    fastify.post('/contacts', async (request, reply) => {
        const contact = await create(request.body as Contact);
        reply.status(201).send(contact);
    });
}
