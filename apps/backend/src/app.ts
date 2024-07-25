import fastify, { type FastifyServerOptions } from 'fastify';
import fastifyGracefulShutdown from 'fastify-graceful-shutdown';

import { contactRouter } from './modules/contacts/contact.router.js';

export function createServer(options?: FastifyServerOptions) {
    const app = fastify(options);

    app.get('/health', () => 'ok');
    app.get('/version', () => ({
        id: process.env.APP_ID ?? '',
        branch: process.env.BUILD_BRANCH ?? '',
        sha: process.env.BUILD_SHA ?? '',
        version: process.env.BUILD_VERSION ?? '',
        buildDate: process.env.BUILD_DATE ?? '',
    }));

    app.register(contactRouter);

    app.register(fastifyGracefulShutdown);
    app.after(() => {
        app.gracefulShutdown((signal) => {
            app.log.info('Received signal to shutdown: %s', signal);
        });
    });

    return app;
}
