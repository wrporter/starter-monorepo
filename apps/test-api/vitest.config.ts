import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        globals: true,
        reporters: ['default', 'junit'],
        outputFile: 'results/junit.xml',
    },
});
