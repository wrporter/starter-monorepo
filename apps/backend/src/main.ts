import { createServer } from '@wesp-up/express';
import { Application } from 'express';

import { contactRouter } from './modules/contacts/contact.router.js';

const pathPrefix = '/contact-service';

const server = createServer({
  pathPrefix,
  mountApp(app: Application) {
    app.use(pathPrefix, contactRouter);
  },
});

server.start(3001, 22501);
