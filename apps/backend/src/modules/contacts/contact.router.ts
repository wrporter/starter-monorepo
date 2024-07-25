import { Effect } from 'effect';
import type { FastifyInstance } from 'fastify';

import type { Contact } from './contact.repo.js';
import { create, deleteById, getById, list } from './contact.service.js';

interface ContactParams {
    id: string;
}

export async function contactRouter(fastify: FastifyInstance) {
    fastify.addSchema({
        $id: 'ContactParams',
        type: 'object',
        properties: {
            id: { type: 'string', format: 'uuid' },
        },
    });

    fastify.get('/contacts', () => list());

    fastify.get<{ Params: ContactParams }>('/contacts/:id', {
        schema: { params: { $ref: 'ContactParams' } },
        handler: async (request, reply) => {
            // TODO: Unwrap unexpected errors from Effect to know the cause. E.g.
            //  database connection failure.
            await Effect.runPromise(
                Effect.match(getById(request.params.id), {
                    onSuccess: (contact) => reply.send(contact),
                    onFailure: (error) => {
                        if (error._tag === 'NotFoundError') {
                            reply.status(404).send({ message: error.message });
                        }
                    },
                }),
            );
        },
    });

    fastify.post('/contacts', {
        schema: {
            body: {
                type: 'object',
                required: ['email', 'firstName', 'lastName'],
                properties: {
                    firstName: { type: 'string', minLength: 1, maxLength: 25 },
                    lastName: { type: 'string', minLength: 1, maxLength: 25 },
                    email: { type: 'string', format: 'email', minLength: 1, maxLength: 25 },
                },
            },
        },
        handler: async (request, reply) => {
            const contact = await create(request.body as Contact);
            reply.status(201).send(contact);
        },
    });

    fastify.delete<{ Params: ContactParams }>('/contacts/:id', {
        schema: { params: { $ref: 'ContactParams' } },
        handler: async (request, reply) => {
            // TODO: Unwrap unexpected errors from Effect to know the cause. E.g.
            //  database connection failure.
            await Effect.runPromise(deleteById(request.params.id));
            reply.status(204).send();
        },
    });
}
