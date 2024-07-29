import { FastifyError, FastifyInstance, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';

/**
 * Error handler. When disabling default access logs via disableRequestLogging, Fastify also
 * removes the default error handler. Code copied from
 * https://github.com/fastify/fastify/blob/main/lib/error-handler.js
 */
export const errorHandler = fp(
  (app: FastifyInstance, _, done) => {
    app.setErrorHandler((error, _, reply) => {
      setErrorHeaders(error, reply);
      if (reply.statusCode === 200) {
        const statusCode = error.statusCode || error.status;
        reply.code(statusCode >= 400 ? statusCode : 500);
      }
      if (reply.statusCode >= 500) {
        reply.log.error(error, error?.message);
      }
      reply.send(error);
    });

    done();
  },
  { name: 'error-handler' },
);

function setErrorHeaders(error: FastifyError, reply: FastifyReply) {
  const res = reply.raw;
  let statusCode = res.statusCode;
  statusCode = statusCode >= 400 ? statusCode : 500;
  // treat undefined and null as same
  if (error != null) {
    if (error.headers !== undefined) {
      reply.headers(error.headers);
    }
    if (error.status >= 400) {
      statusCode = error.status;
    } else if (error.statusCode && error.statusCode >= 400) {
      statusCode = error.statusCode;
    }
  }
  res.statusCode = statusCode;
}
