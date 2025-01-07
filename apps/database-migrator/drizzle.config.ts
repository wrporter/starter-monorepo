import { defineConfig } from 'drizzle-kit';
import { env } from 'frontend/server/env.server.js';

export default defineConfig({
  dialect: 'postgresql',
  schema: 'src/schema.ts',
  out: './migrations',
  casing: 'snake_case',
  verbose: true,

  dbCredentials: {
    host: env.DB_SERVER,
    port: env.DB_PORT,
    database: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
  },
});
