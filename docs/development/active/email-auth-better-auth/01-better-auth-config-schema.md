---
title: "Better Auth Configuration & Schema"
status: "completed"
priority: "critical"
estimated_hours: 4
parent_prd: "../prd.md"
blocked_by: []
depends_on: []
test_type: "integration"
coverage_target: 90
---

# Better Auth Configuration & Schema

## Parent

Reference to the parent PRD: `../prd.md`

## What to Build

Configure Better Auth in the shared `packages/auth` package with email/password authentication, generate the database schema using Better Auth CLI, and ensure the configuration is properly exported for use in other packages. This slice focuses solely on the server-side auth configuration and database setup, establishing the foundation for auth integration in subsequent slices.

## User Stories Covered

- [x] As a developer, I want Better Auth to handle database schema generation, so that I don't have to maintain auth tables manually.
- [x] As a developer, I want Better Auth to handle session management automatically, so that I don't have to implement session logic.
- [x] As a developer, I want Better Auth to provide built-in security best practices, so that the auth system is secure from day one.
- [x] As a developer, I want Better Auth to integrate with Drizzle ORM, so that it works with our existing database setup.
- [x] As a developer, I want Better Auth to provide type-safe client and server APIs, so that I get end-to-end type safety.

## Acceptance Criteria

- [ ] Better Auth is configured in packages/auth with email/password authentication enabled
- [ ] Environment variables BETTER_AUTH_SECRET and BETTER_AUTH_URL are set up
- [ ] Better Auth uses Drizzle adapter with existing PostgreSQL database via @packages/db
- [ ] Better Auth CLI successfully generates schema: `npx @better-auth/cli migrate`
- [ ] Database tables (users, sessions, accounts, verification_tokens) are created correctly
- [ ] Better Auth instance is properly exported from packages/auth
- [ ] TypeScript types are properly exported for use in other packages
- [ ] Configuration is tested to ensure Better Auth is properly initialized

## Testing Strategy

### Behaviors to Test
- Behavior 1: Better Auth configuration loads without errors
- Behavior 2: Database schema generation completes successfully
- Behavior 3: Better Auth instance can be imported and used
- Behavior 4: TypeScript types are properly exported and usable

### Test Type
- **Type**: Integration
- **Reason**: Better Auth configuration needs to work with actual database and be tested end-to-end

### Test Seam
- **Location**: packages/auth/src/__tests__/auth-config.test.ts
- **Rationale**: Test the auth package configuration independently before integration with other packages

### Prior Art
- **Reference**: Existing test setup in apps/app/src/__tests__/ for integration test patterns
- **Similarity**: Similar to how other shared packages are tested in isolation

### Coverage Requirements
- **Target**: 90%
- **Critical paths**: Better Auth initialization, schema generation, type exports

## Implementation Notes

### Technical Approach
Configure Better Auth in packages/auth/src/auth.ts with email/password authentication, use Drizzle adapter, set up environment variables, and run CLI migration. Export the Better Auth instance and types for use in other packages.

### Integration Points
- [ ] packages/db (Drizzle adapter integration)
- [ ] PostgreSQL database (schema generation)
- [ ] Environment variables (BETTER_AUTH_SECRET, BETTER_AUTH_URL)

### Data Changes
- [x] Schema changes: Better Auth CLI will generate users, sessions, accounts, verification_tokens tables
- [x] Migration requirements: Run `npx @better-auth/cli migrate` to apply schema

## Documentation Impact

- **Architecture**: Update docs/architecture/system-architecture.md to reflect Better Auth integration
- **Database**: Document Better Auth auto-generated schema in docs/data-model/mvp-schema.md
- **API**: Document Better Auth configuration in docs/implementation/better-auth-setup.md
- **Testing**: Update test strategy documentation if needed

## Blocked By

- [ ] None - can start immediately

## Dependencies

- [ ] PostgreSQL database available for local development
- [ ] Better Auth CLI available for schema generation

## Definition of Done

- [x] All acceptance criteria met
- [x] All tests passing (integration)
- [x] TypeScript compilation successful
- [x] Coverage targets met (90%)
- [x] Documentation updated per impact section
- [x] Documentation coherence verified
- [x] No regressions in existing functionality
- [x] Code follows project conventions
