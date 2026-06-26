---
title: "Shared Packages Refactoring"
status: "active"
created: "2026-06-26"
author: "user/devin"
estimated_slices: 5
priority: "high"
---

# Shared Packages Refactoring PRD

## Problem Statement

The current implementation of the RefBook monorepo deviates significantly from the documented architecture. App-specific utilities and components (particularly shadcn/ui) are currently located in `apps/app` instead of shared packages, which contradicts the architecture principle of "maximum code reuse between web and mobile." This misalignment will require major refactoring when iOS and Android apps are developed post-MVP, as the documented architecture shows these platforms should share the same UI components and utilities.

## Solution

Refactor the monorepo structure to align with the documented architecture by moving app-specific utilities to shared packages. This involves creating new shared packages (`@packages/ui`, `@packages/config`), renaming an existing package (`@packages/types`), extending an existing package (`@packages/api` to include client setup), and removing temporary setup code (`apps/web`). This ensures the MVP has the full technical architecture in place to support future platform expansion without major refactoring.

## User Stories

1. As a developer, I want shadcn/ui components to be in a shared package, so that iOS and Android apps can reuse the same UI components without duplication
2. As a developer, I want environment validation to be in a shared package, so that all applications use consistent environment variable validation
3. As a developer, I want tRPC client setup to be shared, so that mobile apps can use the same API client configuration as the web app
4. As a developer, I want the shared types package to have a simpler name, so that import statements are more concise and semantic
5. As a developer, I want temporary setup code removed, so that the monorepo structure matches the documented architecture
6. As a developer, I want all architecture documentation to reflect the actual implementation, so that future development is guided by accurate documentation
7. As a developer, I want the refactoring to maintain all existing functionality, so that no features are broken during the restructuring
8. As a developer, I want comprehensive testing during the refactoring, so that any import or dependency issues are caught immediately
9. As a developer, I want the monorepo to build successfully after each change, so that integration issues are identified early
10. As a developer, I want type checking to pass throughout the refactoring, so that TypeScript import issues are caught immediately

## Implementation Decisions

### Package Structure
- Create `@packages/ui` as a new shared package for shadcn/ui components and configuration
- Create `@packages/config` as a new shared package for environment validation and shared configuration
- Rename `@packages/shared-types` to `@packages/types` for semantic clarity (completed in slice 02)

- Extend `@packages/api` to include tRPC client setup alongside the existing server router

### Component Organization
- Move shadcn/ui components (button, card, input) from `apps/app/src/components/ui/` to `@packages/ui/src/components/`
- Move shadcn/ui configuration (`components.json`) to `@packages/ui/`
- Move utility functions (cn function) from `apps/app/src/lib/utils.ts` to `@packages/ui/src/lib/`
- Move environment validation from `apps/app/src/lib/env.ts` to `@packages/config/src/env.ts`
- Move tRPC client setup from `apps/app/src/lib/trpc-client.ts`, `trpc.ts`, `trpc-provider.tsx` to `@packages/api/src/client.ts`

### Dependency Management
- Update `apps/app/package.json` to replace direct dependencies with shared package dependencies
- Update all import statements across the codebase to use new package names
- Ensure no circular dependencies are created between packages
- Maintain existing dependency versions to avoid breaking changes

### Cleanup
- Remove `apps/web` directory entirely as it was temporary monorepo setup verification
- Update root `package.json` to remove any web-specific scripts
- Update any deployment configurations that reference the old structure

### Tooling Configuration
- Update shadcn/ui CLI configuration to work with the new package structure
- Ensure all build tools (Vite, TypeScript, ESLint) work with the new package structure
- Update any IDE configuration files that reference package paths

## Testing Decisions

### Testing Approach
- Focus on ensuring existing functionality continues to work rather than adding new features
- Use existing test suite in `apps/app` to verify no regressions
- Run comprehensive build and type checking after each slice
- Perform manual verification of app functionality after completion

### Test Coverage
- Maintain existing test coverage levels in `apps/app` (currently targeting 80%)
- No new test coverage requirements as this is a refactoring PRD
- Focus on integration testing to catch import and dependency issues

