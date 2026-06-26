# Development Process Implementation Guide

This guide provides step-by-step instructions for following the RefBook development process.

## Quick Start

When you want to implement a new feature:

1. **Request feature** through an AI agent
2. **Get grilled** - Agent will interview you using `/grill-me`
3. **Review PRD** - Agent creates PRD using `/to-prd`
4. **Approve issues** - Agent breaks down into vertical slices using `/to-issues`
5. **Implement** - Agent implements slices autonomously using TDD
6. **Validate** - Agent updates docs, runs tests, and commits
7. **Complete feature** - Agent moves feature to `completed/` when all slices are done

## Detailed Workflow

### Step 1: Initiate Feature Development

**Your action**: Tell an AI agent what feature you want to build.

**Example prompt**:
```
I want to add user authentication to the application. Users should be able to sign up with email and password, log in, and reset their password.
```

**Agent action**: Invokes `/grill-me` skill to interview you.

### Step 2: Grilling Session

**Agent action**: Uses `/grill-me` to interview you relentlessly about:
- Problem statement and user needs
- Technical requirements and constraints
- Edge cases and error scenarios
- Integration points with existing systems
- Security considerations
- Documentation impact

**Your role**: Answer questions honestly. Be prepared for the agent to push back on ideas.

**Example grilling questions**:
- What happens if a user forgets their password?
- Should we support social login (Google, GitHub)?
- What are your security requirements for password storage?
- How does authentication integrate with existing user management?
- What happens to unauthenticated users trying to access protected routes?

**Success criteria**: You and the agent reach "shared understanding" of the feature.

### Step 3: PRD Creation

**Agent action**: Uses `/to-prd` skill to create comprehensive PRD.

**Agent process**:
1. Explores codebase to understand current state
2. Identifies test seams (prefers existing seams)
3. Writes PRD using standard template
4. Saves to `docs/development-process/active/[feature-name]/prd.md`

**Your action**: Review the PRD for accuracy and completeness.

**PRD structure**:
```markdown
---
title: "User Authentication"
status: "active"
created: "2026-06-20"
author: "agent"
estimated_slices: 4
priority: "critical"
---

## Problem Statement
[From user perspective]

## Solution
[From user perspective]

## User Stories
[Extensive list in "As an actor, I want feature, so that benefit" format]

## Implementation Decisions
[Technical decisions, no file paths]

## Testing Decisions
[Test strategy, seams, coverage]

## Documentation Impact
[Which docs need updating]

## Out of Scope
[What's not included]
```

### Step 4: Issue Breakdown

**Agent action**: Uses `/to-issues` skill to break PRD into vertical slices.

**Agent process**:
1. Analyzes PRD and codebase
2. Creates tracer bullet issues (vertical slices)
3. Each issue cuts through ALL layers end-to-end
4. Identifies dependencies between issues
5. Quizzes you on breakdown

**Your action**: Review and approve the breakdown.

**Example breakdown**:
```
1. 01-database-schema.md (no dependencies)
2. 02-auth-api.md (blocked by 01)
3. 03-login-ui.md (blocked by 02)
4. 04-password-reset.md (blocked by 02)
```

**Agent quiz questions**:
- Does the granularity feel right? (too coarse / too fine)
- Are the dependency relationships correct?
- Should any slices be merged or split further?

**Iteration**: Continue until you approve the breakdown.

### Step 5: Issue Selection

**Your action**: Choose which issue to implement next.

**Rule**: Always choose the first unblocked issue in dependency order.

**Example**: If issue 01 is completed, choose issue 02 (next unblocked).

### Step 6: Implementation

**Agent action**: Implements the vertical slice following TDD.

**Agent process**:

#### Pre-Implementation Checklist
- [ ] PRD exists and is approved
- [ ] Issue file exists with complete frontmatter
- [ ] Testing strategy is defined
- [ ] Documentation impact is identified
- [ ] Dependencies are unblocked
- [ ] No conflicting work in progress

