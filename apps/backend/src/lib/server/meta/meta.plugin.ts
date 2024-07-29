import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

import { healthHandler } from './health.handler.js';
import type { VersionMeta } from './version.handler.js';
import { createVersionHandler } from './version.handler.js';

/** Options for the {@link meta}. */
export interface MetaOptions {
  /** Path prefix for the router. Defaults to `''`. */
  pathPrefix?: string;
  /** Version information. Defaults to environment variables. */
  versionMeta?: VersionMeta;
}

/**
 * Router for meta routes, such as version and healthcheck.
 * @param app - Fastify instance.
 * @param options - {@link MetaOptions}
 */
export const meta = fp(
  (app: FastifyInstance, options: MetaOptions, done) => {
    const { pathPrefix = '', versionMeta } = options;

    app.get(`${pathPrefix}/healthcheck`, healthHandler);
    app.get(`${pathPrefix}/version`, createVersionHandler(versionMeta));

    done();
  },
  { name: 'meta' },
);
