---
title: "Template System Setup"
status: "completed"
priority: "high"
estimated_hours: 2
parent_prd: "../prd.md"
blocked_by: ["01-database-schema-extension.md"]
depends_on: ["01-database-schema-extension.md"]
test_type: "integration"
coverage_target: 80
---

# Template System Setup

## Parent

Reference to the parent PRD: `../prd.md`

## What to Build

Create JSON template files for Football and Athletics sports in apps/app/src/templates/, implement the template structure with card types, match structure, and action types as documented in the MVP schema, and ensure templates can be imported and used by the competition system. This slice establishes the template configuration system that drives competition setup.

## User Stories Covered

- [x] As a developer, I want competition configuration to come from JSON template files, so that adding new sports is straightforward and doesn't require database changes.

## Acceptance Criteria

- [x] Football template file created at apps/app/src/templates/football-template.json
- [x] Athletics template file created at apps/app/src/templates/athletics-template.json
- [x] Football template includes card types (yellow, red) with colors and display durations
- [x] Football template includes match structure (halves, 90 minutes, 2 halves, allow_extra_time)
- [x] Football template includes action types (goal, substitution, card_log) with field definitions
- [x] Athletics template includes card types (yellow, red) with colors and display durations
- [x] Athletics template includes match structure (events, track/field disciplines)
- [x] Athletics template includes action types (false_start, lane_infringement) with field definitions
- [x] Template JSON files are valid JSON and can be imported in TypeScript
- [x] Template structure matches documented MVP schema exactly
- [x] Templates are TypeScript-typed for type safety

## Testing Strategy

### Behaviors to Test
- Behavior 1: Template files can be imported without errors
- Behavior 2: Template structure matches expected format
- Behavior 3: Template data is accessible and usable in code
- Behavior 4: TypeScript types are correctly inferred from template JSON

### Test Type
- **Type**: Integration
- **Reason**: Template files need to be tested as they will be used in the application

### Test Seam
- **Location**: apps/app/src/__tests__/templates.test.ts
- **Rationale**: Test templates at the app level where they will be used

### Prior Art
- **Reference**: Existing test patterns in apps/app/src/__tests__/
- **Similarity**: Similar to how other configuration files are tested

### Coverage Requirements
- **Target**: 80%
- **Critical paths**: Template import, structure validation, type safety

## Implementation Notes

### Technical Approach
Create JSON template files in apps/app/src/templates/ following the documented MVP schema structure. Use TypeScript's JSON import feature to get type-safe access to template data. Ensure templates include all required fields: card_types, match_structure, and action_types.

### Integration Points
- [x] apps/app (template files location)
- [x] TypeScript (type-safe JSON imports)

### Data Changes
- [x] No schema changes (templates are static files)
- [x] No migration requirements

## Documentation Impact

- [x] **Implementation**: Document template structure in docs/implementation/competition-management.md
- [ ] **Frontend**: Document template usage in component documentation

## Blocked By

- [x] 01-database-schema-extension.md (database schema should be finalized before templates)

## Dependencies

- [x] 01-database-schema-extension.md (ensures data model is ready for templates)

## Definition of Done

- [x] All acceptance criteria met
- [x] All tests passing (integration)
- [x] TypeScript compilation successful
- [x] Coverage targets met (80%)
- [x] Documentation updated per impact section
- [x] Documentation coherence verified
- [x] No regressions in existing functionality
- [x] Code follows project conventions
