import 'dotenv/config';

import { z } from 'zod';

const envSchema = z.object({
  BASE_URL: z.string().default('https://local.cr.ogov.me'),

  /** Whether we are in a CI environment. */
  CI: z
    .string()
    .transform((v) => v === 'true')
    .default('false'),

  /**
   * Whether to ignore HTTPS error, such as invalid certificate. This should only be used for local
   * development.
   */
  IGNORE_HTTPS_ERRORS: z
    .string()
    .transform((v) => v === 'true')
    .default('false'),

  TEST_USERNAME: z.string().trim(),
  TEST_PASSWORD: z.string().trim(),
});

export type Environment = z.infer<typeof envSchema>;
export const env: Environment = envSchema.parse(process.env);
