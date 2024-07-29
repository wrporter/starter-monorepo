import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    clearMocks: true,

    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'cobertura'],
      include: ['src/**/*.ts'],
      exclude: ['src/main.ts', '**/*.generated.*', '**/*.test.*'],

      thresholds: {
        statements: 45,
        branches: 45,
        functions: 45,
        lines: 45,
      },
    },
  },
});
