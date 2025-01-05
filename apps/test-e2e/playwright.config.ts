import { defineConfig, devices } from '@playwright/test';

import { env } from './src/env.js';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: env.CI,
  retries: env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: env.BASE_URL,
    viewport: { width: 1280, height: 720 },
    screenshot: 'only-on-failure',
    trace: env.CI ? 'retain-on-failure' : 'on',
    video: env.CI ? 'off' : 'on',
    ignoreHTTPSErrors: true,
  },

  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },

    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
});
