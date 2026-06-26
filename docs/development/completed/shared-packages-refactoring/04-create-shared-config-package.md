---
title: "Create Shared Config Package"
status: "completed"
priority: "medium"
estimated_hours: 3
parent_prd: "./prd.md"
blocked_by: ["02-rename-shared-types-package.md"]
depends_on: ["02-rename-shared-types-package.md"]
test_type: "integration"
coverage_target: 80
---

# Create Shared Config Package

## Parent

Reference to the parent PRD: `./prd.md`

## What to Build

Create a new `@packages/config` shared package and move environment validation logic from `apps/app` to the new package. This includes moving the comprehensive Zod-based environment variable validation, server/client environment schemas, and related utility functions. Update apps/app to import and use the environment validation from the shared package.

## User Stories Covered

- [ ] As a developer, I want environment validation to be in a shared package, so that all applications use consistent environment variable validation

## Acceptance Criteria

- [x] New `packages/config` directory created with proper package structure
- [x] `packages/config/package.json` created with appropriate dependencies (zod) and workspace configuration
- [x] Environment validation logic moved from apps/app/src/lib/env.ts to packages/config/src/env.ts
- [x] packages/config properly exports all environment validation functions and types
- [x] apps/app package.json updated to use @packages/config instead of local env.ts
- [x] apps/app import statements updated to use @packages/config for environment validation
- [x] apps/app local lib/env.ts removed or updated to re-export from shared package
- [x] All existing environment-related tests still pass
- [x] TypeScript compilation successful
- [x] App still validates environment variables correctly with shared package

## Testing Strategy

### Behaviors to Test
- Behavior 1: Verify that environment validation functions can be imported from the shared package
- Behavior 2: Verify that server environment validation works correctly from shared package
- Behavior 3: Verify that client environment validation works correctly from shared package
- Behavior 4: Verify that environment utility functions (isDevelopment, isProduction, isTest) work correctly
- Behavior 5: Verify that existing environment tests still pass

### Test Type
- **Type**: integration
- **Reason**: This change affects environment validation and requires verification that the app still validates environment correctly

### Test Seam
- **Location**: Existing environment tests in `apps/app/src/__tests__/env.test.ts`
- **Rationale**: These tests verify environment validation and will catch any issues with the shared package

### Prior Art
- **Reference**: Existing environment validation tests
- **Similarity**: Similar to other utility refactoring that maintains existing functionality

### Coverage Requirements
- **Target**: 80% (maintain existing coverage)
- **Critical paths**: Environment validation, server/client env separation, utility functions

## Implementation Notes

### Technical Approach
Create the new package structure with proper TypeScript configuration. Move the environment validation logic using git mv to preserve history. Ensure the package has zod as a dependency. Create proper index.ts files for exporting environment functions and types. Update apps/app to remove local env.ts and import from the shared package. Update package.json dependencies to use the workspace package.

### Integration Points
- [x] packages/config/package.json (new)
- [x] packages/config/src/env.ts (moved from apps/app)
- [x] apps/app/package.json (dependencies updated)
- [x] apps/app/src/lib/ (imports updated)
- [x] apps/app/src/server/ (if it uses environment validation)

### Data Changes
- [ ] No schema changes
- [ ] No migration requirements

## Documentation Impact

- **Architecture**: Add @packages/config to monorepo-structure.md and system-architecture.md
- **Database**: No changes
- **API**: No changes
- **Testing**: No changes
- **i18n**: No changes
- **Deployment**: No changes
- **Frontend**: Update environment documentation to reference shared package
- **Backend**: No changes

## Blocked By

- [ ] 02-rename-shared-types-package.md

## Dependencies

- [ ] None

## Definition of Done

- [x] All acceptance criteria met
- [x] All tests passing (unit + integration)
- [x] TypeScript compilation successful
- [x] Coverage targets met
- [x] Documentation updated per impact section
- [x] Documentation coherence verified
- [x] No regressions in existing functionality
- [x] Code follows project conventions
