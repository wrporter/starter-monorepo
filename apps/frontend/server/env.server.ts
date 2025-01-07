import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .union([z.literal('development'), z.literal('test'), z.literal('production')])
    .default('development'),

  DB_SERVER: z.string().trim().default('localhost'),
  DB_NAME: z.string().trim().default('monorepo'),
  DB_PORT: z.number().default(5432),
  DB_USER: z.string().trim().default('postgres'),
  DB_PASSWORD: z.string().trim().default('postgres'),
  DB_CA_CERT_PATH: z.string().trim().optional(),

  SESSION_SECRET: z.string().trim().default('SuperSecret'),

  /**
   * OpenTelemetry variables. The values from this module are not consumed by the OTEL libraries
   * and are only for when we are interacting with the APIs in our code. For example, to get a
   * tracer, we'd have the following code:
   * @example
   * ```typescript
   * import { env } from './env.server.js';
   * const tracer = trace.getTracer(env.OTEL_SERVICE_NAME);
   * ```
   */
  OTEL_SERVICE_NAME: z.string().trim().default('frontend'),
});

export type Environment = z.infer<typeof envSchema>;
export const env: Environment = envSchema.parse(process.env);
