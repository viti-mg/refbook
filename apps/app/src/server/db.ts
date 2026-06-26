// Server-only database access
// This file can only be imported in server-side code (server functions, API routes)
// Importing this in client components will cause a build error

import { db } from '@packages/db';

// Re-export the db instance for server-side use
export { db };

// Server-only helper functions
export async function getCompetitions() {
  // This will be implemented when we add actual database queries
  return [];
}
