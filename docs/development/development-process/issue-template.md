---
title: "Issue Title"
status: "ready" # ready, in-progress, completed, blocked
priority: "high" # critical, high, medium, low
estimated_hours: 4
parent_prd: "../prd.md"
blocked_by: []
depends_on: []
test_type: "integration" # unit, integration, e2e
coverage_target: 80
---

# Issue Title

## Parent

Reference to the parent PRD: `../prd.md`

## What to Build

A concise description of this vertical slice. Describe the end-to-end behavior, not layer-by-layer implementation.

Avoid specific file paths or code snippets — they go stale fast. Exception: if a prototype produced a snippet that encodes a decision more precisely than prose can (state machine, reducer, schema, type shape), inline it here and note briefly that it came from a prototype. Trim to the decision-rich parts — not a working demo, just the important bits.

## User Stories Covered

- [ ] User story 1 from PRD
- [ ] User story 2 from PRD

## Acceptance Criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Testing Strategy

### Behaviors to Test
- Behavior 1: [description]
- Behavior 2: [description]
- Behavior 3: [description]

### Test Type
- **Type**: [unit/integration/e2e]
- **Reason**: [why this test type is appropriate]

### Test Seam
- **Location**: [where tests will be added]
- **Rationale**: [why this seam is appropriate]

### Prior Art
- **Reference**: [link to similar tests in codebase]
- **Similarity**: [how this relates to existing tests]

### Coverage Requirements
- **Target**: [X%]
- **Critical paths**: [specific areas requiring high coverage]

## Implementation Notes

### Technical Approach
[Describe the technical approach for this vertical slice]

### Integration Points
- [ ] Integration point 1
- [ ] Integration point 2

### Data Changes
- [ ] Schema changes (if any)
- [ ] Migration requirements (if any)

## Documentation Impact

- **Architecture**: [changes needed, if any]
- **Database**: [schema changes to document]
- **API**: [new/modified endpoints]
- **Testing**: [test strategy updates]
- **i18n**: [new translation keys]
- **Deployment**: [deployment considerations]
- **Frontend**: [component changes]
- **Backend**: [server logic changes]

## Blocked By

- [ ] Reference to blocking issue (if any)
- [ ] Or "None - can start immediately"

## Dependencies

- [ ] External dependency 1
- [ ] External dependency 2

## Definition of Done

- [ ] All acceptance criteria met
- [ ] All tests passing (unit + integration)
- [ ] TypeScript compilation successful
- [ ] Coverage targets met
- [ ] Documentation updated per impact section
- [ ] Documentation coherence verified
- [ ] No regressions in existing functionality
- [ ] Code follows project conventions
- [ ] **If this is the final slice in the PRD**: Move feature directory to `docs/development/completed/` and update PRD status to "completed" (see development-process/overview.md Phase 5)