# Action Logging Feature

## Overview

Action logging provides flexible, sport-specific tracking of all referee actions during competitions. Unlike traditional systems with fixed tables for each action type, this system uses a single `actions` table with JSONB data to accommodate different sports' unique requirements.

**Key Design Principles:**
- **Sport-agnostic**: Different sports have different actions (goals in football, false starts in athletics)
- **Template-driven**: Action types and their schemas are defined in JSON template files
- **Flexible data**: All action-specific data stored in JSONB for maximum flexibility
- **Type-safe**: Template schemas validated with Zod for runtime type safety
- **UI-aware**: Templates include field definitions for automatic form generation

## User Stories

### As a referee, I want to:
- Log sport-specific actions during competitions (goals, substitutions, false starts, etc.)
- Record actions with appropriate fields for each action type
- View a complete history of all actions taken during a competition
- Export action logs for official reports
- Access historical data for review and learning

### As a competition administrator, I want to:
- Review complete audit trails of competitions
- Export official reports with all actions
- Analyze patterns in referee decisions
- Maintain compliance records
- Define custom action types for different sports

## Functional Requirements

### Flexible Action Logging
- **Sport-specific actions**: Different sports define their own action types
- **Template-driven schemas**: Action types and field definitions defined in JSON templates
- **Dynamic forms**: UI forms generated automatically from template definitions
- **Type validation**: Runtime validation using Zod schemas from templates
- **Flexible data storage**: All action-specific data in JSONB format

### Action Type Examples
- **Football**: Goals, substitutions, card logs, injuries, VAR reviews
- **Athletics**: False starts, lane infringements, protests, disqualifications
- **Custom sports**: Any sport can define custom action types

### Action History
- **Chronological view**: Actions in chronological order
- **Filtering**: Filter by action type, time period, or specific fields
- **Search**: Search actions by various criteria including JSONB fields
- **Export**: Export in multiple formats (CSV, PDF, JSON)
- **Display transformation**: JSONB data transformed for human-readable display

### References to Other Entities
- **Card references**: Actions can reference cards via `card_id` in JSONB data
- **Entity linking**: Actions can reference players, teams, or other entities
- **Cross-references**: Support for linking actions to other actions

## Technical Implementation

### Data Models

#### Action
```typescript
interface Action {
  id: string;
  competition_id: string;
  action_type: string; // References template action type ID
  action_data: Record<string, any>; // JSONB data with all action-specific fields
  created_at: Date;
  updated_at: Date;
}
```

#### Template Action Type Definition
```typescript
interface ActionTypeDefinition {
  id: string;
  name: string;
  fields: ActionFieldDefinition[];
}

interface ActionFieldDefinition {
  name: string;
  label: string;
  description: string;
  placeholder: string;
  type: 'text' | 'number' | 'textarea' | 'select' | 'date' | 'time';
  required: boolean;
  options?: string[]; // For select type
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}
```

#### Template Schema Example
```typescript
interface Template {
  sport_type: 'football' | 'athletics';
  card_types: CardType[];
  match_structure: MatchStructure;
  action_types: ActionTypeDefinition[];
}
```

### API Endpoints (tRPC)

#### Action Queries
```typescript
// Get actions for competition
actions.list: {
  input: { 
    competition_id: string;
    filters?: {
      action_type?: string;
      date_range?: { start: Date; end: Date };
      field_filters?: Record<string, any>; // For JSONB field filtering
    };
  };
  output: Action[];
}

// Get single action
actions.get: {
  input: { action_id: string };
  output: Action;
}

// Get available action types for competition
actions.getAvailableTypes: {
  input: { competition_id: string };
  output: ActionTypeDefinition[];
}
```

#### Action Mutations
```typescript
// Create action
actions.create: {
  input: {
    competition_id: string;
    action_type: string;
    action_data: Record<string, any>;
  };
  output: Action;
}

// Update action
actions.update: {
  input: {
    action_id: string;
    action_data: Record<string, any>;
  };
  output: Action;
}

// Delete action
actions.delete: {
  input: { action_id: string };
  output: { success: boolean };
}
```

### UI Components

