import type { FastifyPlugin } from 'fastify';

import type { Contact } from './contact.repo.js';
import { create, deleteById, getById, list } from './contact.service.js';

interface ContactParams {
  id: string;
}

export const contactRouter: FastifyPlugin = (app, _, done) => {
  app.addSchema({
    $id: 'ContactParams',
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
    },
  });

  app.get('/v1/contacts', () => list());

  app.get<{ Params: ContactParams }>('/v1/contacts/:id', {
    schema: { params: { $ref: 'ContactParams' } },
    handler: async (request, reply) => {
      const contact = await getById(request.params.id);
      // Example of adding properties to request logs
      request.log = request.log.child({ contactId: request.params.id });
      if (contact) {
        return reply.send(contact);
      }
      return reply.status(404).send({ message: 'Contact not found', contactId: request.params.id });
    },
  });

  app.post('/v1/contacts', {
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

  app.delete<{ Params: ContactParams }>('/v1/contacts/:id', {
    schema: { params: { $ref: 'ContactParams' } },
    handler: async (request, reply) => {
      await deleteById(request.params.id);
      reply.status(204).send();
    },
  });

  done();
};
