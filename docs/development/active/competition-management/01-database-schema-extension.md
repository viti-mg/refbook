---
title: "Database Schema Extension"
status: "ready"
priority: "high"
estimated_hours: 3
parent_prd: "../prd.md"
blocked_by: ["../../email-auth-better-auth/02-api-integration-ui.md"]
depends_on: ["../../email-auth-better-auth/02-api-integration-ui.md"]
test_type: "integration"
coverage_target: 85
---

# Database Schema Extension

## Parent

Reference to the parent PRD: `../prd.md`

## What to Build

Extend the existing competitions table in packages/db/src/schema.ts to include all MVP fields from the documented schema, add missing timestamp fields (scheduled_start, actual_start, actual_end, location, notes), ensure proper relationships with the Better Auth users table, and run database migrations. This slice establishes the data foundation for competition management.

## User Stories Covered

- [x] As a developer, I want competition data to persist in the PostgreSQL database, so that data is reliable and durable.

## Acceptance Criteria

- [ ] competitions table includes all MVP fields: id, user_id, sport_type, name, status, scheduled_start, actual_start, actual_end, location, notes, created_at, updated_at
- [ ] user_id field has proper foreign key relationship to Better Auth users table
- [ ] No version field included (MVP specification)
- [ ] No audit logging fields included (MVP specification)
- [ ] Database migration runs successfully using Drizzle
- [ ] Schema matches documented MVP schema exactly
- [ ] Data types and constraints are correct
- [ ] Migration is reversible if needed

## Testing Strategy

### Behaviors to Test
- Behavior 1: Migration applies correctly to database
- Behavior 2: Schema matches documented structure
- Behavior 3: Foreign key relationship to users table works correctly
- Behavior 4: Data can be inserted and queried correctly

### Test Type
- **Type**: Integration
- **Reason**: Database schema changes need to be tested with actual database

### Test Seam
- **Location**: packages/db/src/__tests__/schema.test.ts
- **Rationale**: Test the database schema at the package level

### Prior Art
- **Reference**: Existing database setup in packages/db
- **Similarity**: Follows existing Drizzle migration patterns

### Coverage Requirements
- **Target**: 85%
- **Critical paths**: Migration application, schema validation, data operations

## Implementation Notes

### Technical Approach
Extend the existing competitions table in packages/db/src/schema.ts with the missing MVP fields, ensure the user_id foreign key references the Better Auth users table, remove any version field if present, and run Drizzle migration to apply the schema changes.

### Integration Points
- [x] packages/auth (Better Auth users table)
- [ ] PostgreSQL database (migration target)

### Data Changes
- [x] Schema changes: Add scheduled_start, actual_start, actual_end, location, notes fields to competitions table
- [x] Migration requirements: Run Drizzle migration to apply schema changes

## Documentation Impact

- **Database**: Update docs/data-model/mvp-schema.md to reflect implemented schema
- **Architecture**: Update docs/architecture/system-architecture.md if needed

## Blocked By

- [x] ../../email-auth-better-auth/02-api-integration-ui.md (Better Auth must be implemented first to establish users table)

## Dependencies

- [x] ../../email-auth-better-auth/02-api-integration-ui.md (Better Auth users table must exist)

## Definition of Done

- [ ] All acceptance criteria met
- [ ] All tests passing (integration)
- [ ] TypeScript compilation successful
- [ ] Coverage targets met (85%)
- [ ] Documentation updated per impact section
- [ ] Documentation coherence verified
- [ ] No regressions in existing functionality
- [ ] Code follows project conventions
