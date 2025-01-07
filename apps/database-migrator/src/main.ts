import * as schema from '@repo/db-schema';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres, { Options } from 'postgres';

import { env } from './env.js';

const connectOptions: Options<never> = {
  host: env.DB_SERVER,
  port: env.DB_PORT,
  database: env.DB_NAME,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
};

const client = postgres(connectOptions);
const db = drizzle({ client, schema, casing: 'snake_case' });

await migrate(db, { migrationsFolder: './migrations' });
await client.end();
