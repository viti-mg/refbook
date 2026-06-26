// Server-only database access
// This file can only be imported in server-side code (server functions, API routes)
// Importing this in client components will cause a build error

import { getServerEnv } from '@packages/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Lazy database initialization to avoid import issues during testing
let dbInstance: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!dbInstance) {
    const env = getServerEnv();
    const connectionString = env.DATABASE_URL;
    const client = postgres(connectionString);
    dbInstance = drizzle(client);
  }
  return dbInstance;
}

// Export db as a getter for backward compatibility
export const db = new Proxy({} as never, {
  get(_target, prop) {
    return getDb()[prop as keyof ReturnType<typeof getDb>];
  },
});

// Server-only helper functions
export async function getCompetitions() {
  // This will be implemented when we add actual database queries
  return [];
}
