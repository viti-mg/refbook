---
title: "Competition UI Components and Routes"
status: "ready"
priority: "high"
estimated_hours: 6
parent_prd: "../prd.md"
blocked_by: ["01-database-schema-extension.md", "02-template-system-setup.md", "03-competition-api-procedures.md"]
depends_on: ["01-database-schema-extension.md", "02-template-system-setup.md", "03-competition-api-procedures.md"]
test_type: "integration"
coverage_target: 80
---

# Competition UI Components and Routes

## Parent

Reference to the parent PRD: `../prd.md`

## What to Build

Create CompetitionList, CompetitionForm, and CompetitionDetail components in apps/app/src/components/, implement competition routes in apps/app/src/routes/, integrate with TanStack Query for data fetching, TanStack Form for form validation, and Better Auth for route protection. This slice creates the user interface for competition management and connects it to the API layer.

## User Stories Covered

- [x] As a referee, I want to create a new competition from a template, so that I can quickly set up a refereeing assignment without configuring all settings manually.
- [x] As a referee, I want to choose between Football and Athletics templates, so that the competition is configured with the appropriate card types, match structure, and action types for my sport.
- [x] As a referee, I want to enter basic competition information (name, scheduled start time, location, notes), so that I have all necessary context for the competition.
- [x] As a referee, I want to view a list of all my competitions, so that I can quickly access current and past assignments.
- [x] As a referee, I want to filter competitions by status (scheduled, in_progress, completed, cancelled), so that I can focus on relevant competitions.
- [x] As a referee, I want to filter competitions by sport type (football, athletics), so that I can view competitions by sport.
- [x] As a referee, I want to search competitions by name or location, so that I can quickly find specific competitions.
- [x] As a referee, I want to view detailed information about a specific competition, so that I can review all competition context.
- [x] As a referee, I want to see the competition status prominently displayed, so that I know the current state of the competition.
- [x] As a referee, I want to update competition information (name, location, notes), so that I can correct errors or add missing information.
- [x] As a referee, I want to change competition status (flexible transitions), so that I can manage the competition lifecycle.
- [x] As a referee, I want to cancel a competition if needed, so that I can handle cancellations appropriately.
- [x] As a referee, I want to see the competition timeline (scheduled_start, actual_start, actual_end), so that I can track the competition's temporal progression.
- [x] As a referee, I want to delete a competition if it was created in error, so that I can maintain clean competition records.
- [x] As a developer, I want competition UI components to use shadcn/ui, so that the interface is consistent and accessible.
- [x] As a developer, I want competition forms to use TanStack Form for validation, so that user input is validated consistently.
- [x] As a developer, I want competition list to use TanStack Query for data fetching, so that data is cached and managed efficiently.
- [x] As a referee, I want to see which template was used for a competition, so that I understand the sport-specific configuration.
- [x] As a referee, I want the competition creation form to validate required fields, so that I don't create incomplete competitions.
- [x] As a referee, I want to see error messages if competition creation fails, so that I can correct input errors.
- [x] As a referee, I want the competition list to load quickly, so that I can access my competitions without delay.
- [x] As a referee, I want to be able to navigate from the competition list to competition details, so that I can drill down into specific competitions.
- [x] As a referee, I want to be able to navigate back from competition details to the competition list, so that I can easily return to the overview.

## Acceptance Criteria

