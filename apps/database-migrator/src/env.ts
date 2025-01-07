import { z } from 'zod';

const envSchema = z.object({
  DB_SERVER: z.string().trim().default('localhost'),
  DB_NAME: z.string().trim().default('monorepo'),
  DB_PORT: z.number().default(5432),
  DB_USER: z.string().trim().default('postgres'),
  DB_PASSWORD: z.string().trim().default('postgres'),
});

export type Environment = z.infer<typeof envSchema>;
export const env: Environment = envSchema.parse(process.env);
