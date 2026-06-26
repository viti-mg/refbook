---
title: "Email Authentication with Better Auth"
status: "active"
created: "2026-06-26"
author: "user/devin"
estimated_slices: 2
priority: "critical"
---

# Email Authentication with Better Auth PRD

## Problem Statement

The Competition Management feature requires user ownership to work correctly (competitions belong to specific users). Without authentication, the application cannot establish data ownership, which breaks the core data model. The current foundation has no authentication system, making it impossible to implement features that require user-specific data.

## Solution

Implement email-based authentication using Better Auth, a modern authentication framework that provides proper schema generation, session management, and security best practices out of the box. Users will sign up with email and password (minimal implementation), establishing real user ownership from day one with a production-ready auth system that can be enhanced later with additional features (OAuth, 2FA, etc.) without migration.

## User Stories

1. As a new user, I want to sign up with email and password, so that I can establish my identity in the system.
2. As a returning user, I want to sign in with my email and password, so that I can access my account and data.
3. As a user, I want to see my email address displayed in the UI, so that I know which identity I'm using.
4. As a user, I want to be able to sign out, so that I can securely end my session.
5. As a user, I want my session to persist across browser sessions, so that I don't have to sign in every time.
6. As a user, I want to receive clear error messages if my sign up/sign in fails, so that I can correct any issues.
7. As a developer, I want Better Auth to handle database schema generation, so that I don't have to maintain auth tables manually.
8. As a developer, I want Better Auth to handle session management automatically, so that I don't have to implement session logic.
9. As a developer, I want Better Auth to provide built-in security best practices, so that the auth system is secure from day one.
10. As a developer, I want Better Auth to integrate with Drizzle ORM, so that it works with our existing database setup.
11. As a developer, I want Better Auth to provide type-safe client and server APIs, so that I get end-to-end type safety.
12. As a developer, I want the auth system to be extensible for future features (OAuth, 2FA, etc.), so that we can enhance it without rewriting.
13. As a developer, I want auth procedures to be available through the shared tRPC API, so that both web and mobile apps can use the same auth layer.
14. As a developer, I want the auth system to be testable, so that we can ensure reliability through integration tests.

## Implementation Decisions

### Better Auth Setup
- Configure Better Auth in existing packages/auth (Better Auth already installed)
- Configure Better Auth with email/password authentication enabled
- Set up environment variables: BETTER_AUTH_SECRET and BETTER_AUTH_URL
- Use Drizzle adapter for database integration
- Configure Better Auth to use existing PostgreSQL database via @packages/db
- Run Better Auth CLI to generate and apply schema: `npx @better-auth/cli migrate`
- Create or update auth.ts configuration file in packages/auth/src/
- Set up Better Auth API route handler in apps/app
- Export Better Auth instance and types from packages/auth for use in apps/app

### Database Schema
- Use Better Auth's auto-generated schema (users, sessions, accounts, verification_tokens tables)
- No manual schema creation needed - Better Auth handles this
- Better Auth will create proper indexes, constraints, and relationships
- Schema will be compatible with future Better Auth enhancements (OAuth, 2FA, etc.)

### Authentication Flow
- Sign up: Users provide email and password → Better Auth creates user account and session
- Sign in: Users provide email and password → Better Auth validates and creates session
- Session management: Better Auth handles session cookies and storage automatically
- Sign out: Better Auth clears session and cookies
- Session persistence: Better Auth handles cookie-based session persistence

### API Integration
- Integrate Better Auth with tRPC router in packages/api
- Add auth procedures to the shared tRPC router (signUp, signIn, signOut, getSession)
- Use Better Auth's tRPC integration for type-safe auth procedures
- Export auth procedures from packages/api for use in apps/app and future mobile apps
- Create Better Auth client in apps/app using Better Auth React client
- Integrate Better Auth session hooks with TanStack Start routes
- Protect routes that require authentication using Better Auth session checks

### UI Components
- Create SignUp component in apps/app/src/components/SignUp.tsx
  - Email and password input form
  - Form validation using Better Auth client
  - Error message display
  - Success redirect to app
- Create SignIn component in apps/app/src/components/SignIn.tsx
  - Email and password input form
  - Form validation using Better Auth client
  - Error message display
  - "Don't have an account? Sign up" link
- Update Header component in apps/app/src/components/Header.tsx
  - Display current user email from Better Auth session
  - Add sign out button
  - Show loading states during auth operations

### State Management
- Use Better Auth React client hooks (useSession, signIn, signUp, signOut)
- Better Auth handles session state automatically
- No custom state management needed for authentication

### Error Handling
- Better Auth provides built-in error handling for authentication failures
- Display Better Auth error messages in sign up/sign in forms
- Better Auth handles database connection errors gracefully
- Better Auth handles validation errors automatically
- Show loading states during auth operations using Better Auth client states
- Better Auth provides security best practices (CSRF protection, secure cookies, etc.)

### Integration with Existing Routes
- Add authentication check to __root layout using Better Auth session hooks
- Create public routes (sign-in, sign-up) that don't require authentication
- Protect existing routes (competitions, etc.) to require authentication
- Redirect unauthenticated users to sign-in page
- Integrate Better Auth session with TanStack Router loader functions

## Testing Decisions

### What Makes a Good Test
- Tests should focus on external behavior (sign up/sign in flows, session management) rather than Better Auth internals
- Tests should use Better Auth client methods rather than internal functions
- Tests should be independent and isolated
- Tests should cover successful and failed authentication scenarios