- [ ] CompetitionList component created in apps/app/src/components/CompetitionList.tsx
- [ ] CompetitionForm component created in apps/app/src/components/CompetitionForm.tsx
- [ ] CompetitionDetail component created in apps/app/src/components/CompetitionDetail.tsx
- [ ] competitions.tsx route uses CompetitionList component
- [ ] competitions.$id.tsx route uses CompetitionDetail component
- [ ] competitions.new.tsx route uses CompetitionForm component
- [ ] CompetitionList displays competitions with filtering (status, sport_type) and search
- [ ] CompetitionList uses TanStack Query for data fetching and caching
- [ ] CompetitionForm includes template selection dropdown
- [ ] CompetitionForm includes date/time picker for scheduled_start
- [ ] CompetitionForm includes text inputs for name, location, notes
- [ ] CompetitionForm uses TanStack Form for validation
- [ ] CompetitionDetail displays all competition information
- [ ] CompetitionDetail shows competition status prominently
- [ ] CompetitionDetail displays timeline (scheduled, actual start, actual end)
- [ ] CompetitionDetail shows template information
- [ ] CompetitionDetail includes actions for editing, status changes, deletion
- [ ] All components use shadcn/ui components consistently
- [ ] Competition routes are protected by Better Auth session checks
- [ ] Navigation between list and detail views works correctly
- [ ] Error messages display correctly for API failures
- [ ] Loading states display during data fetching
- [ ] Competition data is associated with authenticated user

## Testing Strategy

### Behaviors to Test
- Behavior 1: CompetitionList loads and displays competitions correctly
- Behavior 2: CompetitionList filtering works (status, sport_type)
- Behavior 3: CompetitionList search works correctly
- Behavior 4: CompetitionForm creates competition correctly
- Behavior 5: CompetitionForm validation works correctly
- Behavior 6: CompetitionDetail displays competition information correctly
- Behavior 7: CompetitionDetail status changes work correctly
- Behavior 8: CompetitionDetail deletion works correctly
- Behavior 9: Navigation between routes works correctly
- Behavior 10: Route protection redirects unauthenticated users correctly
- Behavior 11: Error handling works correctly for API failures

### Test Type
- **Type**: Integration
- **Reason**: UI components need to be tested with actual API integration

### Test Seam
- **Location**: apps/app/src/__tests__/competition-ui.test.ts
- **Rationale**: Test the UI components at the app level where they're used

### Prior Art
- **Reference**: Existing UI component tests in apps/app/src/__tests__/ui-framework.test.tsx
- **Similarity**: Similar to how other UI components are tested

### Coverage Requirements
- **Target**: 80%
- **Critical paths**: CRUD operations, form validation, navigation, route protection

## Implementation Notes

### Technical Approach
Create CompetitionList, CompetitionForm, and CompetitionDetail components using React and shadcn/ui. Use TanStack Query for data fetching with tRPC procedures. Use TanStack Form for form validation. Use TanStack Router for navigation and route parameters. Use Better Auth session hooks for route protection. Update existing routes to use the new components.

### Integration Points
- [x] packages/api (tRPC procedures)
- [x] packages/ui (shadcn/ui components)
- [x] packages/auth (Better Auth session)
- [ ] apps/app (routes and components)

### Data Changes
- [ ] No schema changes (schema already extended in slice 01)
- [ ] No migration requirements

## Documentation Impact

- **Frontend**: Document competition components in component documentation
- **Implementation**: Update docs/implementation/competition-management.md with UI details

## Blocked By

- [x] 01-database-schema-extension.md (database schema must be extended first)
- [x] 02-template-system-setup.md (templates must be available first)
- [x] 03-competition-api-procedures.md (API procedures must be implemented first)

## Dependencies

- [x] 01-database-schema-extension.md (database schema must be extended first)
- [x] 02-template-system-setup.md (templates must be available first)
- [x] 03-competition-api-procedures.md (API procedures must be implemented first)

## Definition of Done

- [ ] All acceptance criteria met
- [ ] All tests passing (integration)
- [ ] TypeScript compilation successful
- [ ] Coverage targets met (80%)
- [ ] Documentation updated per impact section
- [ ] Documentation coherence verified
- [ ] No regressions in existing functionality
- [ ] Code follows project conventions
- [ ] **If this is the final slice in the PRD**: Move feature directory to docs/development/completed/ and update PRD status to "completed" (see development-process/overview.md Phase 5)
