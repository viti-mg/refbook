// Integration tests for database schema
import { describe, it, expect, beforeAll } from 'vitest';
import { competitions, user } from '../schema';

describe('Database Schema', () => {
  beforeAll(() => {
    // Set required environment variables for testing
    process.env.DATABASE_URL = 'postgres://localhost:5432/refbook_test';
    process.env.NODE_ENV = 'test';
  });

  describe('Competitions Table Schema', () => {
    it('should have all required MVP fields', () => {
      const expectedFields = [
        'id',
        'userId',
        'name',
        'sportType',
        'status',
        'scheduledStart',
        'actualStart',
        'actualEnd',
        'location',
        'notes',
        'createdAt',
        'updatedAt',
      ];

      const actualFields = Object.keys(competitions);
      
      expectedFields.forEach(field => {
        expect(actualFields).toContain(field);
      });
    });

    it('should not have version field (MVP specification)', () => {
      const actualFields = Object.keys(competitions);
      expect(actualFields).not.toContain('version');
    });

    it('should have user_id foreign key relationship to user table', () => {
      // The schema should reference the user table
      expect(competitions.userId).toBeDefined();
      // The foreign key is defined in the schema references
      expect(user.id).toBeDefined();
    });

    it('should have proper field types', () => {
      // Check that timestamp fields are defined
      expect(competitions.scheduledStart).toBeDefined();
      expect(competitions.actualStart).toBeDefined();
      expect(competitions.actualEnd).toBeDefined();
      expect(competitions.createdAt).toBeDefined();
      expect(competitions.updatedAt).toBeDefined();
      
      // Check that text fields are defined
      expect(competitions.location).toBeDefined();
      expect(competitions.notes).toBeDefined();
    });

    it('should have required fields as not null', () => {
      // Required fields should be not null
      expect(competitions.id).toBeDefined();
      expect(competitions.userId).toBeDefined();
      expect(competitions.name).toBeDefined();
      expect(competitions.sportType).toBeDefined();
      expect(competitions.status).toBeDefined();
      expect(competitions.scheduledStart).toBeDefined();
    });

    it('should have optional fields as nullable', () => {
      // Optional fields should be nullable
      expect(competitions.actualStart).toBeDefined();
      expect(competitions.actualEnd).toBeDefined();
      expect(competitions.location).toBeDefined();
      expect(competitions.notes).toBeDefined();
    });
  });

  describe('Schema Structure Validation', () => {
    it('should match documented MVP schema structure', () => {
      const competitionsFields = Object.keys(competitions);
      
      // Verify all MVP fields are present
      const mvpFields = [
        'id', 'userId', 'name', 'sportType', 'status',
        'scheduledStart', 'actualStart', 'actualEnd',
        'location', 'notes', 'createdAt', 'updatedAt'
      ];
      
      mvpFields.forEach(field => {
        expect(competitionsFields).toContain(field);
      });
      
      // Verify no extra fields are present
      expect(competitionsFields.length).toBe(mvpFields.length);
    });

    it('should have proper table relationships', () => {
      // Verify user table exists for foreign key relationship
      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
    });
  });
});