#### DynamicActionForm Component
- Automatically generates form fields from template action type definitions
- Validates input using Zod schemas derived from templates
- Supports different input types (text, number, textarea, select, date, time)
- Shows field descriptions and placeholders from template
- Real-time validation feedback

#### ActionHistory Component
- Unified view of all actions for a competition
- Timeline visualization with action type icons
- Filtering by action type and time period
- Search within JSONB fields
- Export functionality (CSV, PDF, JSON)
- Human-readable display of JSONB data using template definitions

#### ActionTypeSelector Component
- Shows available action types for the current sport template
- Displays action type names and descriptions
- Filters or groups action types by category

#### ActionDetail Component
- Detailed view of a single action
- Transforms JSONB data into human-readable format using template field definitions
- Shows action metadata (timestamp, action type)
- Allows editing of action data

## Template System Integration

### Action Type Definitions in Templates

Templates define available action types and their field schemas:

```json
{
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
        {
          "name": "minute",
          "label": "Minute",
          "description": "When the goal was scored",
          "type": "number",
          "required": true
        }
      ]
    }
  ]
}
```

### Schema Validation

- **Zod generation**: Zod schemas automatically generated from template definitions
- **Runtime validation**: All action data validated against schemas before storage
- **Type safety**: TypeScript types generated from template definitions
- **Error messages**: User-friendly error messages from validation failures

### Form Generation

- **Automatic forms**: UI forms generated from template field definitions
- **Input types**: Text, number, textarea, select, date, time inputs based on field type
- **Validation rules**: Required fields, min/max values, patterns applied automatically
- **Labels and help**: Field labels, descriptions, and placeholders from templates

## Data Storage and Querying

### JSONB Storage

- **Flexible schema**: All action-specific data in single JSONB column
- **Queryable**: Postgres JSONB operators for efficient querying
- **Indexable**: GIN indexes on JSONB fields for performance
- **Compressible**: JSONB compression for storage efficiency

### Query Patterns

```typescript
// Get all actions of a specific type
SELECT * FROM actions 
WHERE action_type = 'goal' 
AND competition_id = $1;

// Filter by JSONB field
SELECT * FROM actions 
WHERE action_data->>'minute' > '45';

// Complex JSONB queries
SELECT * FROM actions 
WHERE action_data @> '{"team": "home"}';
```

### Display Transformation

- **Template-based rendering**: JSONB data transformed using template field definitions
- **Human-readable**: Raw JSON converted to labeled, formatted display
- **Type-specific formatting**: Numbers, dates, enums formatted appropriately
- **Conditional display**: Show/hide fields based on action type

## Performance Requirements

### Logging Performance
- **Immediate logging**: Actions logged immediately
- **No performance impact**: Logging doesn't affect UI performance
- **Efficient storage**: JSONB compression for storage efficiency

### Query Performance
- **Fast retrieval**: Action queries within 2 seconds
- **Efficient filtering**: Fast JSONB field filtering with indexes
- **Export performance**: Large exports complete within 30 seconds

## Security Considerations

### Data Integrity
- **Validation**: All action data validated against schemas
- **Type safety**: Runtime type checking prevents invalid data
- **User attribution**: Accurate user attribution for all actions

### Access Control
- **Action access**: Users can only access actions for their competitions
- **Template security**: Template definitions validated and secured
- **Data export**: Controlled export of sensitive data

## Testing Strategy

### Unit Tests
- Action CRUD tests
- Schema validation tests
- JSONB query tests
- Template parsing tests

### Integration Tests
- Action creation API tests
- Template-based form generation tests
- Action history and filtering tests
- JSONB field filtering tests

### E2E Tests
- Complete action logging flow
- Action history viewing and export
- Template-based form submission
- Cross-sport action type testing

## Future Enhancements

### Post-MVP Features
- **Evidence attachment**: Attach photos/videos to actions
- **Action templates**: Pre-defined action templates for common scenarios
- **Pattern analysis**: Analyze patterns in referee actions
- **Integration**: Integration with disciplinary systems
- **Multi-language**: Action descriptions in multiple languages
- **Statistics**: Statistics on action types and frequencies
- **Report generation**: Automated report generation
- **Advanced filtering**: More sophisticated filtering and search capabilities
