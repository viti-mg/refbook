---
title: "Integrate Monorepo Packages"
status: "completed"
priority: "critical"
estimated_hours: 3
parent_prd: "./prd.md"
blocked_by: ["01-create-tanstack-start-foundation.md"]
depends_on: ["01-create-tanstack-start-foundation.md"]
test_type: "integration"
coverage_target: 80
---

# Integrate Monorepo Packages

## What to build

Configure the application to import and use existing monorepo packages: @packages/api for client-side tRPC calls, @packages/auth for auth client configuration, @packages/shared-types for TypeScript types. Set up server-only access patterns for @packages/db (restricted to server functions). Verify that all imports work correctly and TypeScript compilation succeeds.

## Acceptance criteria

- [ ] @packages/api is imported and functional for client-side tRPC calls
- [ ] @packages/auth is imported and configured for auth client
- [ ] @packages/shared-types is imported and TypeScript types are available
- [ ] @packages/db is accessible only in server-side code (server functions)
- [ ] All package imports resolve correctly with no TypeScript errors
- [ ] Integration tests verify monorepo package functionality
- [ ] Workspace dependencies are properly configured in package.json

## Blocked by

01-create-tanstack-start-foundation.md
