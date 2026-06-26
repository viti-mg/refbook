# Monorepo Setup Guide

## Overview

This guide covers setting up the Turborepo monorepo structure for the RefBook application, including package configuration, tooling setup, and development workflow.

## Initial Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn or pnpm
- Git

### Repository Initialization
```bash
# Initialize repository
git init
npm init -y

# Install Turborepo
npm install -D turbo
```

### Turborepo Configuration
```json
// turbo.json
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
    },
    "clean": {
      "cache": false
    }
  }
}
```

## Package Structure Setup

### Root Package Configuration
```json
// package.json
{
  "name": "refbook",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "type-check": "turbo run type-check",
    "clean": "turbo run clean && rm -rf node_modules"
  },
  "devDependencies": {
    "turbo": "^1.10.0",
    "typescript": "^5.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0"
  }
}
```

### Root TypeScript Configuration
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "strict": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "exclude": ["node_modules", "dist", "build"]
}
```

## Shared Packages Setup

### Package: @packages/db
```bash
mkdir -p packages/db/src
cd packages/db
npm init -y
```

```json
// packages/db/package.json
{
  "name": "@packages/db",
  "version": "0.0.0",
  "main": "./index.ts",
  "types": "./index.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "generate": "drizzle-kit generate",
    "migrate": "drizzle-kit migrate",
    "push": "drizzle-kit push"
  },
  "dependencies": {
    "drizzle-orm": "^0.28.0",
    "postgres": "^3.4.0"
  },
  "devDependencies": {
    "drizzle-kit": "^0.19.0",
    "typescript": "^5.0.0"
  }
}
```

```typescript
// packages/db/src/schema.ts
import { pgTable, serial, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  username: text('username').notNull().unique(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const competitions = pgTable('competitions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull().references(() => users.id),
  name: text('name').notNull(),
  sportType: text('sport_type').notNull(),
  status: text('status').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  version: serial('version').default(1),
});
```

```typescript
// packages/db/src/index.ts
export * from './schema';
export { db } from './db';
```

### Package: @packages/api
```bash
mkdir -p packages/api/src
cd packages/api
npm init -y
```

```json
// packages/api/package.json
{
  "name": "@packages/api",
  "version": "0.0.0",
  "main": "./index.ts",
  "types": "./index.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  },
  "dependencies": {
    "@packages/db": "workspace:*",
    "@packages/auth": "workspace:*",
    "@packages/shared-types": "workspace:*",
    "@trpc/server": "^10.0.0",
    "zod": "^3.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
```

```typescript
// packages/api/src/router.ts
import { initTRPC } from '@trpc/server';
import * as z from 'zod';

const t = initTRPC.create();

export const router = t.router({
  competitions: t.router({
    list: t.procedure.query(() => {
      return [];
    }),
    create: t.procedure
      .input(z.object({
        name: z.string(),
        sportType: z.string(),
      }))
      .mutation(({ input }) => {
        return { id: '1', ...input };
      }),
  }),
});

export type AppRouter = typeof router;
```

### Package: @packages/auth
```bash
mkdir -p packages/auth/src
cd packages/auth
npm init -y
```

```json
// packages/auth/package.json
{
  "name": "@packages/auth",
  "version": "0.0.0",
  "main": "./index.ts",
  "types": "./index.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  },
  "dependencies": {
    "@packages/db": "workspace:*",
    "better-auth": "^0.7.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
```

```typescript
// packages/auth/src/auth.ts
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@packages/db';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
});
```

### Package: @packages/shared-types
```bash
mkdir -p packages/shared-types/src
cd packages/shared-types
npm init -y
```

```json
// packages/shared-types/package.json
{
  "name": "@packages/shared-types",
  "version": "0.0.0",
  "main": "./index.ts",
  "types": "./index.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  },
  "dependencies": {
    "zod": "^3.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
```

```typescript
// packages/shared-types/src/index.ts
import { z } from 'zod';

export const CompetitionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  name: z.string(),
  sportType: z.enum(['football', 'athletics']),
  status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled']),
  createdAt: z.date(),
  updatedAt: z.date(),
  version: z.number(),
});

export type Competition = z.infer<typeof CompetitionSchema>;
```

## Application Setup

### App: Referee Application (TanStack Start)
```bash
mkdir -p apps/app
cd apps/app
npm create @tanstack/start@latest
```

```json
// apps/app/package.json
{
  "name": "@apps/app",
  "version": "0.0.0",
  "scripts": {
    "dev": "vite dev --port 3000",
    "generate-routes": "tsr generate",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "dependencies": {
    "@packages/api": "workspace:*",
    "@packages/auth": "workspace:*",
    "@packages/db": "workspace:*",
    "@packages/shared-types": "workspace:*",
    "@trpc/client": "^11.0.0",
    "@trpc/react-query": "^11.0.0",
    "@tanstack/react-query": "^5.0.0",
    "@tanstack/react-query-devtools": "^5.0.0",
    "@tanstack/react-router": "^1.0.0",
    "@tanstack/react-start": "^1.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "drizzle-orm": "^0.45.0",
    "postgres": "^3.4.0",
    "zod": "^4.0.0"
  },
  "devDependencies": {
    "@tanstack/router-plugin": "^1.0.0",
    "@testing-library/react": "^16.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^6.0.0",
    "vite": "^8.0.0",
    "vitest": "^4.0.0",
    "@vitest/coverage-v8": "^4.1.9"
  }
}
```

### Server Functions and Environment Configuration

Server functions in TanStack Start provide type-safe RPC calls between client and server. They are configured in the `src/server/` directory with proper middleware for error handling and authentication.

#### Server Functions Setup

```typescript
// src/server/functions.ts
import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { db } from './db';

// Middleware for error handling
const withErrorHandler = <T extends (...args: any[]) => Promise<any>>(fn: T): T => {
  return (async (...args: any[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      console.error('Server function error:', error);
      if (error instanceof Error) {
        throw new Error(`Server error: ${error.message}`);
      }
      throw new Error('An unknown error occurred');
    }
  }) as T;
};

// Middleware for authentication checks
const withAuthCheck = <T extends (...args: any[]) => Promise<any>>(fn: T): T => {
  return (async (...args: any[]) => {
    const authHeader = args[0]?.headers?.authorization;
    if (!authHeader) {
      throw new Error('Unauthorized: No authentication token provided');
    }
    return await fn(...args);
  }) as T;
};

// Example server function
export const getCompetitionsServer = createServerFn()
  .handler(
    withErrorHandler(async () => {
      const result = await db.select().from(competitions);
      return result;
    })
  );
```

#### Database Access

Server-only database access is configured in `src/server/db.ts` with lazy initialization to avoid import issues during testing:

```typescript
// src/server/db.ts
import { getServerEnv } from '#/lib/env';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Lazy database initialization
let dbInstance: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!dbInstance) {
    const env = getServerEnv();
    const connectionString = env.DATABASE_URL;
    const client = postgres(connectionString);
    dbInstance = drizzle(client);
  }
  return dbInstance;
}

export const db = new Proxy({} as never, {
  get(_target, prop) {
    return getDb()[prop as keyof ReturnType<typeof getDb>];
  },
});
```

#### Environment Variables

Environment variables are configured using TanStack Start's system with TypeScript validation for type safety:

```typescript
// src/lib/env.ts
import { z } from 'zod';

// Server-only environment variables
const serverEnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  APP_URL: z.string().url(),
});

