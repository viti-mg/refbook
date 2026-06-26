import { createAuthClient } from 'better-auth/react';
import type { auth } from '@packages/auth';

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_BETTER_AUTH_URL || 'http://localhost:3000',
  basePath: '/api/auth',
});

export type Auth = typeof auth;
