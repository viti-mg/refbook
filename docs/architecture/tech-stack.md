# Technology Stack

## Core Technologies

### Frontend Framework
- **Web**: TanStack Start (full-stack React framework)
- **Mobile**: React Native + Expo (iOS and Android)
- **Language**: TypeScript (100% TypeScript, no JavaScript)

### State Management
- **TanStack Query**: Server state management, data fetching, caching
- **TanStack Form**: Form state management and validation
- **TanStack Table**: Headless UI for data tables and registries
- **TanStack Pacer**: Debouncing, throttling, rate limiting for sync operations

### UI Components
- **shadcn/ui**: Component library with Base UI primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Base UI**: Accessible component primitives (alternative to Radix UI)

### Backend & API Server
- **tRPC**: Type-safe API layer for all platforms
- **TanStack Start Server Functions**: Web-specific server endpoints
- **Node.js**: Runtime environment

### Database
- **PostgreSQL**: Primary database (self-hosted on VPS)
- **Drizzle ORM**: Type-safe database queries and migrations
- **SQLite**: Local database for mobile apps (offline support)
- **IndexedDB**: Local storage for web app (offline support)

### Authentication
- **Better Auth**: Authentication framework
- **Custom Plugin**: Temporal accounts for competition-specific access
- **Methods**: Email/password, OAuth (post-MVP)

### Real-time & Sync
- **WebSocket**: Real-time collaboration (post-MVP)
- **Custom Sync Engine**: Offline-first synchronization
- **Optimistic Concurrency**: Conflict resolution strategy

### Build & Tooling
- **Turborepo**: Monorepo management
- **Vite**: Build tool and dev server
- **TypeScript**: Type checking and compilation
- **ESLint**: Code linting
- **Prettier**: Code formatting

### Testing
- **Vitest**: Unit and integration testing
- **Playwright**: End-to-end testing (web)
- **React Native Testing Library**: Mobile component testing
- **Testing Library**: React component testing
- **Test-Driven Development**: Primary development approach

### Deployment
- **VPS**: Self-hosted server
- **Dockploy**: Container orchestration and deployment
- **Docker**: Containerization

## Technology Rationale

### TanStack Ecosystem
- **Type Safety**: End-to-end TypeScript integration
- **Performance**: Optimized for modern web applications
- **Developer Experience**: Excellent DX with great documentation
- **Consistency**: Unified approach across state, routing, and forms

### React Native + Expo
- **Code Sharing**: Maximum code reuse with web application
- **Cross-Platform**: Single codebase for iOS and Android
- **Performance**: Sufficient for referee app requirements
- **Ecosystem**: Mature libraries and community support

### Better Auth
- **Flexibility**: Plugin-based architecture for custom requirements
- **Type Safety**: Full TypeScript support
- **Modern**: Built for contemporary authentication patterns
- **Extensible**: Custom plugins for temporal accounts

### Drizzle ORM
- **Type Safety**: Excellent TypeScript integration
- **Performance**: Lightweight and fast
- **SQL-like**: Intuitive query syntax
- **Migration**: Built-in migration system

### tRPC
- **Type Safety**: End-to-end type safety between client and server
- **No Schema**: No need for separate schema definitions
- **Performance**: Efficient data transfer
- **Integration**: Works seamlessly with TanStack Query

### shadcn/ui + Base UI
- **Beautiful**: Modern, accessible components
- **Customizable**: Full control over styling
- **Accessibility**: Built-in ARIA and keyboard navigation
- **Performance**: Optimized components

## Technology Constraints

### Dependencies
- **Minimum Age**: Dependencies must be at least 7 days old (security best practice)
- **No Floating Ranges**: Avoid `latest`, `*`, or unbounded `>=` versions
- **Security**: Regular security audits and updates

### Platform Support
- **Web**: Modern browsers (Chrome, Firefox, Safari, Edge)
- **iOS**: iOS 14+ (Expo minimum)
- **Android**: Android 8+ (Expo minimum)

### Performance Targets
- **Web**: < 3s initial load, < 100ms interaction response
- **Mobile**: < 2s app launch, smooth 60fps animations
- **Sync**: < 1s conflict resolution, < 5s batch sync

## Future Technology Considerations

### Monitoring & Analytics
- **Error Tracking**: Sentry or similar
- **Analytics**: User behavior tracking (post-MVP)
- **Performance Monitoring**: APM solution (post-MVP)

### Additional Libraries
- **TanStack Virtual**: For large list virtualization (if needed)
- **TanStack Hotkeys**: For keyboard shortcuts (if needed)
- **Date/Time**: date-fns or similar for date manipulation

### Infrastructure
- **CDN**: For static asset delivery (post-MVP)
- **Load Balancing**: For scaling (post-MVP)
- **Caching**: Redis or similar (post-MVP)
