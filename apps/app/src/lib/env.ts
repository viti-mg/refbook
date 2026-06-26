// Environment variable types and validation
// This file provides type-safe access to environment variables

import { z } from 'zod';

// Server-only environment variables schema
// These variables are only available on the server and should never be exposed to the client
const serverEnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  APP_URL: z.string().url(),
});

// Client-safe environment variables schema
// These variables can be safely exposed to the client
const clientEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  APP_URL: z.string().url(),
});

// Validate and parse server environment variables
// This function should only be called in server-side code
export function getServerEnv() {
  try {
    return serverEnvSchema.parse({
      DATABASE_URL: process.env.DATABASE_URL,
      BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
      BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
      NODE_ENV: process.env.NODE_ENV,
      APP_URL: process.env.APP_URL,
    });
  } catch (error) {
    console.error('Invalid server environment variables:', error);
    throw new Error('Invalid server environment configuration');
  }
}

// Validate and parse client environment variables
// This function can be called in both client and server code
export function getClientEnv() {
  try {
    return clientEnvSchema.parse({
      NODE_ENV: process.env.NODE_ENV,
      APP_URL: process.env.APP_URL,
    });
  } catch (error) {
    console.error('Invalid client environment variables:', error);
    throw new Error('Invalid client environment configuration');
  }
}

// Type exports
export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type ClientEnv = z.infer<typeof clientEnvSchema>;

// Utility to check if we're in development
export function isDevelopmentFn() {
  return process.env.NODE_ENV === 'development';
}

// Utility to check if we're in production
export function isProductionFn() {
  return process.env.NODE_ENV === 'production';
}

// Utility to check if we're in test mode
export function isTestFn() {
  return process.env.NODE_ENV === 'test';
}

// Export constants for convenience (evaluated at module load time)
export const isDevelopment = isDevelopmentFn();
export const isProduction = isProductionFn();
export const isTest = isTestFn();
