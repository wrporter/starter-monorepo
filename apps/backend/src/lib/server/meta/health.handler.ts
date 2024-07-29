import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

/**
 * Health check route handler. It is recommended to place the route at the path `/<service
 * id>/healthcheck`.
 *
 * The route uses the {@link status} value to configure the response. If status is set to anything
 * except `ok` the status will be returned with a 503. If status is undefined, the service will
 * default to `ok`.
 */
export function healthHandler(this: FastifyInstance, _: FastifyRequest, reply: FastifyReply) {
  const status = this.status;
  const statusCode = status === 'ok' ? 200 : 503;
  reply.code(statusCode).send({ status });
}
