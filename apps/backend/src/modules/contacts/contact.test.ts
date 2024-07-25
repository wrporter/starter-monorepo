import { getById } from './contact.repo';
import { createServer } from '../../app';

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

vi.mock('./contact.repo.js', () => ({
    create: vi
        .fn()
        .mockImplementation((contact) => Promise.resolve({ ...contact, ...createContactFields })),
    list: vi.fn().mockResolvedValue([]),
    getById: vi.fn().mockResolvedValue({ ...contact, ...createContactFields }),
    deleteById: vi.fn().mockResolvedValue(undefined),
}));

const app = createServer();

it('lists contacts', async () => {
    const response = await app.inject({
        method: 'GET',
        url: '/contacts',
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload)).toEqual([]);
});

describe('Create', () => {
    it('creates a contact', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/contacts',
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
            url: '/contacts',
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
            url: `/contacts/${id}`,
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
            url: `/contacts/${id}`,
            body: contact,
        });

        expect(response.statusCode).toBe(404);
        expect(JSON.parse(response.payload)).toMatchObject({
            message: `Contact id '${id}' does not exist`,
        });
    });
});

describe('Delete', () => {
    it('deletes a contact', async () => {
        const response = await app.inject({
            method: 'DELETE',
            url: `/contacts/${id}`,
            body: contact,
        });

        expect(response.statusCode).toBe(204);
    });
});
