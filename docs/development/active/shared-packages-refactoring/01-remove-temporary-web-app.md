---
title: "Remove Temporary Web App"
status: "ready"
priority: "high"
estimated_hours: 1
parent_prd: "./prd.md"
blocked_by: []
depends_on: []
test_type: "integration"
coverage_target: 80
---

# Remove Temporary Web App

## Parent

Reference to the parent PRD: `./prd.md`

## What to Build

Remove the temporary `apps/web` directory that was created for monorepo setup verification. This directory contains a basic Vite + React setup that is not part of the production architecture and should be removed to align the monorepo structure with the documented architecture.

## User Stories Covered

- [ ] As a developer, I want temporary setup code removed, so that the monorepo structure matches the documented architecture

## Acceptance Criteria

- [ ] The `apps/web` directory is completely removed from the repository
- [ ] Root `package.json` is updated to remove any web-specific scripts (dev:web, build:web)
- [ ] No references to `apps/web` remain in the codebase
- [ ] The monorepo still builds successfully after removal
- [ ] The main app (`apps/app`) is not affected by the removal
- [ ] All existing tests still pass

## Testing Strategy

### Behaviors to Test
- Behavior 1: Verify that removing apps/web does not break the monorepo build
- Behavior 2: Verify that apps/app still functions correctly after removal
- Behavior 3: Verify that no broken references to apps/web exist in the codebase

### Test Type
- **Type**: integration
- **Reason**: This change affects the monorepo structure and needs verification that the build system and other apps still work

### Test Seam
- **Location**: Existing build system tests in `apps/app/src/__tests__/build-system.test.ts`
- **Rationale**: These tests verify the monorepo build system and will catch any issues

### Prior Art
- **Reference**: Existing build system tests
- **Similarity**: Similar to other monorepo structure changes that have been tested

### Coverage Requirements
- **Target**: 80% (maintain existing coverage)
- **Critical paths**: Build system, app startup, existing functionality

## Implementation Notes

### Technical Approach
Delete the `apps/web` directory using git commands to preserve history if needed. Update the root `package.json` to remove web-specific scripts. Use grep to search for any remaining references to `apps/web` in the codebase and remove them.

### Integration Points
- [ ] Root package.json scripts
- [ ] Turborepo configuration (if it references apps/web)
- [ ] Any documentation that references apps/web

### Data Changes
- [ ] No schema changes
- [ ] No migration requirements

## Documentation Impact

- **Architecture**: Remove references to apps/web from monorepo-structure.md and system-architecture.md
- **Database**: No changes
- **API**: No changes
- **Testing**: No changes
- **i18n**: No changes
- **Deployment**: Remove any deployment configs that reference apps/web
- **Frontend**: No changes to apps/app
- **Backend**: No changes

## Blocked By

- [ ] None - can start immediately

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
