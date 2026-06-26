# System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              REFEREE APP ARCHITECTURE                        │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│   MARKETING WEB  │      │   iOS APP        │      │  ANDROID APP     │
│   (Vite + React) │      │   (React Native  │      │  (React Native   │
│    - refbook.com)│      │    + Expo)       │      │   + Expo)        │
└──────────────────┘      └────────┬─────────┘      └────────┬─────────┘

┌──────────────────┐
│   REFEREE APP    │
│   (TanStack      │
│    Start)        │
│   - app.refbook. │
│    com)          │
└────────┬─────────┘
         │                          │                          │
         │ tRPC Client              │ tRPC Client              │ tRPC Client
         │ TanStack Query           │ TanStack Query           │ TanStack Query
         │ WebSocket Client         │ WebSocket Client         │ WebSocket Client
         │                          │                          │
         └──────────┬───────────────┴──────────┬───────────────┘
                    │                          │
                    │       HTTP / WebSocket   │
                    └──────────┬───────────────┘
                               │
         ┌─────────────────────┴─────────────────────┐
         │                                           │
┌────────▼─────────┐                    ┌──────────▼──────────┐
│  API SERVER      │                    │  WEBSOCKET SERVER   │
│  (tRPC Router)   │◄──────────────────►│  (Real-time Sync)   │
│                  │                    │                    │
│  • Auth          │                    │  • Session Mgmt     │
│  • Cards CRUD    │                    │  • Broadcast        │
│  • Competitions  │                    │  • Presence         │
│  • Referees      │                    │  • Reconnection     │
│  • Disqualifs    │                    │                    │
│  • Appeals       │                    │                    │
└────────┬─────────┘                    └──────────┬──────────┘
         │                                         │
         │ Drizzle ORM                             │
         │                                         │
         └─────────────────┬───────────────────────┘
                           │
         ┌─────────────────▼─────────────────────┐
         │          POSTGRES DATABASE            │
         │                                       │
         │  Tables:                              │
         │  • users                              │
         │  • sessions                           │
         │  • competitions                       │
         │  • cards                              │
         │  • disqualifications                  │
         │  • appeals                            │
         │  • competition_referees (join table)  │
         │  • audit_log (for conflict tracking)  │
         └───────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                         OFFLINE-FIRST ARCHITECTURE                           │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│   iOS APP        │      │  ANDROID APP     │      │   WEB APP        │
│                  │      │                  │      │                  │
│  ┌────────────┐  │      │  ┌────────────┐  │      │  ┌────────────┐  │
│  │   SQLite   │  │      │  │   SQLite   │  │      │  │ IndexedDB │  │
│  │  (Local)   │  │      │  │  (Local)   │  │      │  │  (Local)   │  │
│  └─────┬──────┘  │      │  └─────┬──────┘  │      │  └─────┬──────┘  │
│        │         │      │        │         │      │        │         │
│  ┌─────▼──────┐  │      │  ┌─────▼──────┐  │      │  ┌─────▼──────┐  │
│  │ Sync Queue │  │      │  │ Sync Queue │  │      │  │ Sync Queue │  │
│  │ (Offline)  │  │      │  │ (Offline)  │  │      │  │ (Offline)  │  │
│  └─────┬──────┘  │      │  └─────┬──────┘  │      │  └─────┬──────┘  │
└────────┼─────────┘      └────────┼─────────┘      └────────┼─────────┘
         │                          │                          │
         │ Online: Replay Queue     │ Online: Replay Queue     │ Online: Replay Queue
         │ Offline: Queue Actions   │ Offline: Queue Actions   │ Offline: Queue Actions
         └──────────┬───────────────┴──────────┬───────────────┘
                    │                          │
                    ▼                          ▼
            ┌─────────────────────────────────────┐
            │         SYNC ENGINE                 │
            │  • Optimistic Concurrency Control  │
            │  • Conflict Detection               │
            │  • Retry Logic                      │
            │  • Version Tracking                 │
            └─────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                        SHARED PACKAGES (Turborepo)                            │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  packages/                                                                   │
│  ├── api/              # tRPC router & server logic                         │
│  ├── db/               # Drizzle schema & migrations                         │
│  ├── auth/             # Better Auth configuration                          │
│  ├── types/            # TypeScript types shared across apps                 │
│  ├── sync-engine/      # Offline sync & conflict resolution                 │
│  ├── ui/               # Shared UI components (shadcn/ui)                     │
│  └── config/           # Environment validation & shared configuration         │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                        APPS (Turborepo)                                      │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  apps/                                                                       │
│  ├── web/            # Marketing website (Vite + React)                      │
│  ├── app/            # Referee application (TanStack Start)                  │
│  ├── mobile/         # React Native + Expo (iOS & Android)                  │
│  └── api-server/     # tRPC server + WebSocket server                       │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT (VPS + Dockploy)                               │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  Dockploy Services:                                                          │
│  ├── web-app         # TanStack Start (Node.js)                              │
│  ├── api-server      # tRPC + WebSocket (Node.js)                           │
│  └── postgres        # Database (Postgres)                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Architecture Principles

