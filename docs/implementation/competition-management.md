# Competition Management Implementation

## Overview

Competition management is the core feature of RefBook, allowing referees to create, manage, and track competitions from pre-configured templates. The system uses JSON template files for sport-specific configuration and integrates with the database schema, tRPC API layer, and shadcn/ui components.

## Template System

### Template Structure

Templates are JSON files stored in `apps/app/src/templates/` that define sport-specific competition configuration. Each template includes:

- **Card Types**: Defines the types of cards that can be shown during a competition (e.g., yellow, red cards)
- **Match Structure**: Defines the structure of the competition (e.g., halves for football, events for athletics)
- **Action Types**: Defines the types of actions that can be logged during a competition (e.g., goals, substitutions)

### Template Files

#### Football Template (`football-template.json`)

The football template defines configuration for football/soccer competitions:

```json
{
  "card_types": [
    {
      "id": "yellow",
      "name": "Yellow Card",
      "color": "#FFFF00",
      "display_duration": 5000
    },
    {
      "id": "red",
      "name": "Red Card",
      "color": "#FF0000",
      "display_duration": 10000
    }
  ],
  "match_structure": {
    "type": "halves",
    "duration": 90,
    "halves": 2,
    "allow_extra_time": true
  },
  "action_types": [
    {
      "id": "goal",
      "name": "Goal",
      "fields": [
        {
          "name": "scorer_id",
          "label": "Scorer",
          "description": "Player who scored the goal",
          "placeholder": "Enter player name or ID",
          "type": "text",
          "required": true
        },
        // ... more fields
      ]
    },
    // ... more action types
  ]
}
```

**Football Action Types:**
- `goal`: Log goals with scorer, assistant referee, minute, and team
- `substitution`: Log player substitutions with players in/out and minute
- `card_log`: Log when cards are shown with card reference and minute

#### Athletics Template (`athletics-template.json`)

The athletics template defines configuration for track and field competitions:

```json
{
  "card_types": [
    {
      "id": "yellow",
      "name": "Yellow Card",
      "color": "#FFFF00",
      "display_duration": 5000
    },
    {
      "id": "red",
      "name": "Red Card",
      "color": "#FF0000",
      "display_duration": 10000
    }
  ],
  "match_structure": {
    "type": "events",
    "disciplines": ["track", "field"]
  },
  "action_types": [
    {
      "id": "false_start",
      "name": "False Start",
      "fields": [
        {
          "name": "athlete_id",
          "label": "Athlete",
          "description": "Athlete who false started",
          "placeholder": "Enter athlete name or ID",
          "type": "text",
          "required": true
        },
        // ... more fields
      ]
    },
    // ... more action types
  ]
}
```

**Athletics Action Types:**
- `false_start`: Log false starts with athlete, lane number, heat number, and notes
- `lane_infringement`: Log lane infringements with athlete, lane, infringement type, and event stage

### TypeScript Types

Template types are defined in `apps/app/src/templates/types.ts`:

```typescript
export interface CardType {
  id: string;
  name: string;
  color: string;
  display_duration: number;
}

export interface FootballMatchStructure {
  type: "halves";
  duration: number;
  halves: number;
  allow_extra_time: boolean;
}

export interface AthleticsMatchStructure {
  type: "events";
  disciplines: string[];
}

export type MatchStructure = FootballMatchStructure | AthleticsMatchStructure;

export interface FieldDefinition {
  name: string;
  label: string;
  description: string;
  placeholder: string;
  type: "text" | "number" | "boolean" | "date";
  required: boolean;
}

export interface ActionType {
  id: string;
  name: string;
  fields: FieldDefinition[];
}

export interface CompetitionTemplate {
  card_types: CardType[];
  match_structure: MatchStructure;
  action_types: ActionType[];
}

export type TemplateType = "football" | "athletics";
```

### Template Usage

Templates are imported directly in TypeScript files:

```typescript
import footballTemplate from '../templates/football-template.json';
import athleticsTemplate from '../templates/athletics-template.json';
import type { CompetitionTemplate } from '../templates/types';

const templates: Record<string, CompetitionTemplate> = {
  football: footballTemplate,
  athletics: athleticsTemplate,
};
```

TypeScript provides type safety through the `CompetitionTemplate` interface, ensuring that template data matches the expected structure.

### Adding New Templates

To add a new sport template:

1. Create a new JSON file in `apps/app/src/templates/` (e.g., `basketball-template.json`)
2. Define the template structure following the `CompetitionTemplate` interface
3. Add appropriate card types, match structure, and action types for the sport
4. Import the template in the code where templates are used
5. Add the template to the templates record

