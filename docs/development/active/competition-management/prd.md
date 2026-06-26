---
title: "Competition Management"
status: "active"
created: "2026-06-26"
author: "user/devin"
estimated_slices: 4
priority: "high"
---

# Competition Management PRD

## Problem Statement

Referees currently have no way to digitally create and manage competitions within the RefBook application. While the application foundation has been established with TanStack Start, shared packages, and basic routing, there is no functional ability to create competitions from templates, view competition details, manage competition status, or track competition history. This prevents referees from using the application for its core purpose - managing refereeing competitions.

## Solution

Implement a comprehensive competition management system that allows referees to create competitions from pre-configured templates (Football and Athletics), view and manage competition details, track competition status through its lifecycle (scheduled → in_progress → completed → cancelled), and maintain a competition history with filtering and search capabilities. The system will use JSON template files for sport-specific configuration and integrate with the existing database schema, tRPC API layer, and shadcn/ui components.

**Critical dependency**: This feature requires Better Auth email authentication to be implemented first to establish user ownership. Competition data will be associated with authenticated users, enabling proper data isolation and multi-user support.

## User Stories

### Competition Management
1. As a referee, I want to create a new competition from a template, so that I can quickly set up a refereeing assignment without configuring all settings manually.
2. As a referee, I want to choose between Football and Athletics templates, so that the competition is configured with the appropriate card types, match structure, and action types for my sport.
3. As a referee, I want to enter basic competition information (name, scheduled start time, location, notes), so that I have all necessary context for the competition.
4. As a referee, I want to view a list of all my competitions, so that I can quickly access current and past assignments.
5. As a referee, I want to filter competitions by status (scheduled, in_progress, completed, cancelled), so that I can focus on relevant competitions.
6. As a referee, I want to filter competitions by sport type (football, athletics), so that I can view competitions by sport.
7. As a referee, I want to search competitions by name or location, so that I can quickly find specific competitions.
8. As a referee, I want to view detailed information about a specific competition, so that I can review all competition context.
9. As a referee, I want to see the competition status prominently displayed, so that I know the current state of the competition.
10. As a referee, I want to update competition information (name, location, notes), so that I can correct errors or add missing information.
11. As a referee, I want to change the competition status (flexible transitions), so that I can manage the competition lifecycle.
12. As a referee, I want to cancel a competition if needed, so that I can handle cancellations appropriately.
13. As a referee, I want to see the competition timeline (scheduled_start, actual_start, actual_end), so that I can track the competition's temporal progression.
14. As a referee, I want to delete a competition if it was created in error, so that I can maintain clean competition records.
15. As a developer, I want competition data to persist in the PostgreSQL database, so that data is reliable and durable.
16. As a developer, I want competition configuration to come from JSON template files, so that adding new sports is straightforward and doesn't require database changes.
17. As a developer, I want the competition API to use tRPC for type safety, so that client and server stay synchronized.
18. As a developer, I want competition UI components to use shadcn/ui, so that the interface is consistent and accessible.
19. As a developer, I want competition forms to use TanStack Form for validation, so that user input is validated consistently.
20. As a developer, I want competition list to use TanStack Query for data fetching, so that data is cached and managed efficiently.
21. As a referee, I want to see which template was used for a competition, so that I understand the sport-specific configuration.
22. As a referee, I want the competition creation form to validate required fields, so that I don't create incomplete competitions.
23. As a referee, I want to see error messages if competition creation fails, so that I can correct input errors.
24. As a referee, I want the competition list to load quickly, so that I can access my competitions without delay.
25. As a referee, I want to be able to navigate from the competition list to competition details, so that I can drill down into specific competitions.
26. As a referee, I want to be able to navigate back from competition details to the competition list, so that I can easily return to the overview.
27. As a developer, I want the competition management system to be testable, so that we can ensure reliability through integration tests.
28. As a developer, I want the competition management system to follow TDD principles, so that code quality is maintained.

## Implementation Decisions

### Authentication Integration
- Use Better Auth session management for user identification
- Competition data will be associated with authenticated users via user_id
- Use Better Auth session hooks to protect competition routes
- Integrate with Better Auth user context throughout competition features

### Database Schema
- Extend the existing competitions table in packages/db/src/schema.ts to include all MVP fields from the documented schema
- Add missing fields: scheduled_start (timestamp), actual_start (timestamp, nullable), actual_end (timestamp, nullable), location (text, nullable), notes (text, nullable)
- Keep existing fields: id (uuid), user_id (text), sport_type (text), name (text), status (text), created_at (timestamp), updated_at (timestamp)
- **Remove version field** from current schema - MVP specification explicitly states "no version fields or audit logging"
- No optimistic concurrency control needed for MVP (deferred to post-MVP offline sync)
- No audit logging table needed for MVP (deferred to post-MVP)

