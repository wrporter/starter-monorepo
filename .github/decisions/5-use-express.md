# Title

Author: Wesley Porter

Date: 2024-08-22

Status: proposed

## Context

There is debate about whether Express or Fastify should be used. Express is a more mature project with a larger community, whereas Fastify boasts 2x better performance. It's also important to note that Express hasn't seen much development for many years.

We built production-ready applications in both frameworks and found Express to come out on top.

1. Due to Express' maturity, there is a wider range of robust middleware available. Whereas, many of the available Fastify plugins seem to have been built for a specific use case without understanding broad usage. Examples:
   - Express' [express-prom-bundle](https://www.npmjs.com/package/express-prom-bundle) understands the [prom-client](https://www.npmjs.com/package/prom-client) model of a singleton and provides it as a peer-dependency. It also comes with necessary options to configure the metrics. Fastify's [fastify-metrics](https://www.npmjs.com/package/fastify-metrics) does not provide a similar experience and has a direct dependency on [prom-client](https://www.npmjs.com/package/prom-client), which causes issues when trying to provide custom metrics because the two clients will not share the same registry.
   - Fastify's [fastify-graceful-shutdown](https://www.npmjs.com/package/fastify-graceful-shutdown) merely waits a specified amount of time before shutting down the server. However, we want to shut down immediately if there are no in-flight requests and only terminate those requests if they exceed the time limit.
2. Fastify's TypeScript support is convoluted and difficult to work with. Several times, we found that the typings were incorrect or did not allow for composition. Although Express is also written in vanilla JavaScript with a Definitely Typed package on the side, it is far easier to work with.
3. Fastify seems to have made a lot of decisions that seem suboptimal for a general use case. For example, to customize access logs, we must set `disableRequestLogging` to `true`, but this came with a surprise that is mentioned only in passing that this also [removes the default error handler](https://github.com/fastify/fastify/issues/4173). We had to work around this by copying some of the Fastify code to provide our own error handler. This is especially not ideal because we don't have access to some tooling in the underlying Fastify code that we need to provide the best error handling experience, such as their symbols for common error responses. We'd need to copy wide swaths of their codebase to replicate the default error handler.
   - Fastify is tightly coupled to the [pino logger](https://getpino.io/#/) and its defaults. For example, if we want to remove the trace logging level, the server will crash in some cases because it relies on some of the default levels being present. This behavior is not documented and was a surprise during testing.
     - Pino also boasts greater performance than Winston, but has made similar decisions to Fastify, making it difficult to adopt for general use cases and is more difficult to work with. For example, customizing the log levels is not well documented and presented surprises with underlying bugs.

## Decision

We have elected to use Express instead of Fastify for the reasons stated above.

## Consequences

We will suffer a performance hit with Express over Fastify, but we believe the trade-offs are worth it for the ease of development and maintainability. We will continue to monitor Fastify's progress and reevaluate our decision if it becomes a more viable option in the future.
