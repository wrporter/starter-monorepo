import fastify from 'fastify';

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

const server = fastify({ logger: envToLogger[process.env.NODE_ENV as keyof typeof envToLogger] });

server.get('/ping', async () => 'pong\n');

server.listen({ port: 8080 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
