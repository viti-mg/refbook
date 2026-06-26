---
title: "Competition API Procedures"
status: "ready"
priority: "high"
estimated_hours: 4
parent_prd: "../prd.md"
blocked_by: ["01-database-schema-extension.md", "02-template-system-setup.md"]
depends_on: ["01-database-schema-extension.md", "02-template-system-setup.md"]
test_type: "integration"
coverage_target: 85
---

# Competition API Procedures

## Parent

Reference to the parent PRD: `../prd.md`

## What to Build

Implement competition CRUD operations as tRPC procedures in packages/api/src/router.ts, including queries for listing and fetching competitions, mutations for creating, updating, and deleting competitions, and a procedure for fetching available templates. This slice creates the server-side API layer that the UI components will consume.

## User Stories Covered

- [x] As a developer, I want the competition API to use tRPC for type safety, so that client and server stay synchronized.

## Acceptance Criteria

- [ ] competitions.list query fetches all competitions for authenticated user with optional filters (status, sport_type, date_range)
- [ ] competitions.get query fetches a single competition by ID
- [ ] competitions.getTemplates query fetches available template configurations
- [ ] competitions.create mutation creates a new competition from a template
- [ ] competitions.update mutation updates competition details
- [ ] competitions.updateStatus mutation updates competition status (flexible transitions)
- [ ] competitions.delete mutation deletes a competition
- [ ] All procedures use Better Auth session to get current user_id
- [ ] All procedures validate input using Zod schemas
- [ ] All procedures handle errors gracefully
- [ ] Competitions are properly associated with authenticated users
- [ ] Template data is properly integrated into competition creation
- [ ] tRPC router is properly exported and typed

## Testing Strategy

### Behaviors to Test
- Behavior 1: competitions.list returns correct competitions for authenticated user
- Behavior 2: competitions.list applies filters correctly (status, sport_type)
- Behavior 3: competitions.get returns correct competition by ID
- Behavior 4: competitions.getTemplates returns available templates
- Behavior 5: competitions.create creates competition with correct data
- Behavior 6: competitions.update updates competition correctly
- Behavior 7: competitions.updateStatus changes status correctly
- Behavior 8: competitions.delete removes competition correctly
- Behavior 9: All procedures enforce user ownership (user can only access their own competitions)
- Behavior 10: Input validation works correctly

### Test Type
- **Type**: Integration
- **Reason**: API procedures need to be tested with actual database and Better Auth integration

### Test Seam
- **Location**: packages/api/src/__tests__/competitions.test.ts
- **Rationale**: Test the API procedures at the package level where they're defined

### Prior Art
- **Reference**: Existing test patterns in packages/api
- **Similarity**: Similar to how other tRPC procedures are tested

### Coverage Requirements
- **Target**: 85%
- **Critical paths**: CRUD operations, user ownership enforcement, input validation

## Implementation Notes

### Technical Approach
Add competition procedures to the tRPC router in packages/api/src/router.ts. Use Better Auth session to get the current user_id. Implement Zod schemas for input validation. Use the database client from @packages/db to perform CRUD operations. Integrate with template data from the template files.

### Integration Points
- [x] packages/auth (Better Auth session for user_id)
- [x] packages/db (database operations)
- [x] apps/app (template files)
- [ ] packages/types (shared types if needed)

### Data Changes
- [ ] No schema changes (schema already extended in slice 01)
- [ ] No migration requirements

## Documentation Impact

- **API**: Document competition tRPC procedures in API documentation
- **Implementation**: Update docs/implementation/competition-management.md with API details

## Blocked By

- [x] 01-database-schema-extension.md (database schema must be extended first)
- [x] 02-template-system-setup.md (templates must be available first)

## Dependencies

- [x] 01-database-schema-extension.md (database schema must be extended first)
- [x] 02-template-system-setup.md (templates must be available first)

## Definition of Done

- [ ] All acceptance criteria met
- [ ] All tests passing (integration)
- [ ] TypeScript compilation successful
- [ ] Coverage targets met (85%)
- [ ] Documentation updated per impact section
- [ ] Documentation coherence verified
- [ ] No regressions in existing functionality
- [ ] Code follows project conventions
