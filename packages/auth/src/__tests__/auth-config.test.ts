// Integration tests for Better Auth configuration
import { describe, it, expect, beforeAll } from 'vitest';

describe('Better Auth Configuration', () => {
  beforeAll(() => {
    // Set required environment variables for testing
    process.env.DATABASE_URL = 'postgres://localhost:5432/refbook_test';
    process.env.BETTER_AUTH_SECRET = 'test-secret-key-for-testing-only-32-chars';
    process.env.BETTER_AUTH_URL = 'http://localhost:3000';
    process.env.NODE_ENV = 'test';
    process.env.APP_URL = 'http://localhost:3000';
  });

  describe('Environment Configuration', () => {
    it('should have BETTER_AUTH_SECRET set with minimum 32 characters', () => {
      expect(process.env.BETTER_AUTH_SECRET).toBeDefined();
      expect(process.env.BETTER_AUTH_SECRET?.length).toBeGreaterThanOrEqual(32);
    });

    it('should have BETTER_AUTH_URL set as valid URL', () => {
      expect(process.env.BETTER_AUTH_URL).toBeDefined();
      expect(process.env.BETTER_AUTH_URL).toMatch(/^https?:\/\/.+/);
    });

    it('should have DATABASE_URL set', () => {
      expect(process.env.DATABASE_URL).toBeDefined();
      expect(process.env.DATABASE_URL).toMatch(/^postgres:\/\//);
    });
  });

  describe('Better Auth Dependencies', () => {
    it('should have better-auth package available', async () => {
      const betterAuth = await import('better-auth');
      expect(betterAuth.betterAuth).toBeDefined();
      expect(typeof betterAuth.betterAuth).toBe('function');
    });

    it('should have drizzle adapter available', async () => {
      const drizzleAdapter = await import('better-auth/adapters/drizzle');
      expect(drizzleAdapter.drizzleAdapter).toBeDefined();
      expect(typeof drizzleAdapter.drizzleAdapter).toBe('function');
    });
  });

  describe('Auth Configuration Structure', () => {
    it('should be able to create better auth instance with valid config', async () => {
      const { betterAuth } = await import('better-auth');
      const { drizzleAdapter } = await import('better-auth/adapters/drizzle');
      
      // Mock the db dependency
      const mockDb = {};
      
      const testAuth = betterAuth({
        database: drizzleAdapter(mockDb as any, {
          provider: 'pg',
        }),
        emailAndPassword: {
          enabled: true,
          requireEmailVerification: false,
        },
        secret: process.env.BETTER_AUTH_SECRET!,
        baseURL: process.env.BETTER_AUTH_URL!,
      });
      
      expect(testAuth).toBeDefined();
      expect(typeof testAuth).toBe('object');
    });
  });
});
