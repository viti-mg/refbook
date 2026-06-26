// Integration tests for database schema
import { describe, it, expect, beforeAll } from 'vitest';

describe('Database Schema', () => {
  beforeAll(() => {
    // Set required environment variables for testing
    process.env.DATABASE_URL = 'postgres://localhost:5432/refbook_test';
    process.env.NODE_ENV = 'test';
  });

  describe('Schema Module', () => {
    it('should be able to import schema module', async () => {
      const schema = await import('../schema');
      expect(schema).toBeDefined();
    });

    it('should export competitions table', async () => {
      const { competitions } = await import('../schema');
      expect(competitions).toBeDefined();
    });

    it('should export Better Auth tables', async () => {
      const schema = await import('../schema');
      // Check that the schema exports Better Auth tables
      const schemaKeys = Object.keys(schema);
      // Should have competitions table
      expect(schemaKeys.length).toBeGreaterThan(0);
      // Should have user-related tables (may be named 'user' or 'users' depending on Drizzle)
      const hasUserTable = schemaKeys.some(key => key.toLowerCase().includes('user'));
      expect(hasUserTable).toBe(true);
    });
  });

  describe('Schema Structure', () => {
    it('should have competitions table with proper structure', async () => {
      const { competitions } = await import('../schema');
      expect(competitions).toBeDefined();
      // The table should have the basic structure
      expect(typeof competitions).toBe('object');
    });

    it('should have user table for foreign key relationship', async () => {
      const schema = await import('../schema');
      // The user table should be available for foreign key relationship
      const schemaKeys = Object.keys(schema);
      const hasUserTable = schemaKeys.some(key => key.toLowerCase().includes('user'));
      expect(hasUserTable).toBe(true);
    });
  });
});
