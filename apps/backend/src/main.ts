import Fastify from 'fastify';
import fastifyGracefulShutdown from 'fastify-graceful-shutdown';

import { contactRouter } from './modules/contacts/contact.router.js';

const envToLogger = {
    development: {
        transport: {
            target: 'pino-pretty',
            options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
            },
        },
    },
    production: true,
    test: false,
};

const fastify = Fastify({ logger: envToLogger[(process.env.NODE_ENV as keyof typeof envToLogger) ?? 'development'] });

fastify.get('/health', () => 'ok');
fastify.get('/version', () => ({
    id: process.env.APP_ID ?? '',
    branch: process.env.BUILD_BRANCH ?? '',
    sha: process.env.BUILD_SHA ?? '',
    version: process.env.BUILD_VERSION ?? '',
    buildDate: process.env.BUILD_DATE ?? '',
}));
fastify.register(contactRouter);

fastify.register(fastifyGracefulShutdown);
fastify.after(() => {
    fastify.gracefulShutdown((signal) => {
        fastify.log.info('Received signal to shutdown: %s', signal);
    });
});

fastify.listen({ host: '0.0.0.0', port: 3000 }, (err, address) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    fastify.log.info(`Server listening at ${address}`);
});
