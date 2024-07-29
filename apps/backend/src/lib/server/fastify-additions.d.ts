export {};

declare module 'fastify' {
  interface FastifyInstance {
    status: 'startup' | 'ok' | 'shutdown';
  }

  // Add custom properties
  interface FastifyRequest {
    startTime: number;
  }

  // Add properties that are used, but Fastify didn't add to type declarations
  interface FastifyError {
    headers?: Record<string, string>;
    status: number;
  }

  interface FastifyBaseLogger {
    access: FastifyLogFn;
  }
}
