import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/contact.service.ts'],
    format: ['cjs', 'esm'],
    sourcemap: true,
    clean: true,
    dts: true,
});
