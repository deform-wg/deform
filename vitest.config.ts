import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    pool: 'threads',
    setupFiles: ['src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      exclude: ['src/vendor/**', 'form-builder/**', 'coverage/**', '*.config.*'],
    },
  },
});