// Client-safe environment variables
const clientEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  APP_URL: z.string().url(),
});

export function getServerEnv() {
  return serverEnvSchema.parse({
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    NODE_ENV: process.env.NODE_ENV,
    APP_URL: process.env.APP_URL,
  });
}

export function getClientEnv() {
  return clientEnvSchema.parse({
    NODE_ENV: process.env.NODE_ENV,
    APP_URL: process.env.APP_URL,
  });
}
```

Environment files are created in the app directory:

```bash
# .env.development
DATABASE_URL=postgres://localhost:5432/refbook
BETTER_AUTH_SECRET=dev-secret-change-in-production
BETTER_AUTH_URL=http://localhost:3000
NODE_ENV=development
APP_URL=http://localhost:3000

# .env.production
DATABASE_URL=postgres://user:password@localhost:5432/refbook
BETTER_AUTH_SECRET=CHANGE_THIS_TO_A_SECURE_RANDOM_STRING
BETTER_AUTH_URL=https://app.refbook.com
NODE_ENV=production
APP_URL=https://app.refbook.com
```

Both `.env.development` and `.env.production` are added to `.gitignore` to prevent committing sensitive data.

### Monorepo Package Integration

The TanStack Start application integrates with existing monorepo packages through workspace dependencies:

#### TypeScript Configuration
```json
// apps/app/tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@packages/*": ["../../packages/*/src"],
      "@apps/*": ["../../apps/*/src"]
    }
  }
}
```

#### tRPC Client Setup
```typescript
// apps/app/src/lib/trpc-provider.tsx
import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@packages/api';

export const trpc = createTRPCReact<AppRouter>();

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: '/api/trpc',
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      {children}
    </trpc.Provider>
  );
}
```

#### Shared Types Integration
```typescript
// apps/app/src/lib/types.ts
export { CompetitionSchema, type Competition } from '@packages/shared-types';
```

#### Server-Only Database Access
```typescript
// apps/app/src/server/db.ts
import { db } from '@packages/db';

