# Development Process Overview

## Philosophy

RefBook follows an **AI-assisted, documentation-driven development process** where:

- **Project documentation is the source of truth** - All implementation decisions are guided by existing documentation
- **AI agents handle implementation** - Human oversight focuses on direction and validation, not coding
- **Test-Driven Development (TDD) is mandatory** - All features are built using the red-green-refactor cycle
- **Vertical slices drive progress** - Features are broken into independently implementable end-to-end slices
- **Documentation stays current** - Every implementation updates relevant documentation automatically

## Development Cycle

The complete development cycle consists of five phases:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   1. Grilling    │ →  │   2. PRD        │ →  │   3. Issues     │
│   (/grill-me)    │    │   (/to-prd)     │    │   (/to-issues)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                      ↓
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   5. Docs Update │ ← │   4. Implement  │ ← │   Selection     │
│   & Commit      │    │   (AI Agent)    │    │   (Choose slice)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Phase 1: Grilling (`/grill-me`)

**Purpose**: Stress-test the feature idea until reaching shared understanding

**Process**:
1. User requests a new feature through an AI agent
2. AI agent invokes `/grill-me` skill
3. Agent relentlessly interviews the user about:
   - Problem statement and user needs
   - Technical constraints and requirements
   - Edge cases and error scenarios
   - Integration points and dependencies
   - Documentation impact
4. Agent pushes back on ideas that seem problematic
5. Session continues until "shared understanding" is achieved

**Outcome**: Clear, validated feature concept with identified risks and dependencies

### Phase 2: PRD Creation (`/to-prd`)

**Purpose**: Create comprehensive Product Requirements Document

**Process**:
1. AI agent uses `/to-prd` skill (no additional interviewing)
2. Agent synthesizes grilling session context into PRD
3. PRD includes:
   - Problem statement (user perspective)
   - Solution overview (user perspective)
   - Extensive user stories (As an actor, I want feature, so that benefit)
   - Implementation decisions (modules, interfaces, architecture)
   - Testing decisions (test seams, coverage strategy)
   - Out of scope items
   - Documentation impact (which docs need updating)

**Output**: `docs/development/active/[feature-name]/prd.md`

### Phase 3: Issue Breakdown (`/to-issues`)

**Purpose**: Break PRD into vertical slices (tracer bullets)

**Process**:
1. AI agent uses `/to-issues` skill
2. Agent breaks PRD into **tracer bullet** issues:
   - Each issue is a thin vertical slice through ALL layers
   - Completed slice is demoable/verifiable independently
   - Issues are ordered by dependencies
3. Agent quizzes user on breakdown:
   - Granularity check (too coarse/too fine)
   - Dependency validation
   - Merge/split recommendations
4. Iterate until user approves breakdown

**Output**: Multiple issue files in `docs/development/active/[feature-name]/`

### Phase 4: Issue Selection & Implementation

**Purpose**: Choose and implement the next unblocked vertical slice

**Process**:
1. Human or AI selects first unblocked issue from dependency order
2. AI agent implements the slice following TDD:
   - **Pre-implementation checklist** validation
   - **Red-Green-Refactor** cycle per /tdd skill
   - Vertical slice implementation (end-to-end)
   - Test coverage verification
   - TypeScript compilation check
3. Agent runs full test suite to ensure no regressions
4. All tests must pass before proceeding

**Key Principles**:
- Choose first unblocked slice in dependency order
- One slice at a time (no parallel implementation)
- Agent works autonomously without human intervention
- Agent must push back if issue description is ambiguous

### Phase 5: Documentation Update & Commit

**Purpose**: Update documentation and commit changes

**Process**:
1. AI agent updates documentation per PRD/issue "Documentation Impact" sections
2. Agent runs documentation coherence check:
   - Validates no contradictions with existing docs
   - Updates cross-references and table of contents
   - Ensures consistency across documentation
3. Agent updates issue file status to "completed"
4. Agent creates conventional commit with:
   - Reference to issue file
   - Test results and coverage
   - Documentation changes summary
5. Agent pushes commit to feature branch

**Special Case - Final Slice Completion**:
If this is the final slice in the PRD (all issues now completed):
- Move feature directory from `docs/development/active/[feature-name]/` to `docs/development/completed/[feature-name]/`
- Update PRD frontmatter status from "active" to "completed"
- Add `completed: "YYYY-MM-DD"` date to PRD frontmatter
- Create separate commit for the directory move with message: `chore(scope): move [feature-name] to completed`

**Commit Message Format**:
```
feat(scope): implement description

Implements docs/development/active/[feature]/[issue].md

- Test results: X passing, 0 failing
- Coverage: X% (target: 80%)
- Documentation updated: [list of modified docs]

Generated with [Devin](https://devin.ai)

Co-Authored-By: Devin <158243242+devin-ai-integration[bot]@users.noreply.github.com>
```

## File Structure

Development artifacts are stored in `docs/development/` (git-tracked):

```
docs/development/
├── active/              # Currently in-progress features
│   └── user-authentication/
│       ├── prd.md
│       ├── 01-database-schema.md
│       ├── 02-auth-api.md
│       └── 03-login-ui.md
├── completed/           # Successfully implemented features
│   └── rule-search/
│       ├── prd.md
│       ├── 01-search-index.md
│       └── 02-search-ui.md
└── archived/            # Cancelled or deferred features
    └── old-feature/
        └── prd.md
```

