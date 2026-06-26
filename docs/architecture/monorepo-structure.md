# Monorepo Structure

## Repository Layout

```
refbook/
├── apps/
│   ├── app/                    # TanStack Start web application
│   │   ├── src/                # TanStack Start routes and pages
│   │   ├── components/         # Web-specific components
│   │   ├── lib/                # Web utilities and helpers
│   │   └── public/             # Static assets
│   ├── mobile/                 # React Native + Expo application (placeholder)
│   └── api-server/             # tRPC server + WebSocket server (placeholder)
├── packages/
│   ├── api/                    # Shared tRPC router, client setup, and server logic
│   │   ├── src/
│   │   │   ├── router.ts       # tRPC router definition
│   │   │   ├── client.ts       # tRPC client setup
│   │   │   ├── provider.tsx    # tRPC React provider component
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── db/                     # Drizzle ORM schema and migrations
│   │   ├── src/
│   │   │   ├── schema/         # Database schema definitions
│   │   │   ├── migrations/     # Database migrations
│   │   │   └── seed/           # Database seeding scripts
│   │   └── index.ts
│   ├── auth/                   # Better Auth configuration
│   │   ├── src/
│   │   │   ├── auth.ts         # Better Auth configuration
│   │   │   ├── plugins/        # Custom auth plugins
│   │   │   └── client.ts       # Auth client configuration
│   │   └── index.ts
│   ├── types/                  # Shared TypeScript types
│   │   ├── src/
│   │   │   ├── models/         # Data model types
│   │   │   ├── api/            # API-related types
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── sync-engine/            # Offline sync and conflict resolution (placeholder for future mobile sync)
│   │   ├── src/
│   │   │   ├── sync/           # Sync logic
│   │   │   ├── conflict/       # Conflict resolution
│   │   │   ├── queue/          # Sync queue management
│   │   │   └── storage/        # Storage abstraction
│   │   └── index.ts
│   ├── ui/                     # Shared UI components
│   │   ├── src/
│   │   │   ├── components/     # Shared components
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── config/                 # Shared configuration and environment validation
│       ├── src/
│       │   ├── env.ts          # Environment variable validation
│       │   └── index.ts
│       └── index.ts
├── docs/                       # Documentation
├── turbo.json                  # Turborepo configuration
├── package.json                # Root package.json
└── tsconfig.json               # Root TypeScript configuration
```

## Package Dependencies

### apps/app
- **tanstack-start**: Framework
- **@tanstack/react-query**: State management
- **@tanstack/react-form**: Form management
- **@packages/api**: Shared tRPC router and client
- **@packages/auth**: Auth client
- **@packages/config**: Environment validation
- **@packages/types**: Shared types
- **@packages/ui**: Shared UI components (shadcn/ui)

### apps/mobile
- **expo**: React Native framework
- **react-native**: Core React Native
- **@tanstack/react-query**: State management
- **@tanstack/react-form**: Form management
- **@packages/api**: Shared tRPC client
- **@packages/auth**: Auth client
- **@packages/config**: Environment validation
- **@packages/types**: Shared types
- **@packages/sync-engine**: Sync logic
- **expo-sqlite**: Local database

### apps/api-server
- **@tanstack/react-query**: Server-side queries
- **@packages/api**: tRPC router
- **@packages/config**: Environment validation
- **@packages/db**: Database access
- **@packages/auth**: Auth server
- **@packages/types**: Shared types
- **ws**: WebSocket server
- **better-auth**: Authentication

### packages/api
- **@trpc/server**: tRPC server
- **@trpc/client**: tRPC client
- **@trpc/react-query**: tRPC React integration
- **@tanstack/react-query**: React Query for state management
- **react**: React for provider component
- **@packages/db**: Database access
- **@packages/auth**: Authentication
- **@packages/types**: Shared types
- **zod**: Runtime validation

### packages/db
- **drizzle-orm**: ORM
- **drizzle-kit**: Migration toolkit
- **postgres**: Postgres client

### packages/auth
- **better-auth**: Authentication framework
- **@packages/db**: Database access