#### TDD Implementation
1. **Red phase**: Write ONE failing test
2. **Green phase**: Write MINIMAL code to pass
3. **Refactor phase**: Improve code quality
4. **Repeat** for each behavior

**Key principles**:
- Vertical slices only (no horizontal slicing)
- One test at a time
- Test behavior, not implementation
- Use public interfaces only

#### Post-Implementation Verification
- [ ] All tests pass (unit + integration)
- [ ] TypeScript compilation succeeds
- [ ] Coverage targets met
- [ ] No regressions in existing functionality
- [ ] **If this is the final slice in the PRD**: Move feature to `completed/` (see Step 10)

### Step 7: Documentation Update

**Agent action**: Updates documentation per the issue's "Documentation Impact" section.

**Agent process**:
1. Reads the Documentation Impact section
2. Updates each specified document
3. Runs documentation coherence check:
   - Validates no broken links
   - Checks for contradictions
   - Updates cross-references
   - Updates table of contents
4. Verifies documentation consistency

**Example documentation updates**:
- Database schema changes → `docs/database/data-model.md`
- New API endpoints → `docs/api-server/api.md`
- New components → `docs/frontend/components.md`
- Authentication flow → `docs/security/authentication.md`

### Step 8: Commit & Push

**Agent action**: Creates conventional commit and pushes changes.

**Commit message format**:
```
feat(auth): implement database schema for user authentication

Implements docs/development-process/active/user-authentication/01-database-schema.md

- Test results: 45 passing, 0 failing
- Coverage: 92% (target: 80%)
- Documentation updated: database/data-model.md, architecture/data-layer.md

Generated with [Devin](https://devin.ai)

Co-Authored-By: Devin <158243242+devin-ai-integration[bot]@users.noreply.github.com>
```

**Agent process**:
1. Updates issue file status to "completed"
2. Stages all changes
3. Creates commit with above format
4. Pushes to feature branch

### Step 9: Repeat

**Your action**: Choose next unblocked issue and repeat from Step 6.

**Continue until**: All issues in the PRD are completed.

### Step 10: Feature Completion (CRITICAL)

**Agent action**: When all issues in the PRD are completed, move the feature to completed.

**Agent process**:
1. Check that all issue files have status "completed"
2. Move feature directory from `docs/development/active/[feature-name]/` to `docs/development/completed/[feature-name]/`
3. Update PRD frontmatter:
   - Change `status` from "active" to "completed"
   - Add `completed: "YYYY-MM-DD"` with today's date
4. Create separate commit for the move:
   ```
   chore(scope): move [feature-name] to completed

   All [N] slices have been implemented and documented:
   - [list of completed slices]

   Moved from docs/development/active/ to docs/development/completed/
   Updated PRD status from active to completed

   Generated with [Devin](https://devin.ai)

   Co-Authored-By: Devin <158243242+devin-ai-integration[bot]@users.noreply.github.com>
   ```
5. Push the commit

**Why this is critical**: Leaving features in `active/` when they're complete creates confusion about what's currently being worked on. The `completed/` directory serves as the archive of successfully implemented features.

### Step 11: PR Creation

**Agent action**: Creates pull request when all issues are done.

**PR description**:
```markdown
## Summary
Implements user authentication feature

## PRD
docs/development-process/active/user-authentication/prd.md

## Implemented Issues
- 01-database-schema.md
- 02-auth-api.md
- 03-login-ui.md
- 04-password-reset.md

## Documentation Changes
- database/data-model.md: Added user tables and indexes
- api-server/api.md: Added authentication endpoints
- frontend/components.md: Added login and signup forms
- security/authentication.md: Added authentication flow documentation

## Test Results
- Unit tests: 120 passing
- Integration tests: 45 passing
- Coverage: 88% (target: 80%)

Generated with [Devin](https://devin.ai)
```

## Example: Complete Feature Development

Let's walk through a complete example of adding "Rule Search" functionality.

### 1. Initiate
**You**: "I want to add search functionality so users can search for rules by keyword, book, and rule number."

