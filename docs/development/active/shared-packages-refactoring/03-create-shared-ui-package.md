---
title: "Create Shared UI Package"
status: "ready"
priority: "high"
estimated_hours: 4
parent_prd: "./prd.md"
blocked_by: ["02-rename-shared-types-package.md"]
depends_on: ["02-rename-shared-types-package.md"]
test_type: "integration"
coverage_target: 80
---

# Create Shared UI Package

## Parent

Reference to the parent PRD: `./prd.md`

## What to Build

Create a new `@packages/ui` shared package and move all shadcn/ui components and configuration from `apps/app` to the new package. This includes moving the UI components (button, card, input), the components.json configuration, and utility functions (cn function). Update apps/app to import and use the components from the shared package instead of local copies.

## User Stories Covered

- [ ] As a developer, I want shadcn/ui components to be in a shared package, so that iOS and Android apps can reuse the same UI components without duplication
- [ ] As a developer, I want utility functions to be shared, so that the same className merging logic is used across platforms

## Acceptance Criteria

- [ ] New `packages/ui` directory created with proper package structure
- [ ] `packages/ui/package.json` created with appropriate dependencies and workspace configuration
- [ ] shadcn/ui components (button, card, input) moved from apps/app to packages/ui/src/components/
- [ ] components.json configuration moved to packages/ui/
- [ ] Utility functions (cn function) moved from apps/app/src/lib/utils.ts to packages/ui/src/lib/
- [ ] packages/ui properly exports all components and utilities
- [ ] apps/app package.json updated to use @packages/ui instead of direct dependencies
- [ ] apps/app import statements updated to use @packages/ui
- [ ] apps/app local components/ui directory removed
- [ ] apps/app local lib/utils.ts removed or updated to re-export from shared package
- [ ] All existing UI component tests still pass
- [ ] TypeScript compilation successful
- [ ] App still renders correctly with shared components

## Testing Strategy

### Behaviors to Test
- Behavior 1: Verify that UI components can be imported from the shared package
- Behavior 2: Verify that components render correctly when imported from shared package
- Behavior 3: Verify that utility functions (cn) work correctly from shared package
- Behavior 4: Verify that existing component tests still pass
- Behavior 5: Verify that the app builds and runs with shared components

### Test Type
- **Type**: integration
- **Reason**: This change affects component imports and requires verification that the UI still works correctly

### Test Seam
- **Location**: Existing UI framework tests in `apps/app/src/__tests__/ui-framework.test.tsx`
- **Rationale**: These tests verify UI components and will catch any rendering or import issues

### Prior Art
- **Reference**: Existing UI component tests
- **Similarity**: Similar to other component refactoring that maintains existing functionality

### Coverage Requirements
- **Target**: 80% (maintain existing coverage)
- **Critical paths**: Component rendering, imports, utility functions

## Implementation Notes

### Technical Approach
Create the new package structure with proper TypeScript configuration. Move the components and configuration files using git mv to preserve history. Update the components.json to work with the new package structure. Create proper index.ts files for exporting components. Update apps/app to remove local copies and import from the shared package. Update package.json dependencies to use the workspace package.

### Integration Points
- [ ] packages/ui/package.json (new)
- [ ] packages/ui/src/components/ (moved from apps/app)
- [ ] packages/ui/src/lib/ (moved from apps/app)
- [ ] packages/ui/components.json (moved from apps/app)
- [ ] apps/app/package.json (dependencies updated)
- [ ] apps/app/src/components/ (imports updated)
- [ ] apps/app/src/lib/ (imports updated)

### Data Changes
- [ ] No schema changes
- [ ] No migration requirements

## Documentation Impact

- **Architecture**: Add @packages/ui to monorepo-structure.md and system-architecture.md
- **Database**: No changes
- **API**: No changes
- **Testing**: No changes
- **i18n**: No changes
- **Deployment**: No changes
- **Frontend**: Update component documentation to reference shared package
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
