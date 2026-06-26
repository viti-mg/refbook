---
title: "API Integration & Web App UI"
status: "completed"
priority: "critical"
estimated_hours: 6
parent_prd: "../prd.md"
blocked_by: ["01-better-auth-config-schema.md"]
depends_on: ["01-better-auth-config-schema.md"]
test_type: "integration"
coverage_target: 85
---

# API Integration & Web App UI

## Parent

Reference to the parent PRD: `../prd.md`

## What to Build

Integrate Better Auth with the tRPC router in packages/api to provide shared auth procedures, create SignUp and SignIn UI components in apps/app, implement route protection using Better Auth session hooks, and update the Header component to display user information and sign out functionality. This slice connects the configured Better Auth instance to the web application through both API and UI layers.

## User Stories Covered

- [x] As a new user, I want to sign up with email and password, so that I can establish my identity in the system.
- [x] As a returning user, I want to sign in with email and password, so that I can access my account and data.
- [x] As a user, I want to see my email address displayed in the UI, so that I know which identity I'm using.
- [x] As a user, I want to be able to sign out, so that I can securely end my session.
- [x] As a user, I want my session to persist across browser sessions, so that I don't have to sign in every time.
- [x] As a user, I want to receive clear error messages if my sign up/sign in fails, so that I can correct any issues.
- [x] As a developer, I want auth procedures to be available through the shared tRPC API, so that both web and mobile apps can use the same auth layer.

## Acceptance Criteria

- [x] tRPC router in packages/api includes auth procedures (signUp, signIn, signOut, getSession)
- [x] Better Auth is integrated with tRPC using Better Auth's tRPC integration
- [x] SignUp component created in apps/app/src/components/SignUp.tsx
- [x] SignIn component created in apps/app/src/components/SignIn.tsx
- [x] Sign up flow works (email, password, validation, success, failure)
- [x] Sign in flow works (email, password, validation, success, failure)
- [x] Sign out flow works (session clearing, redirect)
- [x] Header component displays user email when authenticated
- [x] Header component includes sign out button
- [x] Sessions persist across page refreshes
- [x] Route protection works (unauthenticated users redirected to sign-in)
- [x] Protected routes (competitions, etc.) require authentication
- [x] Public routes (sign-in, sign-up) don't require authentication
- [x] Better Auth React client hooks work correctly (useSession, signIn, signUp, signOut)
- [x] Integration with TanStack Router loaders works correctly

## Testing Strategy

### Behaviors to Test
- Behavior 1: tRPC auth procedures are callable and return correct data
- Behavior 2: Sign up creates user account and session correctly
- Behavior 3: Sign in validates credentials and creates session correctly
- Behavior 4: Sign out clears session and redirects correctly
- Behavior 5: Session persistence works across page refreshes
- Behavior 6: Route protection redirects unauthenticated users correctly
- Behavior 7: Header displays user information when authenticated
- Behavior 8: Error handling works for invalid credentials and network failures

### Test Type
- **Type**: Integration
- **Reason**: Need to test the full integration between Better Auth, tRPC, and UI components

### Test Seam
- **Location**: apps/app/src/__tests__/auth-integration.test.ts
- **Rationale**: Test the auth integration at the app level where all components come together

### Prior Art
- **Reference**: Existing integration tests in apps/app/src/__tests__/integration.test.ts
- **Similarity**: Similar to how other feature integrations are tested

### Coverage Requirements
- **Target**: 85%
- **Critical paths**: Auth flows (sign up, sign in, sign out), route protection, session management

## Implementation Notes

### Technical Approach
Add auth procedures to tRPC router in packages/api/src/router.ts using Better Auth's tRPC integration. Create SignUp and SignIn components in apps/app using Better Auth React client. Implement route protection in TanStack Router using Better Auth session hooks. Update Header component to display user info and sign out button.

### Integration Points
- [x] packages/auth (Better Auth instance)
- [ ] packages/api (tRPC router)
- [ ] packages/db (database access through Better Auth)
- [ ] apps/app (UI components and routes)

### Data Changes
- [ ] No schema changes (schema already generated in slice 01)
- [ ] No migration requirements

## Documentation Impact

- **API**: Document auth tRPC procedures in API documentation
- **Frontend**: Document SignUp, SignIn, and Header components
- **Implementation**: Update docs/implementation/better-auth-setup.md with integration details
- **Architecture**: Update docs/architecture/system-architecture.md to reflect auth integration

## Blocked By

- [x] 01-better-auth-config-schema.md (must complete Better Auth configuration first)

## Dependencies

- [x] 01-better-auth-config-schema.md (Better Auth must be configured first)

## Definition of Done

- [x] All acceptance criteria met
- [x] All tests passing (integration)
- [x] TypeScript compilation successful
- [x] Coverage targets met (85%)
- [x] Documentation updated per impact section
- [x] Documentation coherence verified
- [x] No regressions in existing functionality
- [x] Code follows project conventions
- [x] **If this is the final slice in the PRD**: Move feature directory to docs/development/completed/ and update PRD status to "completed" (see development-process/overview.md Phase 5)
