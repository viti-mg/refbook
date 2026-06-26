// Server functions for database operations
// These functions can only be called from the server and have access to @packages/db

import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

// Example server function that uses the database
export const getCompetitionsServer = createServerFn()
  .handler(async () => {
    // This function has access to @packages/db because it runs on the server
    // For now, return empty array - actual DB queries will be added when schema is ready
    return [];
  });

// Example mutation server function with validation
export const createCompetitionServer = createServerFn({ method: 'POST' })
  .validator(z.object({
    name: z.string(),
    sportType: z.string(),
  }))
  .handler(async ({ data }) => {
    // This function can safely use @packages/db for database operations
    // Implementation will be added when we have the actual schema
    return { id: 'temp-id', ...data };
  });
