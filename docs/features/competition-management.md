# Competition Management Feature

## Overview

Competition management allows referees to create and manage competitions using pre-configured templates for different sports.

## User Stories

### As a referee, I want to:
- Create a new competition from a template
- View competition details and status
- Update competition information
- View competition history
- Delete competitions (if needed)

## Functional Requirements

### Competition Creation
- **Template selection**: Choose from available sport templates
- **Basic information**: Name, scheduled start time, location
- **Sport-specific configuration**: Based on selected template
- **Quick creation**: Fast competition creation for live situations

### Competition Viewing
- **Competition details**: View all competition information
- **Status tracking**: Track competition status (scheduled, in progress, completed)
- **Timeline**: View competition timeline and key events
- **Associated data**: View cards, disqualifications, appeals

### Competition Editing
- **Update information**: Edit competition details
- **Change status**: Update competition status
- **Add notes**: Add competition notes
- **Version control**: Track competition changes

### Competition History
- **List view**: View all competitions
- **Filtering**: Filter by status, sport type, date range
- **Search**: Search competitions by name or location
- **Export**: Export competition data

## Technical Implementation

### Data Model
```typescript
interface Competition {
  id: string;
  user_id: string;
  template_id: string;
  name: string;
  sport_type: 'football' | 'athletics';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  scheduled_start: Date;
  actual_start?: Date;
  actual_end?: Date;
  location?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
  version: number;
}
```

### Template System
```typescript
interface CompetitionTemplate {
  id: string;
  name: string;
  sport_type: 'football' | 'athletics';
  config: TemplateConfig;
  is_default: boolean;
  is_system: boolean;
}

interface TemplateConfig {
  card_types: CardTypeConfig[];
  match_structure: MatchStructure;
  disqualification_types: string[];
}
```

### API Endpoints (tRPC)

#### Queries
```typescript
// Get all competitions for user
competitions.list: {
  input: {
    user_id: string;
    filters?: {
      status?: string;
      sport_type?: string;
      date_range?: { start: Date; end: Date };
    };
  };
  output: Competition[];
}

// Get single competition
competitions.get: {
  input: { competition_id: string };
  output: Competition;
}

// Get available templates
competitions.getTemplates: {
  input: {};
  output: CompetitionTemplate[];
}
```

#### Mutations
```typescript
// Create competition
competitions.create: {
  input: {
    template_id: string;
    name: string;
    scheduled_start: Date;
    location?: string;
    notes?: string;
  };
  output: Competition;
}

// Update competition
competitions.update: {
  input: {
    competition_id: string;
    version: number;
    updates: Partial<Competition>;
  };
  output: Competition;
}

// Delete competition
competitions.delete: {
  input: { competition_id: string; version: number };
  output: { success: boolean };
}

// Update competition status
competitions.updateStatus: {
  input: {
    competition_id: string;
    version: number;
    status: CompetitionStatus;
  };
  output: Competition;
}
```

### UI Components

#### CompetitionList Component
- List of all competitions
- Filtering and search
- Status indicators
- Quick actions (start, view, delete)

#### CompetitionForm Component
- Form for creating/editing competitions
- Template selection
- Date/time pickers
- Validation using TanStack Form

#### CompetitionDetail Component
- Competition overview
- Status management
- Associated data (cards, disqualifications)
- Timeline view

#### CompetitionTimeline Component
- Visual timeline of competition events
- Cards, disqualifications, status changes
- Interactive timeline

## Template System

### MVP Templates

#### Football Template
```json
{
  "id": "football-default",
  "name": "Football (European)",
  "sport_type": "football",
  "config": {
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
    "disqualification_types": [
      "violent_conduct",
      "unsporting_behavior",
      "serious_foul_play"
    ]
  }
}
```

#### Athletics Template
```json
{
  "id": "athletics-default",
  "name": "Athletics",
  "sport_type": "athletics",
  "config": {
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
    "disqualification_types": [
      "false_start",
      "lane_infringement",
      "unsporting_behavior"
    ]
  }
}
```

### Template Usage
- **Read-only in MVP**: Templates cannot be edited
- **System templates**: Pre-configured templates that cannot be deleted
- **Template selection**: User selects template when creating competition
- **Configuration inheritance**: Competition inherits template configuration

## Competition Status Flow

### Status Transitions
```
scheduled → in_progress → completed
scheduled → cancelled
in_progress → cancelled
```

### Status Management
- **Scheduled**: Competition is scheduled but not started
- **In Progress**: Competition is currently active
- **Completed**: Competition has finished
- **Cancelled**: Competition was cancelled

### Status Actions
- **Start competition**: Transition from scheduled to in_progress
- **End competition**: Transition from in_progress to completed
- **Cancel competition**: Transition to cancelled
- **Restart competition**: From cancelled back to scheduled (admin only)

## Offline Support

### Local Storage
- Competitions stored in SQLite (mobile) or IndexedDB (web)
- Immediate local persistence
- Background sync when online

### Sync Logic
- Optimistic UI updates
- Queue for offline competition creation/edits
- Conflict resolution on sync
- Version-based conflict detection

### Offline Limitations
- Cannot create new competitions without template (templates cached)
- Cannot sync competition status with API Server
- Local changes sync when connection restored

## Performance Requirements

### Creation Performance
- **Fast creation**: Competition creation within 2 seconds
- **Template loading**: Templates load within 1 second
- **Immediate response**: UI responds immediately to actions

### Data Performance
- **List loading**: Competition list loads within 1 second
- **Detail loading**: Competition details load within 500ms
- **Efficient sync**: Competition sync completes within 5 seconds

## Security Considerations

### Access Control
- **User ownership**: Users can only access their own competitions
- **Edit permissions**: Only competition owner can edit
- **Delete restrictions**: Restricted delete capability

### Data Integrity
- **Audit logging**: All competition actions logged
- **Version control**: Track competition changes
- **Status validation**: Validate status transitions

## Testing Strategy

### Unit Tests
- Competition CRUD operation tests
- Template loading tests
- Status transition tests
- Validation tests

### Integration Tests
- Competition creation API tests
- Competition editing with version control tests
- Template integration tests
- Offline sync tests

### E2E Tests
- Complete competition creation flow
- Competition status management
- Competition history and filtering
- Offline competition creation and sync

## Future Enhancements

### Post-MVP Features
- **Custom templates**: User-created templates
- **Template editing**: Modify existing templates
- **Template marketplace**: Share templates with other users
- **Competition cloning**: Clone competitions with similar settings
- **Recurring competitions**: Recurring competition schedules
- **Multi-stage competitions**: Tournaments with multiple stages
- **Team management**: Add teams and players to competitions
- **Score tracking**: Track competition scores
- **Time management**: Built-in stopwatch and competition timer
