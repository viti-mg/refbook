# Better Auth Setup Implementation

## Overview

Better Auth has been configured to provide email/password authentication for the RefBook application. This document describes the implementation details, configuration, and usage patterns.

## Implementation Status

✅ **Completed**: Better Auth configuration and schema setup (Slice 01 of Email Auth PRD)

## Configuration

### Environment Variables

The following environment variables are required for Better Auth:

- `BETTER_AUTH_SECRET`: Encryption secret (minimum 32 characters)
  - Generate with: `openssl rand -base64 32`
  - Used for session encryption and security
- `BETTER_AUTH_URL`: Base URL for the application
  - Example: `http://localhost:3000` (development)
  - Example: `https://app.refbook.com` (production)
- `DATABASE_URL`: PostgreSQL connection string
  - Shared with the database package
- `APP_URL`: Application URL
  - Used for email verification links and redirects

### Package Structure

```
packages/auth/
├── src/
│   ├── auth.ts              # Better Auth configuration
│   ├── index.ts             # Exports (auth instance, types)
│   └── __tests__/
│       └── auth-config.test.ts  # Integration tests
├── package.json
└── vitest.config.ts         # Test configuration
```

### Auth Configuration

The Better Auth instance is configured in `packages/auth/src/auth.ts`:

```typescript
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@packages/db';
import { getServerEnv } from '@packages/config';

const env = getServerEnv();

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // MVP: disabled for simplicity
  },
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  advanced: {
    generateId: () => crypto.randomUUID(), // Use UUID for ID generation
  },
});
```

### Database Schema

Better Auth manages the following database tables (defined in `packages/db/src/schema.ts`):

#### user
- `id`: text (primary key)
- `email`: text (unique, not null)
- `emailVerified`: text
- `username`: text (unique)
- `name`: text
- `createdAt`: timestamp (default now)
- `updatedAt`: timestamp (default now)

#### session
- `id`: text (primary key)
- `userId`: text (foreign key → user.id)
- `expiresAt`: timestamp (not null)
- `token`: text (unique, not null)
- `createdAt`: timestamp (default now)
- `updatedAt`: timestamp (default now)

#### account
- `id`: text (primary key)
- `userId`: text (foreign key → user.id)
- `accountId`: text (not null)
- `providerId`: text (not null)
- `accessToken`: text
- `refreshToken`: text
- `idToken`: text
- `expiresAt`: timestamp
- `password`: text (hashed)
- `createdAt`: timestamp (default now)
- `updatedAt`: timestamp (default now)

#### verification_token
- `id`: text (primary key)
- `identifier`: text (not null)
- `token`: text (not null)
- `expiresAt`: timestamp (not null)

### Migration

Database migrations are managed using Drizzle Kit:

```bash
# Generate migration
cd packages/db
npx drizzle-kit generate

# Apply migration (when database is available)
npx drizzle-kit push
```

The initial migration has been generated: `packages/db/drizzle/0000_fuzzy_thunderbird.sql`

## Exports

The auth package exports the following:

```typescript
export { auth } from './auth';
export type { Session, User } from 'better-auth/types';
export type { auth } from './auth';
```

## Integration Points

### With Database Package

- Uses `@packages/db` for database connection
- Integrates with Drizzle ORM via the Drizzle adapter
- Shares the PostgreSQL database connection

### With Config Package

- Uses `@packages/config` for environment variable validation
- Ensures required environment variables are set
- Type-safe environment configuration

### With API Package (Future)

- Will be integrated with tRPC router in `packages/api`
- Auth procedures will be exposed via tRPC
- Type-safe client-server auth operations

### With App Package (Future)

- React components will use Better Auth React client
- Session management in TanStack Start routes
- Route protection based on authentication status

## Testing

Integration tests are located in `packages/auth/src/__tests__/auth-config.test.ts`:

```bash
cd packages/auth
npm test
npm run test:coverage
```

Tests cover:
- Environment variable configuration
- Better Auth package availability
- Drizzle adapter availability
- Auth instance creation

## Security Considerations

### Current Implementation (MVP)

- Email/password authentication enabled
- Email verification disabled for simplicity
- Secure session management via Better Auth
- Password hashing handled by Better Auth
- CSRF protection built-in

### Future Enhancements

- Email verification flow
- OAuth providers (Google, GitHub)
- Two-factor authentication
- Password reset flow
- Session management UI

## Troubleshooting

### Environment Variables Not Set

If you see errors about missing environment variables:

1. Copy `.env.example` to `.env`
2. Set `BETTER_AUTH_SECRET` (min 32 characters)
3. Set `BETTER_AUTH_URL` to your application URL
4. Set `DATABASE_URL` to your PostgreSQL connection string

### Database Migration Issues

If migration fails:

1. Ensure PostgreSQL is running
2. Check `DATABASE_URL` is correct
3. Verify database user has necessary permissions
4. Run `npx drizzle-kit generate` to regenerate migration

### Workspace Dependency Resolution

If you encounter workspace dependency issues:

1. Run `npm install` from the project root
2. Ensure all packages are built: `npm run build`
3. Clear node_modules and reinstall if needed

## Next Steps

The next slice (02-api-integration-ui.md) will:

1. Integrate Better Auth with tRPC router in `packages/api`
2. Create SignUp and SignIn UI components in `apps/app`
3. Implement route protection using Better Auth session hooks
4. Update Header component to display user information

## References

- [Better Auth Documentation](https://better-auth.com/docs)
- [Better Auth Drizzle Adapter](https://better-auth.com/docs/adapters/drizzle)
- [Email Auth PRD](../development/active/email-auth-better-auth/prd.md)
- [Issue: Better Auth Configuration & Schema](../development/active/email-auth-better-auth/01-better-auth-config-schema.md)
