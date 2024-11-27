import * as schema from '@repo/database';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const client = postgres(process.env.DATABASE_URL ?? '');
const db = drizzle(client, { schema });

await migrate(db, { migrationsFolder: './migrations' });
await client.end();