### Template Testing

Templates are tested in `apps/app/src/__tests__/templates.test.ts`:

- Template import validation
- Structure validation
- Card type validation
- Match structure validation
- Action type validation
- Field definition validation
- Type safety validation

Run template tests:
```bash
cd apps/app
npm test -- templates.test.ts
```

## Database Schema

The competitions table stores competition data with the following schema:

```sql
- id: uuid (primary key)
- user_id: text (foreign key → users.id)
- sport_type: text ('football' | 'athletics')
- name: text (competition name)
- status: text ('scheduled' | 'in_progress' | 'completed' | 'cancelled')
- scheduled_start: timestamp
- actual_start: timestamp (nullable)
- actual_end: timestamp (nullable)
- location: text (nullable)
- notes: text (nullable)
- created_at: timestamp
- updated_at: timestamp
```

The `sport_type` field references the template files, indicating which template configuration was used for the competition.

## API Layer

Competition CRUD operations are implemented as tRPC procedures in `packages/api/src/router.ts`:

- `competitions.list`: Query to fetch all competitions for a user with optional filters
- `competitions.get`: Query to fetch a single competition by ID
- `competitions.getTemplates`: Query to fetch available template configurations
- `competitions.create`: Mutation to create a new competition from a template
- `competitions.update`: Mutation to update competition details
- `competitions.updateStatus`: Mutation to update competition status
- `competitions.delete`: Mutation to delete a competition

All procedures use Better Auth session to get the current user_id and validate input using Zod schemas.

### API Implementation Details

#### Input Validation Schemas

The API uses Zod schemas for input validation:

- `competitionFilterSchema`: Validates filter parameters for list queries (status, sportType, dateRange, search)
- `competitionCreateSchema`: Validates competition creation (name, sportType, templateType, scheduledStart, location, notes)
- `competitionUpdateSchema`: Validates competition updates (id, name, location, notes)
- `competitionUpdateStatusSchema`: Validates status updates (id, status)
- `competitionDeleteSchema`: Validates deletion requests (id)
- `competitionGetSchema`: Validates get requests (id)

#### Authentication

All procedures use the `getCurrentUser()` helper function to:
- Get the current user session from Better Auth
- Throw an error if the user is not authenticated
- Return the user object for use in database queries

#### User Ownership Enforcement

All database queries include user ownership checks:
- List queries filter by `user_id`
- Get queries verify the competition belongs to the user
- Update/delete operations verify ownership before modifying data

#### Template Integration

The `competitions.getTemplates` procedure returns template data embedded in the API code:
- Football template with card types, match structure (halves), and action types (goal, substitution, card_log)
- Athletics template with card types, match structure (events), and action types (false_start, lane_infringement)

The `competitions.create` procedure integrates template data by:
- Accepting a `templateType` parameter
- Fetching the corresponding template
- Returning the created competition with template data

#### Status Management

The `competitions.updateStatus` procedure handles automatic timestamp updates:
- When status changes to `in_progress`, sets `actualStart` to current time
- When status changes to `completed`, sets `actualEnd` to current time
- Supports flexible status transitions between all valid states

#### Error Handling

All procedures include comprehensive error handling:
- Authentication errors for unauthenticated users
- Not found errors for non-existent competitions
- Validation errors for invalid input
- Database errors for operation failures

### API Testing

The API procedures are tested in `packages/api/src/__tests__/competitions.test.ts`:

- Schema validation tests for all input schemas
- UUID validation tests
- Enum validation tests for status and sport types
- Required field validation tests
- Optional field handling tests

Run API tests:
```bash
cd packages/api
pnpm test
```

## UI Components

Competition UI components are implemented in `apps/app/src/components/`:

- `CompetitionList`: Displays list of competitions with filtering and search
- `CompetitionForm`: Form for creating and editing competitions
- `CompetitionDetail`: Displays detailed competition information

Components use:
- shadcn/ui for consistent UI components
- TanStack Query for data fetching and caching
- TanStack Form for form validation
- TanStack Router for navigation
- Better Auth session hooks for route protection

## Testing

Competition management features are tested at multiple levels:

- **Template tests**: `apps/app/src/__tests__/templates.test.ts`
- **API tests**: `packages/api/src/__tests__/competitions.test.ts`
- **UI tests**: `apps/app/src/__tests__/competition-ui.test.ts`

All tests follow TDD principles and maintain 80%+ coverage for critical paths.

## Implementation Status

- ✅ Database schema extension (Slice 01)
- ✅ Template system setup (Slice 02)
- ✅ Competition API procedures (Slice 03)
- ⏳ Competition UI components and routes (Slice 04)
