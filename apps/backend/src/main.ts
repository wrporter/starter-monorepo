import { createServer } from './lib/server/server.js';
import { contactRouter } from './modules/contacts/contact.router.js';

const servicePrefix = '/contact-service';
const server = createServer({ pathPrefix: servicePrefix });

server.app.register(contactRouter, { prefix: servicePrefix });

// TODO: Add deep health check for dependencies (e.g. database)

await server.start(3000);