### Modules to Test
- Sign up flow (email, password, validation, success, failure)
- Sign in flow (email, password, validation, success, failure)
- Sign out flow (session clearing, redirect)
- Session persistence across page refreshes
- Route protection (redirect unauthenticated users)
- Header component (user display, sign out button)
- Integration with TanStack Router loaders

### Test Seams
- Database integration tests will use test database with Better Auth schema
- Better Auth configuration can be mocked for unit tests
- UI component tests will use React Testing Library
- Integration tests will use Vitest with test database
- Better Auth client can be tested with mock server responses

### Coverage Targets
- Overall coverage target: 80%
- Critical auth flows (sign up, sign in, sign out): 90%+
- Route protection logic: 85%+
- UI components: 75%+

### Test Types
- Integration tests for Better Auth configuration
- Component tests for SignUp, SignIn, and Header components
- Form validation tests
- Session management tests
- Route protection tests
- Error handling tests (invalid credentials, network errors)

## Documentation Impact

### Architecture
- Update docs/architecture/system-architecture.md to reflect Better Auth integration
- Document Better Auth configuration and setup

### Database
- Document Better Auth auto-generated schema
- Note that Better Auth manages auth tables automatically

### API
- Document Better Auth API routes and endpoints
- Document integration with tRPC if applicable

### Implementation
- Create docs/implementation/better-auth-setup.md with implementation details
- Document environment variables and configuration
- Document Better Auth CLI commands for schema management

### Frontend
- Document new SignUp and SignIn components
- Document Header component changes
- Document authentication flow in user guide

### Development Process
- This PRD will be moved to docs/development/completed/email-auth-better-auth/ when all slices are implemented
- Competition Management PRD will be unblocked and can proceed

## Out of Scope

- Email verification (deferred to post-MVP)
- Social login (OAuth, etc.) (deferred to post-MVP)
- Multi-factor authentication (deferred to post-MVP)
- User profile management (deferred to post-MVP)
- Account recovery (password reset) (deferred to post-MVP)
- Username functionality (deferred to post-MVP)
- Organization management (deferred to post-MVP)
- Advanced session management (deferred to post-MVP)

## Further Notes

This implementation uses Better Auth to provide production-ready authentication from day one. Better Auth handles schema generation, session management, security best practices, and provides a solid foundation for future enhancements. The email/password authentication is simple to implement and aligns well with the MVP principle of "essential features only" while providing a robust auth system that can grow with the application.

**Better Auth Benefits**:
- Auto-generated schema with proper constraints and indexes
- Built-in security (CSRF protection, secure cookies, password hashing)
- Type-safe APIs for both client and server
- Easy to extend with plugins (OAuth, 2FA, etc.)
- Battle-tested and actively maintained

**Migration Path**: Since we're using Better Auth from day one, there's no migration needed when adding advanced features later. We can simply enable additional Better Auth plugins and features as needed.

**Session Management**: Better Auth handles session persistence automatically using secure cookies. Users stay signed in across browser sessions, and sessions can be revoked through the sign out functionality.

## Dependencies

- [x] TanStack Start application setup (Phase 1.1 completed)
- [x] Shared packages refactoring (completed)
- [x] packages/auth exists with Better Auth installed
- [x] Database schema foundation (basic setup exists)
- [x] tRPC router foundation exists in packages/api
- [x] shadcn/ui components available in @packages/ui
- [x] TanStack Query configured in apps/app
- [x] TanStack Form available in apps/app
- [ ] PostgreSQL database available for local development
- [ ] Better Auth CLI available for schema generation

## Risks & Mitigations

- **Risk**: Better Auth might have breaking changes or different API than documented
  **Mitigation**: Follow official Better Auth documentation and test thoroughly; Better Auth is actively maintained

- **Risk**: Better Auth schema generation might conflict with existing database setup
  **Mitigation**: Test schema generation in development environment; Better Auth is designed to work with existing databases

- **Risk**: Better Auth configuration might be complex for simple email/password auth
  **Mitigation**: Better Auth is designed to be simple for basic use cases; start with minimal config

- **Risk**: Users might forget passwords since there's no password reset in MVP
  **Mitigation**: Accepted MVP limitation; document clearly; password reset can be added post-MVP

## Success Criteria

- [ ] Users can sign up with email and password
- [ ] Users can sign in with email and password
- [ ] Users can sign out securely
- [ ] Sessions persist across browser refreshes
- [ ] Better Auth schema is generated and applied successfully
- [ ] Better Auth configuration works with existing PostgreSQL database
- [ ] Better Auth API routes are accessible and functional
- [ ] Unauthenticated users are redirected to sign-in page when accessing protected routes
- [ ] Authenticated users can access protected routes
- [ ] User email is displayed in the UI header
- [ ] Sign out button clears session and redirects appropriately
- [ ] Better Auth React client hooks work correctly (useSession, signIn, signUp, signOut)
- [ ] Integration with TanStack Router loaders works correctly
- [ ] All auth flows have proper error handling and validation
- [ ] Integration tests achieve 80% coverage
- [ ] All tests pass (unit + integration)
- [ ] TypeScript compilation succeeds
- [ ] No regressions in existing functionality
- [ ] Documentation is updated to reflect implementation
- [ ] Competition Management PRD is unblocked and can proceed
- [ ] All auth procedures are type-safe and validated
- [ ] UI components use shadcn/ui consistently
- [ ] Forms use TanStack Form with proper validation
- [ ] Data fetching uses TanStack Query with caching
- [ ] Integration tests achieve 80% coverage
- [ ] All tests pass (unit + integration)
- [ ] TypeScript compilation succeeds
- [ ] No regressions in existing functionality
- [ ] Documentation is updated to reflect implementation
- [ ] Competition Management PRD is unblocked and can proceed
