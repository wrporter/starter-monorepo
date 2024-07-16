import Fastify from 'fastify';

import { contactRouter } from './modules/contacts/contact.router';

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

const fastify = Fastify({ logger: envToLogger[process.env.NODE_ENV as keyof typeof envToLogger] });

fastify.get('/health', () => 'ok');
fastify.register(contactRouter);

fastify.listen({ port: 3000 }, (err, address) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    fastify.log.info(`Server listening at ${address}`);
});
