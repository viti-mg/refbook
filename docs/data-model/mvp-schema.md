# MVP Database Schema

## MVP Schema Scope

The MVP database schema focuses on the core functionality needed for solo refereeing with online-only operation. This schema is intentionally simplified compared to the full production system, which will include version fields for offline sync, comprehensive audit logging, and appeals workflow.

**Note:** This is the MVP schema. The full production schema will include additional fields and tables for offline sync, collaboration, and advanced features.

## Better Auth Tables (Managed by Better Auth)

### users
```sql
- id: text (primary key)
- email: text (unique)
- email_verified: boolean
- username: text (unique)
- name: text
- created_at: timestamp
- updated_at: timestamp
```

### sessions
```sql
- id: text (primary key)
- user_id: text (foreign key → users.id)
- expires_at: timestamp
- token: text (unique)
- created_at: timestamp
- updated_at: timestamp
```

### accounts
```sql
- id: text (primary key)
- user_id: text (foreign key → users.id)
- account_id: text
- provider_id: text
- access_token: text
- refresh_token: text
- id_token: text
- expires_at: timestamp
- password: text (hashed)
- created_at: timestamp
- updated_at: timestamp
```

### verification_tokens
```sql
- id: text (primary key)
- identifier: text
- token: text
- expires_at: timestamp
```

## Application Tables (MVP)

### competitions
Represents a single competition in the MVP.

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

**Note:** Template configuration is stored as JSON files in the project, not in the database. The `sport_type` field references the template files.

### cards
Cards given during a competition. This is a separate table because cards are a core feature with fullscreen display requirements.

```sql
- id: uuid (primary key)
- competition_id: uuid (foreign key → competitions.id)
- card_type: text (e.g., 'yellow', 'red', 'blue', etc.)
- recipient_type: text ('player' | 'team' | 'coach' | 'official')
- recipient_name: text
- recipient_identifier: text (jersey number, player ID, etc.)
- reason: text (nullable)
- minute: integer (nullable - minute of the competition)
- additional_notes: text (nullable)
- created_at: timestamp
- updated_at: timestamp
```

### actions
Flexible action logging for sport-specific events. Different sports have different actions (goals in football, false starts in athletics, etc.). Action types and their schemas are defined in template JSON files.

```sql
- id: uuid (primary key)
- competition_id: uuid (foreign key → competitions.id)
- action_type: text (references template action types)
- action_data: jsonb (all action-specific fields including minute, notes, references to other entities)
- created_at: timestamp
- updated_at: timestamp
```

**Note:** The `action_data` JSONB column contains all action-specific fields. For example, a football goal action might include `{"scorer_id": "player123", "minute": 45, "team": "home"}`, while an athletics false start might include `{"lane_number": 4, "athlete_id": "athlete456", "reason": "false_start"}`. Actions can reference cards via `card_id` in the JSONB data.

**Note:** Appeals system is deferred to post-MVP.

## Template Configuration (JSON Files)

Template configurations are stored as JSON files in the project, not in the database. This simplifies the MVP while keeping the template system ready for future database migration.

### Football Template Configuration
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
        {
          "name": "assistant_id",
          "label": "Assistant Referee",
          "description": "Assistant referee who signaled the goal",
          "placeholder": "Enter assistant referee name",
          "type": "text",
          "required": false
        },
        {
          "name": "minute",
          "label": "Minute",
          "description": "When the goal was scored",
          "type": "number",
          "required": true
        },
        {
          "name": "team",
          "label": "Team",
          "description": "Which team scored",
          "placeholder": "Home or Away",
          "type": "text",
          "required": true
        }
      ]
    },
    {
      "id": "substitution",
      "name": "Substitution",
      "fields": [
        {
          "name": "player_out",
          "label": "Player Out",
          "description": "Player being substituted",
          "placeholder": "Enter player name",
          "type": "text",
          "required": true
        },
        {
          "name": "player_in",
          "label": "Player In",
          "description": "Player entering the match",
          "placeholder": "Enter player name",
          "type": "text",
          "required": true
        },
        {
          "name": "minute",
          "label": "Minute",
          "description": "When the substitution occurred",
          "type": "number",
          "required": true
        }
      ]
    },
    {
      "id": "card_log",
      "name": "Card Logged",
      "fields": [
        {
          "name": "card_id",
          "label": "Card",
          "description": "Reference to the card that was shown",
          "placeholder": "Select card",
          "type": "text",
          "required": true
        },
        {
          "name": "minute",
          "label": "Minute",
          "description": "When the card was shown",
          "type": "number",
          "required": true
        }
      ]
    }
  ]
}
```

### Athletics Template Configuration
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
        {
          "name": "lane_number",
          "label": "Lane Number",
          "description": "Lane where the false start occurred",
          "placeholder": "Enter lane number",
          "type": "number",
          "required": true
        },
        {
          "name": "heat_number",
          "label": "Heat Number",
          "description": "Which heat this occurred in",
          "placeholder": "Enter heat number",
          "type": "number",
          "required": true
        }
      ]
    },
    {
      "id": "lane_infringement",
      "name": "Lane Infringement",
      "fields": [
        {
          "name": "athlete_id",
          "label": "Athlete",
          "description": "Athlete who committed the infringement",
          "placeholder": "Enter athlete name or ID",
          "type": "text",
          "required": true
        },
        {
          "name": "lane_number",
          "label": "Lane Number",
          "description": "Lane where the infringement occurred",
          "placeholder": "Enter lane number",
          "type": "number",
          "required": true
        },
        {
          "name": "description",
          "label": "Description",
          "description": "Details of the infringement",
          "placeholder": "Describe what happened",
          "type": "textarea",
          "required": true
        }
      ]
    },
    {
      "id": "protest",
      "name": "Protest",
      "fields": [
        {
          "name": "appellant_type",
          "label": "Appellant",
          "description": "Who is filing the protest",
          "placeholder": "Team, coach, or athlete",
          "type": "text",
          "required": true
        },
        {
          "name": "reason",
          "label": "Reason",
          "description": "Reason for the protest",
          "placeholder": "Explain the protest",
          "type": "textarea",
          "required": true
        }
      ]
    }
  ]
}
```

