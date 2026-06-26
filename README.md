# RefBook - Referee Application

A comprehensive referee application for web, iOS, and Android platforms.

## Project Structure

This is a Turborepo monorepo with the following structure:

```
refbook/
├── apps/
│   ├── web/                    # TanStack Start web application
│   ├── mobile/                 # React Native + Expo application
│   └── api-server/             # tRPC server + WebSocket server
├── packages/
│   ├── api/                    # Shared tRPC router and server logic
│   ├── db/                     # Drizzle ORM schema and migrations
│   ├── auth/                   # Better Auth configuration
│   ├── types/                  # Shared TypeScript types
│   ├── sync-engine/            # Offline sync and conflict resolution
│   ├── ui/                     # Shared UI components
│   └── config/                 # Shared configuration
└── docs/                       # Documentation
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- Git

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build all packages
npm run build

# Run tests
npm run test

# Type check
npm run type-check
```

### Development

```bash
# Start all apps
npm run dev

# Start specific app
npm run dev --filter=web

# Build specific package
npm run build --filter=@packages/api
```

## Tech Stack

- **Web**: TanStack Start
- **Mobile**: React Native + Expo
- **State Management**: TanStack Query, TanStack Form
- **Database**: Drizzle ORM with Postgres
- **Authentication**: Better Auth
- **API**: tRPC
- **Build Tool**: Turborepo

## Documentation

See the [docs](./docs) directory for detailed documentation.

## License

MIT
