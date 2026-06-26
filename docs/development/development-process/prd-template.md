---
title: "Feature Name"
status: "active" # active, completed, archived
created: "YYYY-MM-DD"
author: "user/agent"
estimated_slices: 3
priority: "high" # critical, high, medium, low
---

# Feature Name PRD

## Problem Statement

The problem that the user is facing, from the user's perspective.

## Solution

The solution to the problem, from the user's perspective.

## User Stories

A LONG, numbered list of user stories. Each user story should be in the format of:

1. As an <actor>, I want a <feature>, so that <benefit>

Example:
1. As a mobile bank customer, I want to see balance on my accounts, so that I can make better informed decisions about my spending

This list of user stories should be extremely extensive and cover all aspects of the feature.

## Implementation Decisions

A list of implementation decisions that were made. This can include:

- The modules that will be built/modified
- The interfaces of those modules that will be modified
- Technical clarifications from the developer
- Architectural decisions
- Schema changes
- API contracts
- Specific interactions

Do NOT include specific file paths or code snippets. They may end up being outdated very quickly.

Exception: if a prototype produced a snippet that encodes a decision more precisely than prose can (state machine, reducer, schema, type shape), inline it within the relevant decision and note briefly that it came from a prototype. Trim to the decision-rich parts — not a working demo, just the important bits.

## Testing Decisions

A list of testing decisions that were made. Include:

- A description of what makes a good test (only test external behavior, not implementation details)
- Which modules will be tested
- Prior art for the tests (i.e. similar types of tests in the codebase)
- Test seams and integration points
- Coverage targets

## Documentation Impact

- **Architecture**: [changes needed, if any]
- **Database**: [schema changes to document]
- **API**: [new/modified endpoints]
- **Testing**: [test strategy updates]
- **i18n**: [new translation keys]
- **Deployment**: [deployment considerations]
- **Frontend**: [component changes]
- **Backend**: [server logic changes]

## Out of Scope

A description of the things that are out of scope for this PRD.

## Further Notes

Any further notes about the feature.

## Dependencies

- [ ] Dependency 1
- [ ] Dependency 2

## Risks & Mitigations

- **Risk**: Description of risk
  **Mitigation**: How to address it

## Success Criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3