### 2. Grilling
**Agent**: (Using `/grill-me`)
- What search fields do users need? (keyword, book, rule number, category?)
- Should search support fuzzy matching?
- How should results be ranked?
- What's the expected performance for large rule sets?
- Should search work offline?
- How does this integrate with existing rule display?

**You**: (Answer questions, discuss trade-offs)

**Agent**: "I recommend starting with basic keyword search first, then adding advanced filters later. This keeps the initial scope manageable."

**You**: "Agreed, let's start with keyword search only."

### 3. PRD Creation
**Agent**: (Using `/to-prd`)
- Creates `docs/development-process/active/rule-search/prd.md`
- Includes user stories like:
  - "As a user, I want to search rules by keyword, so that I can quickly find relevant rules"
  - "As a user, I want to see search results highlighted, so that I can identify matches"
- Documents implementation decisions (use database full-text search)
- Specifies testing decisions (integration tests for search API)
- Identifies documentation impact (API docs, frontend components)

### 4. Issue Breakdown
**Agent**: (Using `/to-issues`)
Proposes breakdown:
1. `01-search-index.md` - Add full-text search index to database
2. `02-search-api.md` - Implement search API endpoint
3. `03-search-ui.md` - Build search interface component

**Agent**: "Does this granularity feel right? Each slice is independently demoable."

**You**: "Looks good, approved."

### 5. Implementation (Issue 01)
**Agent**: Implements `01-search-index.md`
- Pre-implementation checklist: ✅
- TDD cycle:
  - Test: "database supports full-text search on rule content"
  - Implement: Add GIN index to rules table
  - Refactor: Optimize index configuration
- All tests pass ✅
- Coverage: 85% ✅

### 6. Documentation Update
**Agent**: Updates `docs/database/data-model.md` with new index information

### 7. Commit
**Agent**: Commits with message referencing `01-search-index.md`

### 8. Repeat for Issues 02 and 03
(Same process for search API and UI)

### 9. PR Creation
**Agent**: Creates PR with all issues completed

## Troubleshooting

### Issue: Agent gets stuck during implementation

**Solution**: The agent should:
1. Check if the issue description is ambiguous
2. Ask for clarification on specific technical decisions
3. Propose alternative approaches if blocked

### Issue: Tests are flaky

**Solution**: The agent should:
1. Document the flaky test behavior
2. Investigate root cause (timing, dependencies, etc.)
3. Fix the test or the implementation
4. Re-run test suite multiple times to verify stability

### Issue: Documentation contradictions

**Solution**: The agent should:
1. Identify all conflicting information
2. Propose the correct version
3. Update all affected documents consistently
4. Verify no remaining contradictions

### Issue: Coverage targets not met

**Solution**: The agent should:
1. Identify which areas are under-covered
2. Add tests for critical paths first
3. Document why certain areas are excluded (if justified)
4. Ensure overall coverage meets minimum threshold

## Best Practices

### For Users
- **Be specific** in your initial feature request
- **Answer honestly** during grilling sessions
- **Be open to pushback** - agents may identify issues you haven't considered
- **Review PRDs carefully** before approving
- **Trust the TDD process** - tests drive good design

### For Agents
- **Grill relentlessly** - don't accept vague answers
- **Push back on bad ideas** - suggest alternatives
- **Follow TDD strictly** - no shortcuts
- **Update documentation thoroughly** - don't skip this step
- **Communicate clearly** in commit messages

### Process Compliance
- **Never skip grilling** - always validate ideas first
- **Always create PRD** - no implementation without requirements
- **Use vertical slices** - no horizontal slicing
- **Test first, always** - TDD is mandatory
- **Update docs with every change** - documentation must stay current

## Related Documentation

- [Development Process Overview](overview.md) - Complete process documentation
- [PRD Template](prd-template.md) - Standard PRD format
- [Issue Template](issue-template.md) - Standard issue format
- [Testing Overview](../testing/overview.md) - Testing philosophy
- [TDD Guidelines](../testing/tdd-guidelines.md) - TDD workflow