// This file can only be imported in server-side code
export { db };
```

#### Server Functions
```typescript
// apps/app/src/server/functions.ts
import { createServerFn } from '@tanstack/react-start';
import { db } from './server/db';

export const getCompetitionsServer = createServerFn()
  .handler(async () => {
    // Server functions have access to @packages/db
    return await db.query.competitions.findMany();
  });
```
```

### App: Mobile (React Native + Expo)
```bash
mkdir -p apps/mobile
cd apps/mobile
npx create-expo-app@latest
```

```json
// apps/mobile/package.json
{
  "name": "@apps/mobile",
  "version": "0.0.0",
  "scripts": {
    "dev": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "build": "expo export"
  },
  "dependencies": {
    "@tanstack/react-query": "^4.0.0",
    "@tanstack/react-form": "^0.0.0",
    "@packages/api": "workspace:*",
    "@packages/auth": "workspace:*",
    "@packages/shared-types": "workspace:*",
    "@packages/sync-engine": "workspace:*",
    "expo": "^49.0.0",
    "react": "^18.0.0",
    "react-native": "^0.72.0"
  }
}
```

### App: API Server
```bash
mkdir -p apps/api-server/src
cd apps/api-server
npm init -y
```

```json
// apps/api-server/package.json
{
  "name": "@apps/api-server",
  "version": "0.0.0",
  "main": "./src/server.ts",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  },
  "dependencies": {
    "@packages/api": "workspace:*",
    "@packages/db": "workspace:*",
    "@packages/auth": "workspace:*",
    "@trpc/server": "^10.0.0",
    "ws": "^8.0.0"
  },
  "devDependencies": {
    "tsx": "^3.0.0",
    "typescript": "^5.0.0"
  }
}
```

```typescript
// apps/api-server/src/server.ts
import { createTRPCContext } from '@packages/api';
import { router } from '@packages/api';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import ws from 'ws';
import http from 'http';

const server = http.createServer();
const wss = new ws.Server({ server });

applyWSSHandler({
  wss,
  router,
  createContext: createTRPCContext,
});

server.listen(3001, () => {
  console.log('Server running on port 3001');
});
```

## Shared Configuration

### ESLint Configuration
```javascript
// .eslintrc.js
module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  ignorePatterns: ['dist', 'build', 'node_modules'],
};
```

### Prettier Configuration
```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

### Git Ignore
```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Build outputs
dist/
build/
.next/
out/

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Testing
coverage/
.nyc_output/

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

## Development Workflow

### Installation
```bash
# Install all dependencies
npm install

# Install specific package dependencies
npm install --filter=@packages/db
```

### Development
```bash
# Start all applications
npm run dev

# Start specific application
npm run dev --filter=@apps/app

# Start specific package in watch mode
npm run dev --filter=@packages/api
```

### Building
```bash
# Build all packages and apps
npm run build

# Build specific package
npm run build --filter=@packages/api

# Build specific app
npm run build --filter=@apps/app
```

### Testing
```bash
# Run all tests
npm run test

# Run specific package tests
npm run test --filter=@packages/api

# Run tests in watch mode
npm run test --watch
```

### Linting
```bash
# Lint all packages
npm run lint

# Lint specific package
npm run lint --filter=@apps/app

# Auto-fix linting issues
npm run lint --fix
```

## Troubleshooting

### Common Issues

#### Workspace Dependencies Not Resolving
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

#### TypeScript Errors Across Packages
```bash
# Ensure all packages are built
npm run build

# Check TypeScript configuration
npm run type-check
```

#### Turborepo Cache Issues
```bash
# Clear Turborepo cache
rm -rf .turbo
npm run build --force
```

## Best Practices

### Package Dependencies
- Use workspace references for internal packages
- Keep dependencies minimal
- Use exact versions for production
- Regular security audits

### Code Organization
- Keep shared logic in packages
- Platform-specific code in apps
- Clear separation of concerns
- Consistent naming conventions

### Git Workflow
- Feature branches for new features
- Pull requests for changes
- Code reviews required
- Automated tests must pass

## Performance Optimization

### Build Performance
- Use Turborepo caching
- Parallel builds where possible
- Incremental builds
- Optimize dependency tree

### Development Performance
- Hot module replacement
- Fast refresh
- Efficient watch mode
- Minimal rebuilds

## Next Steps

After setting up the monorepo:
1. Configure database connection
2. Set up authentication
3. Implement basic API routes
4. Create UI components
5. Set up testing framework
6. Configure CI/CD pipeline