### packages/types
- **zod**: Runtime validation
- **typescript**: Type definitions

### packages/sync-engine
- **@tanstack/pacer**: Batching and throttling
- **@packages/types**: Shared types

### packages/ui
- **react**: React
- **@tanstack/react-form**: Form integration
- **shadcn-ui**: Component library

### packages/config
- **zod**: Runtime validation
- **typescript**: Type definitions

## Turborepo Configuration

### turbo.json
```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "build/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "outputs": []
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    },
    "type-check": {
      "dependsOn": ["^build"],
      "outputs": []
    }
  }
}
```

## Development Workflow

### Local Development
1. **Install dependencies**: `npm install`
2. **Start development**: `npm run dev` (starts all apps)
3. **Run specific app**: `npm run dev --filter=web`
4. **Build specific package**: `npm run build --filter=@packages/api`

### Adding Dependencies
1. **Add to specific app**: `npm install <package> --filter=web`
2. **Add to all apps**: `npm install <package> -w`
3. **Add dev dependency**: `npm install <package> -D -w`

### Running Tests
1. **All tests**: `npm run test`
2. **Specific package**: `npm run test --filter=@packages/api`
3. **Watch mode**: `npm run test --watch`

### Type Checking
1. **All packages**: `npm run type-check`
2. **Specific package**: `npm run type-check --filter=web`

## Code Sharing Strategy

### Shared Business Logic
- **API layer**: tRPC procedures shared across platforms
- **Data models**: TypeScript types in types
- **Validation**: Zod schemas shared between client and server
- **Sync logic**: Sync engine shared between web and mobile

### Shared UI Components
- **Basic components**: Buttons, inputs, cards in ui package
- **Platform-specific**: Web and mobile have their own components
- **Design system**: Shared design tokens and themes

### Shared Configuration
- **ESLint**: Shared linting rules
- **TypeScript**: Shared TSConfig
- **Build tools**: Shared build configuration

## Build and Deployment

### Build Order
1. **Packages first**: Shared packages build before apps
2. **API server**: API server builds before web/mobile
3. **Apps**: Web and mobile build independently

### Deployment Strategy
- **Independent deployment**: Each app can be deployed independently
- **Shared packages**: Deployed as part of app deployments
- **API server**: Deployed separately from frontend apps

### Version Management
- **Semantic versioning**: Packages use semantic versioning
- **Dependent versions**: Apps specify package versions
- **Breaking changes**: Major version increments for breaking changes

## Monorepo Benefits

### Code Reuse
- **Maximum sharing**: Business logic shared across platforms
- **Single source of truth**: API types and models defined once
- **Consistent behavior**: Same logic across web and mobile

### Development Efficiency
- **Single repository**: All code in one place
- **Shared tooling**: Consistent tooling across packages
- **Atomic commits**: Changes across packages in single commit

### CI/CD
- **Efficient builds**: Only build changed packages
- **Shared pipelines**: CI/CD configuration shared
- **Faster feedback**: Quick feedback on changes

### Onboarding
- **Simple setup**: Single clone and install
- **Clear structure**: Well-organized codebase
- **Shared knowledge**: Teams work in same codebase

## Monorepo Challenges

### Complexity
- **Learning curve**: Team needs to understand monorepo
- **Tooling**: Additional tooling complexity
- **Build time**: Initial build can be slower

### Dependencies
- **Version conflicts**: Dependency management across packages
- **Update coordination**: Coordinating updates across packages
- **Breaking changes**: Impact across multiple packages

### Performance
- **Build time**: Full repository builds can be slow
- **Disk space**: Multiple node_modules
- **Memory usage**: Multiple processes in development

## Mitigation Strategies

### Tooling
- **Turborepo**: Efficient build system
- **Nx**: Alternative advanced tooling (if needed)
- **Changesets**: Automated version management

### Development
- **Selective builds**: Only build what's needed
- **Hot reload**: Fast development iteration
- **Caching**: Aggressive caching of builds

### Documentation
- **Clear guidelines**: Monorepo usage guidelines
- **Training**: Team training on monorepo
- **Best practices**: Documented best practices
