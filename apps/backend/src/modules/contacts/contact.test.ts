import request from 'supertest';

import { getById } from './contact.repo.js';
import { contactRouter } from './contact.router.js';

const { id, contact, createContactFields } = vi.hoisted(() => {
  const id = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';
  const contact = { email: 'test@test.com', firstName: 'Luke', lastName: 'Skywalker' };
  const createContactFields = {
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return { id, contact, createContactFields };
});

vi.mock('./contact.repo', () => ({
  create: vi
    .fn()
    .mockImplementation((contact) => Promise.resolve({ ...contact, ...createContactFields })),
  list: vi.fn().mockResolvedValue([]),
  getById: vi.fn().mockResolvedValue({ ...contact, ...createContactFields }),
  deleteById: vi.fn().mockResolvedValue(undefined),
}));

const app = request(contactRouter);

it('lists contacts', async () => {
  const response = await app.get('/v1/contacts');

  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual([]);
});

describe.skip('Create', () => {
  it('creates a contact', async () => {
    const response = await app
      .post('/v1/contacts')
      .send(contact)
      .set('Content-Type', 'application/json');

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        ...contact,
        id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      }),
    );
  });

  it('requires a properly formatted email address', async () => {
    const response = await app.post('/v1/contacts').send({ ...contact, email: 'invalid-email' });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      code: 'FST_ERR_VALIDATION',
      error: 'Bad Request',
      message: 'body/email must match format "email"',
      statusCode: 400,
    });
  });
});

describe('Get', () => {
  it('gets a contact', async () => {
    const response = await app.get(`/v1/contacts/${id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      ...contact,
      ...createContactFields,
    });
  });

  it('returns a 404 when the contact is not found', async () => {
    vi.mocked(getById).mockResolvedValue(undefined);

    const response = await app.get(`/v1/contacts/${id}`);

    expect(response.statusCode).toBe(404);
    expect(response.body).toMatchObject({
      message: `Contact not found`,
      contactId: id,
    });
  });
});

describe('Delete', () => {
  it('deletes a contact', async () => {
    const response = await app.delete(`/v1/contacts/${id}`);

    expect(response.statusCode).toBe(204);
  });
});
