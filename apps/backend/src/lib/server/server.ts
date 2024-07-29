import fastifyCompress from '@fastify/compress';
import { TPromsterOptions } from '@promster/fastify';
import { createServer as createMetricsServer } from '@promster/server';
import fastify, { FastifyInstance, FastifyServerOptions } from 'fastify';
import fastifyGracefulShutdown from 'fastify-graceful-shutdown';
import { v4 as uuidv4 } from 'uuid';

import { access } from './access/access.plugin.js';
import { errorHandler } from './error-handler/error-handler.plugin.js';
import { meta } from './meta/meta.plugin.js';
import { VersionMeta } from './meta/version.handler.js';
import { metrics } from './metrics/metrics.plugin.js';
import { log } from '../log.js';

/**
 * Creates a base server that can be customized for any service.
 * @example
 * ```typescript
 * const server = createServer({ pathPrefix: '/my-service' });
 * server.start(3000);
 * ```
 * @param options - {@link Options}
 */
export function createServer(options: Options = {}) {
  const server = new Server(options);
  server.init();
  return server;
}

/** Options to configure the server. */
export interface Options {
  /**
   * Time in milliseconds to allow connections to stay open before terminating them and stopping
   * the server. If no active connections exist, the server will stop immediately.
   * @default 5000
   * @see {@link Server.stop}
   */
  gracefulShutdownTimeout?: number;
  /**
   * Mount and customize the Express application. Useful for adding custom middleware, routes, etc.
   */
  mountApp?: (app: FastifyInstance) => void;
  /**
   * Service prefix to be used on routes such as the healthcheck.
   */
  pathPrefix?: string;
  versionMeta?: VersionMeta;
  /**
   * Options for configuring the Prometheus metrics exports. Straight pass-through to
   * [@promster/fastify](https://github.com/tdeekens/promster).
   */
  metricsOptions?: TPromsterOptions;

  fastifyOptions?: FastifyServerOptions;
}

/** Default options for the server when not provided. */
export const defaultServerOptions: Partial<Options> = {
  gracefulShutdownTimeout: 5000,
  pathPrefix: '',
};

export class Server {
  public app: FastifyInstance;

  private options: Options;

  constructor(options: Options = {}) {
    this.options = { ...defaultServerOptions, ...options };
    this.app = fastify({
      logger: log,
      disableRequestLogging: true,
      trustProxy: true,
      // TODO: Replace with OpenTelemetry tracing.
      genReqId: () => uuidv4(),
      requestIdLogLabel: 'requestId',
      ...this.options.fastifyOptions,
    });
  }

  public init() {
    this.app.register(fastifyCompress);
    this.app.register(meta, {
      pathPrefix: this.options.pathPrefix,
      versionMeta: this.options.versionMeta,
    });
    this.app.register(metrics, this.options.metricsOptions);
    this.app.register(access);

    this.app.register(errorHandler);

    this.app.decorateRequest('status', 'startup');

    // TODO: Replace this plugin. It stalls shutting down the server when there are no active
    // requests and waits for the timeout to complete. This happens if a single request has been
    // executed successfully.
    this.app.register(fastifyGracefulShutdown, { timeout: this.options.gracefulShutdownTimeout });
    this.app.after(() =>
      this.app.gracefulShutdown((signal) => {
        this.app.log.info(`Received signal to shutdown: ${signal}`);
      }),
    );
  }

  /**
   * Starts the main and metrics HTTP servers.
   * @param port - The port to start the main app.
   * @param metricsPort - The port to start the metrics app (default 22500).
   */
  async start(port: number, metricsPort = 22500) {
    const metricsServer = await createMetricsServer({
      hostname: '0.0.0.0',
      port: 22500,
    });
    this.app.log.info(`📊 Metrics server listening at http://localhost:22500`);
    this.app.addHook('onClose', () => metricsServer.close());

    this.app.listen(
      {
        host: '0.0.0.0',
        port,
        listenTextResolver: (address) => `🚀 Server listening at ${address}`,
      },
      (error, address) => {
        if (error) {
          this.app.log.error(error, 'Failed to start server');
          process.exit(1);
        }
        this.app.status = 'ok';
      },
    );
  }
}
