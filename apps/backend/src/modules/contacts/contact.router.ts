import express from 'express';

import type { Contact } from './contact.repo.js';
import { create, deleteById, getById, list } from './contact.service.js';

export const contactRouter = express();

contactRouter.get('/v1/contacts', (_, response, next) => {
  list()
    .then((contacts) => response.status(200).json(contacts))
    .catch(next);
});

contactRouter.get('/v1/contacts/:id', (request, response, next) => {
  getById(request.params.id)
    .then((contact) => {
      if (contact) {
        return response.json(contact);
      }
      return response
        .status(404)
        .json({ message: 'Contact not found', contactId: request.params.id });
    })
    .catch(next);
});

contactRouter.post('/v1/contacts', (request, response, next) => {
  console.log(request.body);
  create(request.body as Contact)
    .then((contact) => response.status(201).json(contact))
    .catch(next);
});

contactRouter.delete('/v1/contacts/:id', (request, response, next) => {
  deleteById(request.params.id)
    .then(() => response.status(204).send())
    .catch(next);
});
