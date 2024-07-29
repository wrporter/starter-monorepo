import fastify from 'fastify';

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

const app = fastify();
app.register(contactRouter);
afterAll(() => app.close());

it('lists contacts', async () => {
  const response = await app.inject({
    method: 'GET',
    url: '/v1/contacts',
  });

  expect(response.statusCode).toBe(200);
  expect(JSON.parse(response.payload)).toEqual([]);
});

describe('Create', () => {
  it('creates a contact', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/v1/contacts',
      body: contact,
    });

    expect(response.statusCode).toBe(201);
    expect(JSON.parse(response.payload)).toMatchObject({
      ...contact,
      id: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('requires a properly formatted email address', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/v1/contacts',
      body: { ...contact, email: 'invalid-email' },
    });

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.payload)).toEqual({
      code: 'FST_ERR_VALIDATION',
      error: 'Bad Request',
      message: 'body/email must match format "email"',
      statusCode: 400,
    });
  });
});

describe('Get', () => {
  it('gets a contact', async () => {
    const response = await app.inject({
      method: 'GET',
      url: `/v1/contacts/${id}`,
      body: contact,
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload)).toMatchObject({
      ...contact,
      ...createContactFields,
    });
  });

  it('returns a 404 when the contact is not found', async () => {
    vi.mocked(getById).mockResolvedValue(undefined);

    const response = await app.inject({
      method: 'GET',
      url: `/v1/contacts/${id}`,
      body: contact,
    });

    expect(response.statusCode).toBe(404);
    expect(JSON.parse(response.payload)).toMatchObject({
      message: `Contact not found`,
      contactId: id,
    });
  });
});

describe('Delete', () => {
  it('deletes a contact', async () => {
    const response = await app.inject({
      method: 'DELETE',
      url: `/v1/contacts/${id}`,
      body: contact,
    });

    expect(response.statusCode).toBe(204);
  });
});
