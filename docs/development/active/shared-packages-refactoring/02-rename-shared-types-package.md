---
title: "Rename Shared Types Package"
status: "completed"
priority: "high"
estimated_hours: 2
parent_prd: "./prd.md"
blocked_by: ["01-remove-temporary-web-app.md"]
depends_on: ["01-remove-temporary-web-app.md"]
test_type: "integration"
coverage_target: 80
---

# Rename Shared Types Package

## Parent

Reference to the parent PRD: `./prd.md`

## What to Build

Rename the `@packages/shared-types` package to `@packages/types` for semantic clarity. This involves updating the package name, all import statements across the codebase, and any documentation that references the old package name. This is a foundational change that must be completed before moving UI components that may depend on types.

## User Stories Covered

- [x] As a developer, I want the shared types package to have a simpler name, so that import statements are more concise and semantic

## Acceptance Criteria

- [x] Package directory renamed from `packages/shared-types` to `packages/types`
- [x] Package name in `packages/types/package.json` updated to `@packages/types`
- [x] All import statements updated from `@packages/shared-types` to `@packages/types`
- [x] Root package.json workspace configuration updated if needed
- [x] All dependent packages updated (api, auth, app)
- [x] TypeScript compilation successful with new package name
- [x] All tests pass with new package name
- [x] Documentation updated to reflect new package name

## Testing Strategy

### Behaviors to Test
- Behavior 1: Verify that the package can be imported with the new name
- Behavior 2: Verify that all dependent packages can build with the new package name
- Behavior 3: Verify that TypeScript type checking works with the new import paths
- Behavior 4: Verify that no broken references to the old package name exist

### Test Type
- **Type**: integration
- **Reason**: This change affects multiple packages and requires verification that the entire monorepo still works

### Test Seam
- **Location**: Existing build system tests and type checking
- **Rationale**: These tests will catch any import or dependency issues

### Prior Art
- **Reference**: Existing package dependency tests
- **Similarity**: Similar to other package refactoring that has been done in the codebase

### Coverage Requirements
- **Target**: 80% (maintain existing coverage)
- **Critical paths**: Package imports, TypeScript compilation, dependent package builds

## Implementation Notes

### Technical Approach
Use git mv to rename the directory while preserving git history. Update the package.json name field. Use grep to find all references to `@packages/shared-types` in the codebase and update them to `@packages/types`. Update the root package.json workspace configuration if it explicitly lists package names.

### Integration Points
- [x] packages/types/package.json
- [x] packages/api/package.json (dependency)
- [x] packages/auth/package.json (dependency)
- [x] apps/app/package.json (dependency)
- [x] apps/app/src/lib/types.ts (imports)
- [x] Any other files that import from @packages/shared-types

### Data Changes
- [ ] No schema changes
- [ ] No migration requirements

## Documentation Impact

- **Architecture**: Update all references from @packages/shared-types to @packages/types in monorepo-structure.md and system-architecture.md
- **Database**: No changes
- **API**: No changes
- **Testing**: No changes
- **i18n**: No changes
- **Deployment**: No changes
- **Frontend**: No changes
- **Backend**: No changes

## Blocked By

- [x] 01-remove-temporary-web-app.md

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
