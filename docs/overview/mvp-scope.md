# MVP Scope

## MVP Definition

The Minimum Viable Product (MVP) focuses on validating the core value proposition with a simplified feature set. This approach allows for faster development and user feedback while building a solid foundation for future enhancements.

**Note:** The MVP is intentionally simplified compared to the full production system. The full project will include offline-first sync, collaboration, advanced authentication, mobile apps, and complex template systems as outlined in the roadmap.

## MVP Features

### ✅ In Scope

#### Authentication
- Simple email + username + password authentication
- Basic session management
- **Implementation timing:** Authentication will be implemented after core features are working
- No OAuth or social login in MVP
- No temporal accounts in MVP

#### Competition Management
- Create competitions based on predefined templates
- Two templates: Football (European) and Athletics
- Template configuration stored as JSON files in the project (not database)
- Template settings are pre-configured (no customization in MVP)
- Competition = single competition event (no hierarchy in MVP)

#### Card Management
- Create and display cards in fullscreen
- Log cards given during competitions
- Edit card details (all fields editable)
- Basic card types per template

#### Action Logging
- Log disqualifications
- Basic action history view
- **Deferred:** Protests and appeals (post-MVP feature)

#### Data Management
- Cloud backup with Postgres
- Export/share logged data
- Basic competition history

#### Platform
- Web-only (responsive design for tablets/desktops)
- No mobile apps in MVP

#### Development Approach
- **Online-only**: No offline support in MVP (deferred to post-MVP)
- **Pragmatic testing**: Focus on integration tests for critical paths
- **Incremental implementation**: Build features one at a time
- **Future-proof architecture**: Full monorepo structure from the start

### ❌ Out of Scope (MVP)

#### Offline Support
- Offline functionality (deferred to post-MVP)
- SQLite local storage (deferred to post-MVP)
- Sync engine and conflict resolution (deferred to post-MVP)
- Offline status indicators (deferred to post-MVP)

#### Appeals System
- Protests and appeals logging (deferred to post-MVP)
- Appeal review workflow (deferred to post-MVP)

#### Collaboration Features
- Multi-referee sessions
- Real-time collaboration
- WebSocket implementation
- User presence and awareness

#### Advanced Authentication
- OAuth/social login
- Temporal accounts
- Multi-factor authentication
- Organization management

#### Template System
- Custom template creation
- Template editing
- Template marketplace/sharing
- Sport-specific UI variations
- Database-driven template configuration (using JSON files instead)

#### Advanced Features
- Video/photo evidence
- Advanced analytics and reports
- Multi-language support
- Push notifications
- Integration with external systems

#### Mobile Platforms
- iOS app
- Android app
- Cross-platform sync

## MVP Success Criteria

1. **Functional Completeness**: All in-scope features work as specified
2. **Online Reliability**: Core functions work with internet connectivity
3. **Data Integrity**: Data persists correctly in Postgres database
4. **User Experience**: Intuitive interface for solo referees
5. **Performance**: Responsive card display and action logging
6. **Platform Coverage**: Works on major web browsers and tablets
7. **Architecture Foundation**: Monorepo structure supports future expansion

## Post-MVP Roadmap

The MVP is designed as a foundation for the full application. Key features planned for post-MVP:

1. **Offline Support**: SQLite local storage, sync engine, conflict resolution
2. **Appeals System**: Protests and appeals logging with review workflow
3. **Mobile Apps**: React Native + Expo for iOS and Android
4. **Collaboration**: Real-time multi-referee sessions
5. **Advanced Auth**: OAuth, temporal accounts, organization management
6. **Template System**: Custom templates, marketplace, sharing
7. **Advanced Features**: Video evidence, analytics, multi-language support

## Technical Foundation

The MVP will be built with the full technical architecture in place, even if some features are not implemented:

- Full monorepo structure with Turborepo (separate packages from the start)
- Simplified database schema (essential fields only, no version fields or audit logging)
- Authentication infrastructure ready for expansion (implemented after core features)
- API layer (tRPC) prepared for mobile consumption
- Template system using JSON files (ready for database migration later)
- Architecture foundation for future offline-first sync implementation

This ensures that the MVP codebase can evolve into the full application without major refactoring.