### Template System
- Create JSON template files in apps/app/src/templates/ directory (bundled with the application)
- Implement football-template.json with card types, match structure (halves, 90 minutes, 2 halves), and action types (goal, substitution, card_log)
- Implement athletics-template.json with card types, match structure (events, track/field disciplines), and action types (false_start, lane_infringement)
- Templates will be imported directly in TypeScript files that use them (build-time bundling)
- TypeScript will validate JSON syntax at compile time
- Templates will be read-only in MVP (no editing or database storage)
- Template selection will be through a dropdown in competition creation form
- Template configuration will be provided to tRPC procedures through the imported data

### API Layer (tRPC)
- Create competition router in packages/api/src/router.ts with the following procedures:
  - competitions.list: Query to fetch all competitions for a user with optional filters (status, sport_type, date_range)
  - competitions.get: Query to fetch a single competition by ID
  - competitions.getTemplates: Query to fetch available template configurations
  - competitions.create: Mutation to create a new competition from a template
  - competitions.update: Mutation to update competition details
  - competitions.updateStatus: Mutation to update competition status
  - competitions.delete: Mutation to delete a competition
- No version checking needed for MVP (single-user, online-only)
- Input validation will use Zod schemas
- Simple error handling for database constraints and validation failures

### UI Components

#### Competition Components
- Create CompetitionList component in apps/app/src/components/CompetitionList.tsx
  - Display list of competitions with status indicators
  - Implement filtering by status and sport type
  - Implement search by name and location
  - Use TanStack Query for data fetching and caching
  - Use shadcn/ui components (Card, Button, Input, Select)
- Create CompetitionForm component in apps/app/src/components/CompetitionForm.tsx
  - Form for creating and editing competitions
  - Template selection dropdown
  - Date/time picker for scheduled_start
  - Text inputs for name, location, notes
  - Validation using TanStack Form
  - Integration with shadcn/ui form components
- Create CompetitionDetail component in apps/app/src/components/CompetitionDetail.tsx
  - Display all competition information
  - Show competition status prominently
  - Display timeline (scheduled, actual start, actual end)
  - Show template information
  - Actions for editing, status changes (flexible - no strict validation), deletion
- Update existing routes in apps/app/src/routes/
  - competitions.tsx: Use CompetitionList component
  - competitions.$id.tsx: Use CompetitionDetail component
  - Add competitions.new.tsx: Use CompetitionForm for creation

### State Management
- Use TanStack Query for server state management (competition list, competition details)
- Use TanStack Form for form state management (competition creation/editing, username entry)
- Use TanStack Router for navigation and route parameters
- Username state managed through React Context or simple localStorage wrapper
- No complex local state management needed beyond component state

### Error Handling
- Display user-friendly error messages for API failures
- Show validation errors inline in forms
- Handle database constraint errors (duplicate usernames, etc.)
- Show loading states during data fetching and mutations

### Status Management
- Competition status changes will be flexible with no strict state machine validation
- Users can change status to any valid status value at any time
- This allows referees to correct mistakes or handle unusual competition situations
- UI will provide all status options in a dropdown for maximum flexibility
- Timeline fields (actual_start, actual_end) are optional and can be set independently of status

### Testing Strategy
- Focus on integration tests that test the full stack (API → database → UI)
- Test competition CRUD operations through tRPC procedures
- Test form validation and error handling
- Test filtering and search functionality
- Test version conflict resolution
- Use existing test infrastructure in apps/app/src/__tests__/
- Coverage target: 80% for competition-related code

## Testing Decisions

### What Makes a Good Test
- Tests should focus on external behavior (API responses, UI interactions) rather than implementation details
- Tests should use public interfaces (tRPC procedures, user interactions) rather than internal functions
- Tests should be independent and isolated
- Tests should be deterministic and repeatable

### Modules to Test
- Username authentication (localStorage, uniqueness validation, UI components)
- Competition tRPC procedures (create, update, delete, list, get, getTemplates)
- Competition database operations (CRUD with version checking)
- Competition UI components (CompetitionList, CompetitionForm, CompetitionDetail)
- Competition form validation
- Competition filtering and search logic

### Test Seams
- Database integration tests will use test database schema
- tRPC procedure tests will use the actual tRPC router
- UI component tests will use React Testing Library
- Integration tests will use Vitest with test database
- Prior art: Existing tests in apps/app/src/__tests__/integration.test.ts and apps/app/src/__tests__/server-functions.test.ts

