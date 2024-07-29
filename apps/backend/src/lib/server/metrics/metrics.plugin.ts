import { TPromsterOptions, plugin as promsterPlugin } from '@promster/fastify';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

/**
 * Metrics middleware that exposes metrics about the Node process and HTTP service.
 *
 * This also generates a route that has a default path of `/metrics`. Default options may be
 * overridden by passing in options specified by `@promster/fastify`.
 *
 * When reporting HTTP metrics, it is important to reduce metric cardinality for high-traffic
 * services.
 * @param app - Fastify instance.
 * @param options - Options to override defaults.
 */
export const metrics = fp(
  (app: FastifyInstance, options: TPromsterOptions = {}, done) => {
    // @ts-ignore the types are incorrect for skip from promster
    app.register(promsterPlugin, {
      normalizeMethod: (method: string) => method.toUpperCase(),
      // @ts-ignore the types are incorrect from p romster
      normalizePath,
      normalizeStatusCode,
      skip,
      ...options,
    });

    done();
  },
  { name: 'metrics' },
);

/**
 * Reduce cardinality by combining all 404 paths into a single metric.
 */
function normalizePath(path: string, context: { req: FastifyRequest; res: FastifyReply }): string {
  if (context.res.statusCode === 404) {
    return 'not-found';
  }
  return path;
}

/**
 * Reduce cardinality by combining successful status codes. E.g. 200, 201, 204 will be 2xx and 301,
 * 302 will be 3xx.
 */
function normalizeStatusCode(statusCode: number): number | string {
  if (statusCode >= 200 && statusCode < 300) {
    return '2xx';
  } else if (statusCode >= 300 && statusCode < 400) {
    return '3xx';
  }
  return statusCode;
}

/**
 * Skip meta health and version routes.
 */
function skip(req: FastifyRequest) {
  return req.url.match(/\/health$|\/version$/) !== null;
}