### 1. Monorepo Structure
- **Turborepo**: Manages multiple packages and applications
- **Code Sharing**: Maximum code reuse between web and mobile
- **Shared Packages**: API, database, auth, types, sync engine
- **Independent Deployment**: Each app can be deployed independently

### 2. API-First Design
- **tRPC**: Single API layer for all platforms
- **Type Safety**: End-to-end TypeScript integration
- **Shared Contracts**: Same API for web, iOS, and Android
- **Version Management**: API versioning for backward compatibility

### 3. Offline-First Architecture
- **Local Storage**: SQLite (mobile), IndexedDB (web)
- **Sync Engine**: Custom synchronization logic
- **Optimistic UI**: Immediate feedback with background sync
- **Conflict Resolution**: Version-based conflict detection

### 4. Real-Time Foundation
- **WebSocket**: Future real-time collaboration
- **Broadcast Model**: Server pushes updates to connected clients
- **Presence System**: Track active referees in sessions
- **Reconnection Handling**: Automatic reconnection with state sync

### 5. Modular Design
- **Plugin Architecture**: Better Auth plugins for extensibility
- **Template System**: Configurable for different sports
- **Service Layer**: Business logic separated from presentation
- **Clear Boundaries**: Well-defined interfaces between modules

## Data Flow

### User Action Flow (Online)
1. User performs action (e.g., gives a card)
2. Frontend updates UI immediately (optimistic update)
3. Action queued for sync
4. tRPC mutation sent to server
5. Server validates and stores in Postgres
6. Server broadcasts to other connected clients (WebSocket)
7. Other clients receive and update UI

### User Action Flow (Offline)
1. User performs action
2. Frontend updates UI immediately
3. Action stored in local database (SQLite/IndexedDB)
4. Action added to sync queue
5. When connection restored:
   - Sync queue replays actions
   - Server validates and applies changes
   - Conflicts detected and resolved
   - Local database updated with server state

### Conflict Resolution Flow
1. Client sends action with version
2. Server checks version against current state
3. If version matches: Apply change, increment version
4. If version mismatch: Return conflict with current state
5. Client shows conflict to user with diff
6. User chooses: Overwrite, reload, or manual merge
7. Client resubmits with correct version

## Security Architecture

### Authentication
- **Better Auth**: Session-based authentication
- **Secure Cookies**: HttpOnly, Secure, SameSite
- **Token Refresh**: Automatic token refresh
- **Multi-Device**: Sessions work across devices

### Authorization
- **Custom Model**: Organization + Competition roles
- **Role-Based**: Permissions defined by roles
- **Resource-Level**: Permissions scoped to competitions
- **Precedence**: Competition roles override organization roles

### Data Security
- **Encryption**: Data encrypted in transit (TLS)
- **Input Validation**: All inputs validated and sanitized
- **SQL Injection Prevention**: Parameterized queries (Drizzle)
- **Audit Logging**: All actions logged for compliance

## Performance Architecture

### Frontend Performance
- **Code Splitting**: Route-based code splitting
- **Lazy Loading**: Components loaded on demand
- **Optimistic Updates**: Immediate UI feedback
- **Caching**: TanStack Query for intelligent caching

### Backend Performance
- **Database Indexing**: Strategic indexes for common queries
- **Connection Pooling**: Efficient database connections
- **Caching**: Response caching where appropriate
- **Batch Operations**: Batched sync operations

### Sync Performance
- **Batching**: TanStack Pacer for operation batching
- **Delta Sync**: Only sync changed data
- **Compression**: Compress sync payloads
- **Priority Queuing**: Critical actions sync first

## Scalability Architecture

### Horizontal Scaling
- **Stateless API**: API servers can be scaled horizontally
- **Load Balancing**: Load balancer for API servers
- **Database Scaling**: Read replicas for scaling reads
- **CDN**: Static asset delivery (post-MVP)

### Vertical Scaling
- **Resource Monitoring**: Track CPU, memory, database performance
- **Optimization**: Regular performance optimization
- **Caching Strategy**: Redis for caching (post-MVP)
- **Database Optimization**: Query optimization and indexing

## Deployment Architecture

### Development
- **Local Development**: Individual package development
- **Hot Reload**: Fast development iteration
- **Shared Database**: Local Postgres instance
- **Mock Services**: Mock external dependencies

### Staging
- **Staging Environment**: Pre-production testing
- **Data Seeding**: Test data for realistic testing
- **Performance Testing**: Load and stress testing
- **Security Testing**: Security audit and penetration testing

### Production
- **VPS Hosting**: Self-hosted on VPS
- **Dockploy**: Container orchestration
- **Database Backups**: Regular automated backups
- **Monitoring**: Application and infrastructure monitoring
- **Log Aggregation**: Centralized logging
- **Error Tracking**: Error monitoring and alerting
