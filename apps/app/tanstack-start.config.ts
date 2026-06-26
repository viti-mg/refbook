// TanStack Start configuration
// This file configures the TanStack Start build system for environment variables and server settings

import { defineConfig } from '@tanstack/react-start/config';

export default defineConfig({
  server: {
    preset: 'node-server', // For self-hosted VPS deployment
  },
  tsr: {
    appDirectory: './src',
    routesDirectory: './src/routes',
    generatedRouteTree: './src/routeTree.gen.ts',
  },
});
