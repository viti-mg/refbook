---
title: "Create TanStack Start Application Foundation"
status: "ready"
priority: "critical"
estimated_hours: 4
parent_prd: "./prd.md"
blocked_by: []
depends_on: []
test_type: "integration"
coverage_target: 80
---

# Create TanStack Start Application Foundation

## What to build

Create the basic TanStack Start application structure in `apps/app` with package name `@apps/app`. Install TanStack Start using the official CLI, set up basic file-based routing with initial routes (`/`, `/competitions`, `/competitions/[id]`, `/auth/login`, `/auth/register`), configure layout routes for shared UI, and ensure the application runs in development mode with hot reload.

## Acceptance criteria

- [ ] apps/app directory exists with TanStack Start properly installed
- [ ] package.json configured with @apps/app name and TanStack Start dependencies
- [ ] File-based routing is functional with initial routes configured
- [ ] Layout routes are set up for shared UI components
- [ ] Application runs in development mode with hot reload working
- [ ] TypeScript compilation succeeds with no errors
- [ ] Basic integration tests verify the application structure

## Blocked by

None - can start immediately