### Test Types
- Unit tests: Existing tests in `apps/app` for UI components, build system, etc.
- Integration tests: Full test suite after each slice to catch dependency issues
- Build verification: Run `npm run build` after each slice
- Type checking: Run `npm run type-check` to catch TypeScript import issues
- Manual verification: Verify app still runs and renders correctly after final slice

### Test Seams
- Use existing test seams in `apps/app/src/__tests__/`
- No new test seams required as this is refactoring
- Leverage existing integration tests for build system verification

### Prior Art
- Existing tests in `apps/app/src/__tests__/ui-framework.test.tsx` for UI components
- Existing tests in `apps/app/src/__tests__/build-system.test.ts` for build verification
- Existing tests in `apps/app/src/__tests__/testing-infrastructure.test.tsx` for test infrastructure

## Documentation Impact

### Architecture
- Update `docs/architecture/monorepo-structure.md` to reflect new package structure
- Update `docs/architecture/system-architecture.md` to show new shared packages
- Update `docs/architecture/tech-stack.md` to reflect shadcn/ui in shared package
- Remove references to `apps/web` from all architecture documentation

### Implementation
- Update `docs/implementation/monorepo-setup.md` with new package examples
- Update package dependency examples to use new package names
- Add examples of how to use the new shared packages

### Development Process
- No changes to development process documentation needed
- This PRD itself will be moved to `docs/development/completed/` when finished

### Deployment
- Update any deployment configurations that reference old package structure
- Update Docker configurations if they reference package paths
- Update environment variable documentation if needed

## Out of Scope

- Moving testing utilities from `apps/app/src/__tests__/utils/tanstack.ts` (platform-specific)
- Moving server functions from `apps/app/src/server/` (TanStack Start specific)
- Adding new UI components or features
- Changing the functionality of existing components
- Modifying the database schema or migrations
- Changes to authentication implementation
- Performance optimizations or improvements

## Further Notes

This refactoring is critical for aligning the implementation with the documented architecture. The MVP scope document states that the MVP should be built with "the full technical architecture in place" to support future expansion without major refactoring. By moving these utilities to shared packages now, we ensure that when iOS and Android apps are developed post-MVP, they can immediately leverage the same components and utilities without duplication or refactoring.

The refactoring will be done incrementally through vertical slices to minimize risk and ensure each change can be tested independently. Each slice will maintain a working state of the application.

## Dependencies

- [ ] None - this PRD can start immediately

## Risks & Mitigations

- **Risk**: Missing import path updates could cause build failures
  **Mitigation**: Use grep to find all references to old package names before starting; run build and type-check after each slice

- **Risk**: Creating circular dependencies between new packages
  **Mitigation**: Carefully design package dependencies; run dependency analysis after each slice

- **Risk**: shadcn/ui CLI might not work with new package structure
  **Mitigation**: Test CLI functionality after moving components; update configuration if needed

- **Risk**: Git history becomes harder to follow for moved files
  **Mitigation**: Use git mv when possible to preserve history; document the refactoring in commit messages

- **Risk**: Deployment configurations might reference old package structure
  **Mitigation**: Check all deployment configs (Docker, etc.) for package references; update as needed

- **Risk**: Breaking changes in package dependencies could affect functionality
  **Mitigation**: Maintain existing dependency versions; test thoroughly after each slice

## Success Criteria

- [ ] All shared packages created and properly configured (`@packages/ui`, `@packages/config`)
- [x] Package successfully renamed from `@packages/shared-types` to `@packages/types` with all imports updated
- [ ] Temporary `apps/web` directory deleted without affecting other apps
- [ ] All existing tests in `apps/app` pass without modification
- [ ] `npm run build` completes successfully for the entire monorepo
- [ ] `npm run type-check` completes without errors
- [ ] `apps/app` still starts and functions correctly after the refactoring
- [ ] All architecture documentation reflects the new package structure
- [ ] No breaking changes in app functionality (behavior identical before and after)
- [ ] shadcn/ui CLI still works after moving components (if being used)
- [ ] No circular dependencies between packages
- [ ] All import statements updated to use new package names
