---
title: "Extend API Package with Client Setup"
status: "completed"
priority: "medium"
estimated_hours: 3
parent_prd: "./prd.md"
blocked_by: ["02-rename-shared-types-package.md"]
depends_on: ["02-rename-shared-types-package.md"]
test_type: "integration"
coverage_target: 80
---

# Extend API Package with Client Setup

## Parent

Reference to the parent PRD: `./prd.md`

## What to Build

Extend the existing `@packages/api` package to include tRPC client setup alongside the current server router. This involves moving the tRPC client configuration from `apps/app` to the shared API package, including the client creation logic, React Query integration, and provider component. Update apps/app to import and use the tRPC client from the shared package.

## User Stories Covered

- [ ] As a developer, I want tRPC client setup to be shared, so that mobile apps can use the same API client configuration as the web app

## Acceptance Criteria

- [ ] tRPC client setup moved from apps/app/src/lib/trpc-client.ts to packages/api/src/client.ts
- [ ] tRPC React instance moved from apps/app/src/lib/trpc.ts to packages/api/src/client.ts
- [ ] tRPC provider component moved from apps/app/src/lib/trpc-provider.tsx to packages/api/src/client.tsx
- [ ] packages/api properly exports tRPC client functions and provider component
- [ ] packages/api package.json updated with tRPC client dependencies if needed
- [ ] apps/app package.json updated to remove direct tRPC client dependencies
- [ ] apps/app import statements updated to use @packages/api for tRPC client
- [ ] apps/app local tRPC client files removed
- [ ] All existing tRPC-related tests still pass
- [ ] TypeScript compilation successful
- [ ] App still communicates with API correctly using shared client

## Testing Strategy

### Behaviors to Test
- Behavior 1: Verify that tRPC client can be imported from the shared package
- Behavior 2: Verify that tRPC client creation works correctly from shared package
- Behavior 3: Verify that tRPC provider component works correctly from shared package
- Behavior 4: Verify that existing tRPC functionality still works with shared client
- Behavior 5: Verify that existing server functions tests still pass

### Test Type
- **Type**: integration
- **Reason**: This change affects API client setup and requires verification that the app still communicates with the API correctly

### Test Seam
- **Location**: Existing server functions tests in `apps/app/src/__tests__/server-functions.test.ts`
- **Rationale**: These tests verify tRPC functionality and will catch any client setup issues

### Prior Art
- **Reference**: Existing tRPC and server function tests
- **Similarity**: Similar to other API client refactoring that maintains existing functionality

### Coverage Requirements
- **Target**: 80% (maintain existing coverage)
- **Critical paths**: tRPC client creation, provider component, API communication

## Implementation Notes

### Technical Approach
Extend the existing packages/api structure to include client setup. Move the tRPC client logic using git mv to preserve history. Ensure the package has necessary tRPC client dependencies. Create proper exports for client functions and the provider component. Update apps/app to remove local tRPC client files and import from the shared package. Update package.json dependencies to use the workspace package and remove direct tRPC client dependencies.

### Integration Points
- [ ] packages/api/src/client.ts (new/moved)
- [ ] packages/api/src/client.tsx (new/moved)
- [ ] packages/api/package.json (dependencies updated)
- [ ] apps/app/package.json (dependencies updated)
- [ ] apps/app/src/lib/ (imports updated)
- [ ] apps/app/src/components/ (if using tRPC provider)

### Data Changes
- [ ] No schema changes
- [ ] No migration requirements

## Documentation Impact

- **Architecture**: Update monorepo-structure.md to reflect that @packages/api includes both server and client
- **Database**: No changes
- **API**: No changes to API contracts
- **Testing**: No changes
- **i18n**: No changes
- **Deployment**: No changes
- **Frontend**: Update API client documentation to reference shared package
- **Backend**: No changes

## Blocked By

- [ ] 02-rename-shared-types-package.md

## Dependencies

- [ ] None

## Definition of Done

- [ ] All acceptance criteria met
- [ ] All tests passing (unit + integration)
- [ ] TypeScript compilation successful
- [ ] Coverage targets met
- [ ] Documentation updated per impact section
- [ ] Documentation coherence verified
- [ ] No regressions in existing functionality
- [ ] Code follows project conventions