## Indexes

### Performance Indexes
```sql
-- Competitions
CREATE INDEX idx_competitions_user_id ON competitions(user_id);
CREATE INDEX idx_competitions_status ON competitions(status);
CREATE INDEX idx_competitions_scheduled_start ON competitions(scheduled_start);

-- Cards
CREATE INDEX idx_cards_competition_id ON cards(competition_id);
CREATE INDEX idx_cards_card_type ON cards(card_type);

-- Actions
CREATE INDEX idx_actions_competition_id ON actions(competition_id);
CREATE INDEX idx_actions_action_type ON actions(action_type);
CREATE INDEX idx_actions_created_at ON actions(created_at);
```

## Data Relationships

### Entity Relationship Diagram
```
users (1) ─────── (∞) competitions
competitions (1) ─────── (∞) cards
competitions (1) ─────── (∞) actions
```

**Note:** Template configuration is managed through JSON files referenced by `sport_type`, not database relationships. Actions can reference cards via `card_id` in the JSONB `action_data` field.

## MVP Schema Constraints

### MVP Limitations
- **Online-only**: No offline sync or local storage
- **No organization management**: Single user per competition
- **No collaboration**: No shared sessions or multi-user support
- **No custom templates**: Only system templates (football, athletics) via JSON files
- **No template editing**: Templates are read-only in MVP
- **No appeals system**: Protests and appeals deferred to post-MVP
- **Simple competition structure**: Competition = single competition
- **No version fields**: Optimistic concurrency not needed for online-only
- **No audit logging**: Basic timestamps sufficient for MVP

### Foundation for Future
- **Template system**: JSON file architecture ready for database migration
- **User references**: All entities reference users for future collaboration
- **Timestamp fields**: Foundation for audit trail expansion
- **Separation of concerns**: Clean table structure for future enhancements

## Migration Strategy

### Initial Migration
1. **Better Auth tables**: Run Better Auth migrations first
2. **Application tables**: Create simplified application tables
3. **Index creation**: Create essential performance indexes
4. **Template files**: Set up JSON template configuration files

### Future Migrations
- **Offline sync**: Add version fields to all tables for optimistic concurrency
- **Audit logging**: Add audit_log table and triggers
- **Appeals system**: Add appeals table with review workflow
- **Template system**: Migrate JSON templates to database with template tables
- **Organization tables**: When adding organization management
- **Collaboration tables**: When adding real-time collaboration
- **Sport-specific fields**: When expanding sport support

## Data Validation

### Database Constraints
- **NOT NULL**: Required fields
- **UNIQUE**: Unique identifiers
- **FOREIGN KEY**: Referential integrity
- **CHECK**: Data validation rules

### Application Validation
- **Zod schemas**: Runtime validation
- **Business logic**: Application-level validation
- **User input**: Input sanitization and validation

## MVP Data Seeding

### Default Templates
Templates are stored as JSON files in the project, not seeded in the database:
1. **Football template**: Pre-configured for European football (JSON file)
2. **Athletics template**: Pre-configured for track and field events (JSON file)

### Test Data
- **Sample competitions**: For development and testing
- **Sample cards**: For UI testing
- **Sample actions**: For action history testing (goals, substitutions, protests, etc.)
