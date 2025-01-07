import { UserConfig } from 'vite';
import { defineConfig } from 'vitest/config';

export default ({ mode }: Required<UserConfig>) => {
  process.env = {
    ...process.env,
    LOG_LEVEL: 'error',
    DEBUG_PRINT_LIMIT: '100000',
  };

  return defineConfig({
    mode,
    test: {
      globals: true,
      clearMocks: true,

      environment: 'jsdom',
      setupFiles: ['./app/test/setup-tests.config.ts'],

      // Raised timeout due to slowness with MUI X Data Grid in Docker
      testTimeout: 30000,

      coverage: {
        provider: 'v8',
        reporter: ['text', 'lcov', 'cobertura'],
        include: ['app/**/*.{ts,tsx}', 'server/**/*.ts'],
        exclude: [
          'server/{env,main}.*',
          '**/*.{generated,config,repo,test,fake,mock}.*',
          'app/{entry,root,routes}.*',
        ],

        thresholds: {
          statements: 80,
          branches: 80,
          functions: 80,
          lines: 80,
        },
      },
    },
  });
};
