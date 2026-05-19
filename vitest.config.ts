// Avoid importing 'vitest/config' during Next.js typecheck/build.
// Export a plain config object so TypeScript/Next won't try to resolve Vitest at build time.
import path from 'path';

const config: any = {
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: 'src/test/setupTests.ts',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
};

export default config;
