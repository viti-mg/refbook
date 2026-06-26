import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
  },
  resolve: {
    alias: {
      '@packages/auth': path.resolve(__dirname, '../../auth/src'),
      '@packages/db': path.resolve(__dirname, '../../db/src'),
      '@packages/config': path.resolve(__dirname, '../../config/src'),
      '@packages/types': path.resolve(__dirname, '../../types/src'),
    },
  },
});
