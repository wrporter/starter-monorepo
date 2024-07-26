import { createServer } from './app.js';

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

const app = createServer({
  logger: envToLogger[(process.env.NODE_ENV as keyof typeof envToLogger) ?? 'development'],
});

app.listen({ host: '0.0.0.0', port: 3000 }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`Server listening at ${address}`);
});