### File Naming Conventions

- **PRD files**: `prd.md`
- **Issue files**: `[order]-[description].md` (e.g., `01-database-schema.md`)
- **Feature directories**: kebab-case feature names

### Frontmatter Schema

**PRD files**:
```yaml
---
title: "Feature Name"
status: "active" # active, completed, archived
created: "2026-06-20"
author: "user/agent"
estimated_slices: 3
priority: "high" # critical, high, medium, low
---
```

**Issue files**:
```yaml
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
```

## AI Agent Responsibilities

### Grilling Agent
- Invoke `/grill-me` skill
- Interview user relentlessly
- Push back on problematic ideas
- Identify technical risks
- Document shared understanding

### PRD Agent
- Invoke `/to-prd` skill
- Synthesize grilling context
- Create comprehensive PRD
- Identify documentation impact
- No additional interviewing

### Issues Agent
- Invoke `/to-issues` skill
- Create vertical slice breakdown
- Quiz user on granularity
- Validate dependencies
- Create issue files with frontmatter

### Implementation Agent
- Validate pre-implementation checklist
- Follow TDD red-green-refactor cycle
- Implement vertical slice end-to-end
- Ensure all tests pass
- Update documentation per impact section
- Run documentation coherence check
- Update issue status
- Create conventional commit
- Push changes
- **CRITICAL**: If implementing the final slice in a PRD, move feature directory to `completed/` and update PRD status to "completed" with completion date

## Quality Assurance

### Pre-Implementation Checklist
- [ ] PRD exists and is approved
- [ ] Issue file exists with complete frontmatter
- [ ] Testing strategy is defined
- [ ] Documentation impact is identified
- [ ] Dependencies are unblocked
- [ ] No conflicting work in progress

### Post-Implementation Checklist
- [ ] All tests pass (unit + integration)
- [ ] TypeScript compilation succeeds
- [ ] Coverage targets met
- [ ] Documentation updated per impact section
- [ ] Documentation coherence verified
- [ ] Issue status updated to "completed"
- [ ] Commit message follows format
- [ ] Changes pushed to feature branch
- [ ] **If final slice**: Move feature directory to `completed/` and update PRD status

### TDD Compliance
- **Vertical slices only** - No horizontal slicing (all tests then all code)
- **Behavior-focused tests** - Test what, not how
- **Public interface testing** - Tests survive refactoring
- **One test at a time** - Red-green-refactor per behavior
- **Coverage targets** - 80% minimum, 90% target for critical paths

## Documentation Management

### Documentation Impact Section

Both PRDs and issues must include:

```markdown
## Documentation Impact
- **Architecture**: [changes needed, if any]
- **Database**: [schema changes to document]
- **API**: [new/modified endpoints]
- **Testing**: [test strategy updates]
- **i18n**: [new translation keys]
- **Deployment**: [deployment considerations]
```

### Documentation Coherence Check

After implementation, the agent must:

1. **Cross-reference validation**: Ensure no broken links or references
2. **Consistency check**: Validate no contradictions with existing docs
3. **Completeness check**: Ensure all changes are documented
4. **Structure validation**: Verify docs follow project conventions
5. **Table of contents**: Update all relevant TOCs

### Documentation Hierarchy

- **Project docs** (`docs/`) = Source of truth (architecture, database, API, etc.)
- **Development docs** (`docs/development/`) = Implementation process and details
- **PRDs** = Feature requirements and design decisions
- **Issues** = Implementation specifics and vertical slices

## Git Workflow

### Branch Strategy
- **Feature branch per PRD**: `feature/[feature-name]`
- **One commit per issue**: Each vertical slice is a separate commit
- **Reference issue files**: Commit messages reference the issue file path

### Commit Process
1. Agent implements vertical slice
2. Agent updates documentation
3. Agent runs validation checks
4. Agent creates conventional commit
5. Agent pushes to feature branch
6. Repeat for next issue

### Pull Request Creation
- PR created when all issues in PRD are completed
- PR references the PRD file
- PR description includes:
  - Link to PRD
  - List of implemented issues
  - Documentation changes summary
  - Test results and coverage

## Process Enforcement

### Skill-Based Validation
The `/dev-process` skill validates:
- Required artifacts exist (PRD, issues, documentation)
- Frontmatter is complete and valid
- Checklists are completed
- Documentation coherence is maintained

### Status Tracking
- **Issue status** (frontmatter) tracks implementation progress
- **PRD status** reflects overall feature completion
- **Git history** provides process audit trail
- **Feature directories** move between `active/`, `completed/`, `archived/`

### Anti-Patterns to Avoid

- **Skipping grilling** - Always grill before PRD creation
- **Horizontal slicing** - Never write all tests then all code
- **Implementation without tests** - TDD is mandatory
- **Outdated documentation** - Docs must be updated with every change
- **Missing documentation impact** - Every PRD/issue must specify doc changes
- **Committing without validation** - All checklists must pass
- **Leaving features in active/** - When all slices are complete, MUST move feature directory to `completed/` and update PRD status

## Related Documentation

- [Testing Overview](../testing/overview.md) - Testing philosophy and strategy
- [TDD Guidelines](../testing/tdd-guidelines.md) - Test-driven development workflow
- [Architecture Overview](../architecture/overview.md) - System architecture and design
- [Database Documentation](../database/data-model.md) - Data model and schema
- [API Documentation](../api-server/api.md) - API contracts and endpoints