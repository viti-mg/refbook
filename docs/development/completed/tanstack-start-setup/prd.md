---
title: "TanStack Start Setup for Referee Application"
status: "completed"
created: "2026-06-26"
completed: "2026-06-26"
author: "user/agent"
estimated_slices: 3
priority: "critical"
---

# TanStack Start Setup for Referee Application PRD

## Problem Statement

The current web application setup uses a basic Vite + React configuration in `apps/web`, which does not provide the full-stack capabilities needed for the RefBook referee application. The tech stack specifies TanStack Start as the web framework, but it has not been properly implemented. Additionally, there is a need to separate the marketing website from the actual referee application to serve different user needs and deployment targets.

## Solution

Create a new TanStack Start application in `apps/app` for the referee application (app.refbook.com) while leaving the existing `apps/web` for the marketing site (refbook.com). The new application will follow the documented TanStack Start setup from the monorepo setup guide, with proper integration with existing monorepo packages (@packages/api, @packages/auth, @packages/shared-types, @packages/db). This will enable server-side rendering, server functions, file-based routing, and full-stack capabilities required for the referee application.

## User Stories

1. As a developer, I want a properly configured TanStack Start application, so that I can build full-stack features with SSR and server functions.
2. As a developer, I want the referee app to integrate with existing monorepo packages, so that I can reuse shared types, API clients, and authentication logic.
3. As a developer, I want file-based routing with TanStack Router, so that I can easily manage complex navigation patterns.
4. As a developer, I want server functions configured, so that I can run server-side code for database operations and API calls.
5. As a developer, I want shadcn/ui and Tailwind CSS configured, so that I can build consistent, accessible UI components.
6. As a developer, I want testing infrastructure set up, so that I can follow TDD practices for the application.
7. As a developer, I want environment variables properly configured, so that I can manage different environments (development, production).
8. As a developer, I want the app to be deployable to Docker containers, so that it can be deployed to the self-hosted VPS.
9. As a developer, I want TypeScript type safety throughout the application, so that I can catch errors at compile time.
10. As a developer, I want hot reload and fast development experience, so that I can iterate quickly during development.
11. As a developer, I want clear separation between marketing site and referee app, so that they can be deployed and scaled independently.
12. As a developer, I want authentication integration from the start, so that user management is built into the foundation.
13. As a developer, I want proper error handling and logging configured, so that debugging is easier in production.
14. As a developer, I want the build system to integrate with Turborepo, so that monorepo caching and build optimization work correctly.
15. As a developer, I want clear documentation of the setup process, so that other developers can understand the architecture.

## Implementation Decisions

- Create new application directory `apps/app` with package name `@apps/app` using TanStack Start
- Leave existing `apps/web` unchanged for the marketing website
- Install TanStack Start using `npm create @tanstack/start@latest` following the monorepo setup guide
- Configure TanStack Start for Node.js server deployment with Docker containerization
- Set up file-based routing with initial routes: `/`, `/competitions`, `/competitions/[id]`, `/auth/login`, `/auth/register`
- Configure layout routes for shared UI components (header, navigation)
- Integrate with existing monorepo packages:
  - Import @packages/api for client-side tRPC calls
  - Import @packages/auth for auth client configuration  
  - Import @packages/shared-types for TypeScript types
  - Restrict @packages/db access to server-side code only (server functions)
- Install and configure shadcn/ui with Tailwind CSS and Base UI primitives
- Set up testing infrastructure:
  - Vitest for unit and integration testing
  - React Testing Library for component testing
  - Playwright for end-to-end testing
  - Testing utilities for TanStack Start features (server functions, routing)
- Configure environment variables using Vinxi's system:
  - .env in project root (gitignored)
  - .env.development for development environment
  - .env.production for production environment
  - TypeScript types for environment variables
  - Server-only variables for sensitive data (database credentials, auth secrets)
- Set up server functions directory structure with integration to @packages/api and @packages/db
- Configure server function middleware for error handling and authentication checks
- Configure build system to integrate with Turborepo pipelines
- Set up TypeScript configuration for strict type checking
- Configure ESLint and Prettier for code quality
- Set up Docker configuration for deployment to VPS

## Testing Decisions

- Test primarily at the integration level - verify that `apps/app` properly integrates with monorepo packages (@packages/api, @packages/auth, @packages/shared-types)
- Test server functions to ensure they work correctly with database operations and API calls
- Test at the component level for UI components using React Testing Library
- Test routing functionality to ensure file-based routing works as expected
- Test environment variable configuration for different environments
- Test build process to ensure Turborepo integration works correctly
- Prior art: Follow testing patterns established in existing monorepo packages
- Good tests focus on external behavior (HTTP responses, UI interactions) rather than implementation details
- Coverage target: 80% for the application code

## Documentation Impact

- **Architecture**: Update system architecture to reflect two separate web applications (marketing and app)
- **Monorepo Setup**: Update monorepo setup guide to reflect apps/app instead of apps/web for TanStack Start
- **Tech Stack**: No changes needed - TanStack Start is already specified
- **Quick Start**: Update quick start guide to include both apps/web and apps/app
- **Implementation Guide**: No changes needed - process remains the same

## Out of Scope

- Migration of any existing code from apps/web to apps/app
- Implementation of specific referee features (competition management, card management, etc.)
- Marketing website development (apps/web remains unchanged)
- Mobile application changes
- Database schema changes
- API endpoint development beyond basic integration
- Authentication flow implementation beyond basic configuration
- Production deployment configuration beyond basic Docker setup

## Further Notes

This PRD captures the architectural decision to separate marketing and referee applications into different subdomains (refbook.com and app.refbook.com). The marketing site will remain a simple Vite + React setup, while the referee application will use TanStack Start for full-stack capabilities. This separation allows for independent deployment, scaling, and development of each application.

The implementation follows the documented TanStack Start setup from the monorepo setup guide, with the only change being the directory/package name from `apps/web` to `apps/app`. This ensures consistency with existing documentation while establishing the correct architecture for the project.

## Dependencies

- [ ] Existing monorepo packages (@packages/api, @packages/auth, @packages/shared-types, @packages/db) are properly configured
- [ ] Turborepo is properly configured in the root
- [ ] PostgreSQL database is available for local development
- [ ] Node.js 18+ is installed

## Risks & Mitigations

- **Risk**: TanStack Start may have breaking changes or different API than documented
  **Mitigation**: Follow official TanStack Start documentation and test the setup thoroughly before proceeding with feature development

- **Risk**: Integration with existing monorepo packages may have compatibility issues
  **Mitigation**: Test integration points early and resolve any dependency conflicts before proceeding

- **Risk**: Environment variable configuration may be complex for server vs client separation
  **Mitigation**: Follow Vinxi documentation and test environment variable access patterns thoroughly

## Success Criteria

- [ ] apps/app directory created with TanStack Start properly installed
- [ ] Application can run in development mode with hot reload
- [ ] Application can build successfully for production
- [ ] Integration with all monorepo packages works correctly
- [ ] File-based routing is functional
- [ ] Server functions can access database and API packages
- [ ] shadcn/ui components can be used in the application
- [ ] Testing infrastructure is functional (Vitest, React Testing Library, Playwright)
- [ ] Environment variables work correctly for development and production
- [ ] Application can be containerized with Docker
- [ ] TypeScript compilation succeeds with no errors
- [ ] All tests pass with 80%+ coverage
