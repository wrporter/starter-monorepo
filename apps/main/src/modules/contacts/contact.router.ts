import type { FastifyInstance } from 'fastify';

import type { Contact } from './contact.service';
import { create, list } from './contact.service';

export async function contactRouter(fastify: FastifyInstance) {
    fastify.get('/contacts', () => list());
    fastify.post('/contacts', async (request, reply) => {
        const contact = await create(request.body as Contact);
        reply.status(201).send(contact);
    });
}
