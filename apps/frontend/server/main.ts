import process from "node:process";
import { remixFastify } from "@mcansh/remix-fastify";
import { installGlobals } from "@remix-run/node";
import { fastify } from "fastify";
import fastifyGracefulShutdown from "fastify-graceful-shutdown";

installGlobals();

const app = fastify();

await app.register(remixFastify);

app.register(fastifyGracefulShutdown);
app.after(() => {
  app.gracefulShutdown((signal) => {
    app.log.info("Received signal to shutdown: %s", signal);
  });
});

const host = "0.0.0.0";
const port = Number(process.env.PORT) || 3000;

let address = await app.listen({ port, host });
console.log(`✅ app ready: ${address}`);
