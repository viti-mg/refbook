# Card Management Feature

## Overview

Card management is a core feature of the RefBook application, enabling referees to digitally display, log, and manage cards given during competitions.

## User Stories

### As a referee, I want to:
- Display cards in fullscreen on my device
- Log cards given to players, teams, or officials
- Edit card details after they've been given
- View a history of all cards given during a competition
- Export card data for reporting purposes

## Functional Requirements

### Card Display
- **Fullscreen display**: Cards should occupy the full screen for maximum visibility
- **Color accuracy**: Cards must display in their correct colors (yellow, red, etc.)
- **Configurable duration**: Display duration configurable per card type
- **High contrast**: Ensure visibility in various lighting conditions
- **Mobile responsive**: Optimized for tablet and mobile screens

### Card Creation
- **Quick entry**: Fast card entry for live competition situations
- **Required fields**: Card type, recipient information
- **Optional fields**: Reason, minute, additional notes
- **Recipient types**: Player, team, coach, official
- **Recipient identification**: Jersey number, player ID, or name

### Card Editing
- **Full edit capability**: All card fields can be edited
- **Version tracking**: Track card versions for conflict resolution
- **Edit history**: Maintain audit trail of card edits
- **Conflict resolution**: Handle concurrent edits with optimistic concurrency

### Card History
- **Chronological view**: Cards displayed in chronological order
- **Filtering**: Filter by card type, recipient, time period
- **Search**: Search cards by recipient or reason
- **Export**: Export card data in various formats (CSV, PDF)

## Technical Implementation

### Data Model
```typescript
interface Card {
  id: string;
  competition_id: string;
  card_type: CardType;
  recipient_type: RecipientType;
  recipient_name: string;
  recipient_identifier: string;
  reason?: string;
  minute?: number;
  additional_notes?: string;
  created_at: Date;
  updated_at: Date;
  version: number;
}

type CardType = 'yellow' | 'red' | 'blue' | 'green' | string;
type RecipientType = 'player' | 'team' | 'coach' | 'official';
```

### Card Types by Sport

#### Football
- **Yellow Card**: Warning for minor infractions
- **Red Card**: Sending off for serious infractions
- **Blue Card**: Temporary suspension (if applicable)

#### Athletics
- **Yellow Card**: Warning for rule violations
- **Red Card**: Disqualification from event

### API Endpoints (tRPC)

#### Queries
```typescript
// Get all cards for a competition
cards.list: {
  input: { competition_id: string };
  output: Card[];
}

// Get single card
cards.get: {
  input: { card_id: string };
  output: Card;
}
```

#### Mutations
```typescript
// Create a new card
cards.create: {
  input: {
    competition_id: string;
    card_type: string;
    recipient_type: string;
    recipient_name: string;
    recipient_identifier: string;
    reason?: string;
    minute?: number;
    additional_notes?: string;
  };
  output: Card;
}

// Update a card
cards.update: {
  input: {
    card_id: string;
    version: number;
    updates: Partial<Card>;
  };
  output: Card;
}

// Delete a card
cards.delete: {
  input: { card_id: string; version: number };
  output: { success: boolean };
}
```

### UI Components

#### CardDisplay Component
- Fullscreen card display
- Configurable colors and duration
- Auto-dismiss after configured duration
- Manual dismiss option

#### CardForm Component
- Form for creating/editing cards
- Validation using TanStack Form
- Integration with card types from template
- Quick entry mode for live situations

#### CardHistory Component
- List of cards for a competition
- Filtering and search capabilities
- Export functionality
- Click to view/edit details

### Offline Support

#### Local Storage
- Cards stored in SQLite (mobile) or IndexedDB (web)
- Immediate local persistence
- Background sync when online

#### Sync Logic
- Optimistic UI updates
- Queue for offline card creation/edits
- Conflict resolution on sync
- Version-based conflict detection

## Card Display Specifications

### Visual Requirements
- **Fullscreen**: Occupy 100% of viewport
- **Centered**: Card centered on screen
- **High contrast**: Ensure visibility in all conditions
- **Color accurate**: Match official card colors exactly
- **Responsive**: Scale appropriately for different screen sizes

### Display Duration
- **Configurable**: Duration configurable per card type
- **Default durations**: 
  - Yellow card: 5 seconds
  - Red card: 10 seconds
- **Manual control**: Can dismiss manually
- **Auto-dismiss**: Auto-dismiss after duration

### Accessibility
- **Screen reader support**: Card information announced
- **Keyboard navigation**: Keyboard dismiss option
- **High contrast mode**: Support high contrast mode
- **Color blind friendly**: Additional indicators beyond color

## Card Editing Workflow

### Edit Flow
1. User selects card from history
2. System loads current card state with version
3. User modifies card fields
4. System validates changes
5. System sends update with version
6. Server checks version
7. If version matches: Apply update, increment version
8. If version mismatch: Return conflict with current state
9. User resolves conflict (overwrite, reload, or manual merge)

### Conflict Resolution UI
- Show conflict message
- Display current server state
- Display user's changes
- Options: Overwrite, Reload, Cancel
- Diff view for easy comparison

## Template Integration

### Card Type Configuration
Card types are configured in competition templates:

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
  ]
}
```

### Dynamic Card Types
- Card types loaded from template
- UI adapts to available card types
- New sports can add custom card types
- Template changes update available card types

## Performance Requirements

### Display Performance
- **Instant display**: Card display within 100ms of trigger
- **Smooth animations**: 60fps animations
- **No lag**: No perceptible lag in live situations

### Data Performance
- **Fast loading**: Card history loads within 1 second
- **Efficient sync**: Card sync completes within 5 seconds
- **Offline performance**: No performance degradation offline

## Security Considerations

### Data Integrity
- **Audit logging**: All card actions logged
- **User attribution**: Track who created/edited each card
- **Version control**: Prevent unauthorized overwrites

### Access Control
- **Competition access**: Users can only access cards for their competitions
- **Edit permissions**: Only competition referees can edit cards
- **Delete restrictions**: Restricted delete capability

## Testing Strategy

### Unit Tests
- Card display component tests
- Card form validation tests
- Card CRUD operation tests
- Conflict resolution logic tests

### Integration Tests
- Card creation API tests
- Card editing with version control tests
- Offline sync tests for cards
- Template integration tests

### E2E Tests
- Complete card creation flow
- Card editing and conflict resolution
- Card history and export
- Offline card creation and sync

## Future Enhancements

### Post-MVP Features
- **Card templates**: Custom card designs
- **Card sequences**: Quick card sequences for common situations
- **Card analytics**: Statistics on card usage
- **Video evidence**: Attach video to cards
- **Multi-language**: Card descriptions in multiple languages
- **Card sharing**: Share cards with other officials
