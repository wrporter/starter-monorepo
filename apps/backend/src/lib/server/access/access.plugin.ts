import { performance } from 'node:perf_hooks';

import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

export const access = fp(
  (app: FastifyInstance, _, done) => {
    app.decorateRequest('startTime', 0);

    app.addHook('onRequest', (req, _, done) => {
      req.startTime = performance.now();
      done();
    });

    app.addHook('onResponse', (req, reply, done) => {
      const duration = Math.trunc(performance.now() - req.startTime);
      const requestSize = req.headers['content-length'];
      const bytesIn = requestSize ? parseInt(requestSize, 10) : undefined;
      const responseSizeHeader = reply.raw.getHeader('content-length');
      const responseSize = Array.isArray(responseSizeHeader)
        ? responseSizeHeader[0]
        : responseSizeHeader;
      const bytesOut = responseSize ? parseInt(responseSize.toString(), 10) : undefined;

      req.log.access({
        url: req.originalUrl,
        status: reply.statusCode,
        duration,

        method: req.method,
        userAgent: req.headers['user-agent'],
        clientIp: req.ip,

        bytesIn,
        bytesOut,
        referrer: req.headers.referer || req.headers.referrer,
        xForwardedFor: req.headers['x-forwarded-for'],
      });

      done();
    });

    done();
  },
  { name: 'access' },
);