### Coverage Targets
- Overall coverage target: 80%
- Critical paths (competition CRUD operations): 90%+
- Error handling paths: 85%+
- UI components: 75%+

### Test Types
- Integration tests for competition API procedures
- Component tests for UI components
- Form validation tests
- Error handling tests
- Username uniqueness validation tests

## Documentation Impact

### Architecture
- Update docs/architecture/system-architecture.md to reflect competition management integration
- Update docs/architecture/monorepo-structure.md to show template files location

### Database
- Update docs/data-model/mvp-schema.md to reflect implemented competition schema
- Document any deviations from the planned schema

### API
- Document new tRPC procedures in a new API documentation file (or update existing if it exists)
- Document input/output schemas for competition procedures

### Implementation
- Create or update docs/implementation/competition-management.md with implementation details
- Document template file structure and format
- Document competition status flow and transitions

### Frontend
- Document new UI components in component documentation (if it exists)
- Document routing structure for competition pages

### Development Process
- This PRD will be moved to docs/development/completed/competition-management/ when all slices are implemented
- Individual issue files will track progress

## Out of Scope

- Template editing or creation (templates are read-only in MVP)
- Database storage of templates (using JSON files)
- Competition templates beyond Football and Athletics
- Multi-competition management (tournaments, leagues)
- Competition assignment to multiple referees
- Competition sharing or collaboration
- Competition analytics or reporting
- Competition export functionality
- Offline support for competitions (deferred to post-MVP)
- Real-time competition updates (deferred to post-MVP)
- Advanced competition features (video evidence, photo attachments)

## Further Notes

Competition management is the foundation for all other features in the MVP. Cards, actions, and disqualifications all depend on competitions existing first. This implementation establishes the patterns and architecture that will be reused for subsequent features. The template system using JSON files is a deliberate simplification for MVP that allows for easy database migration in the future when a full template management system is needed.

**Better Auth Integration**: Competition Management uses Better Auth for user authentication and ownership. Competition data is associated with authenticated users, providing proper data isolation and multi-user support from day one. Better Auth session management protects competition routes and provides user context throughout the application.

**MVP Simplicity**: This implementation follows the MVP principle of "essential fields only" - no version fields, no audit logging, no optimistic concurrency control. These features will be added in post-MVP when offline sync and collaboration are implemented.

## Dependencies

- [x] TanStack Start application setup (Phase 1.1 completed)
- [x] Shared packages refactoring (completed)
- [x] Database schema foundation (users and basic competitions table exist)
- [x] tRPC router foundation exists in packages/api
- [x] shadcn/ui components available in @packages/ui
- [x] TanStack Query configured in apps/app
- [x] TanStack Form available in apps/app
- [ ] **Better Auth email authentication** (must be implemented first - see email-auth-better-auth PRD)
- [ ] PostgreSQL database available for local development
- [ ] Database migrations configured and working

## Risks & Mitigations

- **Risk**: Template JSON file structure might need iteration after implementation
  **Mitigation**: Start with documented structure, be prepared to refine based on usage patterns

- **Risk**: Form validation might be insufficient for real-world use
  **Mitigation**: Start with basic validation, gather feedback, iterate in post-MVP

- **Risk**: Database schema changes might require migrations during development
  **Mitigation**: Use Drizzle migrations, test migrations thoroughly, keep migration history

- **Risk**: Better Auth integration might have compatibility issues
  **Mitigation**: Better Auth is designed for modern frameworks, test integration thoroughly

## Success Criteria

- [ ] Competition data is associated with authenticated users via Better Auth
- [ ] Competition routes are protected by Better Auth session checks
- [ ] Users can create competitions from Football and Athletics templates
- [ ] Users can view a list of all their competitions with filtering and search
- [ ] Users can view detailed information about a specific competition
- [ ] Users can update competition information
- [ ] Users can change competition status (flexible transitions)
- [ ] Users can delete competitions
- [ ] All competition data persists correctly in PostgreSQL
- [ ] Template JSON files are correctly structured and imported
- [ ] All tRPC procedures are type-safe and validated
- [ ] UI components use shadcn/ui consistently
- [ ] Forms use TanStack Form with proper validation
- [ ] Data fetching uses TanStack Query with caching
- [ ] Integration tests achieve 80% coverage
- [ ] All tests pass (unit + integration)
- [ ] TypeScript compilation succeeds
- [ ] No regressions in existing functionality
- [ ] Documentation is updated to reflect implementation
