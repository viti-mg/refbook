# Authentication Implementation

## Overview

Authentication in RefBook uses Better Auth with a custom plugin for temporal accounts. The system supports email/password authentication, OAuth (post-MVP), and competition-specific temporal accounts.

## MVP Authentication

### Simple Authentication (MVP)
- **Email + username + password**: Basic registration and login
- **Session management**: Standard session handling
- **Password reset**: Basic password reset functionality
- **No OAuth**: Social login deferred to post-MVP
- **No temporal accounts**: Temporal accounts deferred to post-MVP

## Better Auth Configuration

### Server Configuration
```typescript
// packages/auth/src/auth.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@packages/db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // MVP: no email verification
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 24 hours
  },
  user: {
    additionalFields: {
      username: {
        type: "string",
        required: true,
        unique: true,
      },
    },
  },
});
```

### Client Configuration
```typescript
// packages/auth/src/client.ts
import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
});
```

## User Registration

### Registration Flow
```typescript
// Registration component
function RegisterForm() {
  const form = useForm({
    defaultValues: {
      email: "",
      username: "",
      password: "",
      name: "",
    },
  });

  const register = async (data: RegisterData) => {
    try {
      const result = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        username: data.username,
        name: data.name,
      });

      if (result.error) {
        toast.error(result.error.message);
        return;
      }

      toast.success("Registration successful");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Registration failed");
    }
  };

  return (
    <form onSubmit={form.handleSubmit(register)}>
      <Input name="email" type="email" label="Email" />
      <Input name="username" label="Username" />
      <Input name="password" type="password" label="Password" />
      <Input name="name" label="Full Name" />
      <Button type="submit">Register</Button>
    </form>
  );
}
```

## User Login

### Login Flow
```typescript
// Login component
function LoginForm() {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const login = async (data: LoginData) => {
    try {
      const result = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        toast.error(result.error.message);
        return;
      }

      toast.success("Login successful");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Login failed");
    }
  };

  return (
    <form onSubmit={form.handleSubmit(login)}>
      <Input name="email" type="email" label="Email" />
      <Input name="password" type="password" label="Password" />
      <Button type="submit">Login</Button>
    </form>
  );
}
```

## Session Management

### Session Hook
```typescript
// Custom hook for session management
function useSession() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getSession() {
      try {
        const result = await authClient.getSession();
        setSession(result.data);
      } catch (error) {
        setSession(null);
      } finally {
        setLoading(false);
      }
    }

    getSession();
  }, []);

  const logout = async () => {
    await authClient.signOut();
    setSession(null);
    router.push("/login");
  };

  return { session, loading, logout };
}
```

### Protected Routes
```typescript
// Route protection wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useSession();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!session) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

// Usage in TanStack Start
export const Route = createFileRoute('/dashboard')({
  component: () => (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  ),
});
```

## Password Reset

### Password Reset Flow
```typescript
// Request password reset
async function requestPasswordReset(email: string) {
  try {
    const result = await authClient.forgetPassword({
      email,
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (result.error) {
      toast.error(result.error.message);
      return;
    }

    toast.success("Password reset email sent");
  } catch (error) {
    toast.error("Failed to send reset email");
  }
}

// Reset password
async function resetPassword(data: { token: string; password: string }) {
  try {
    const result = await authClient.resetPassword({
      token: data.token,
      newPassword: data.password,
    });

    if (result.error) {
      toast.error(result.error.message);
      return;
    }

    toast.success("Password reset successful");
    router.push("/login");
  } catch (error) {
    toast.error("Failed to reset password");
  }
}
```

## Post-MVP: OAuth Integration

### OAuth Configuration
```typescript
// Enhanced auth configuration with OAuth
export const auth = betterAuth({
  // ... existing configuration
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
  },
});
```

### OAuth Login
```typescript
// Google OAuth login
async function loginWithGoogle() {
  await authClient.signIn.social({
    provider: "google",
    callbackURL: "/dashboard",
  });
}

// GitHub OAuth login
async function loginWithGitHub() {
  await authClient.signIn.social({
    provider: "github",
    callbackURL: "/dashboard",
  });
}
```

## Post-MVP: Temporal Accounts Plugin

### Custom Plugin Structure
```typescript
// packages/auth/src/plugins/temporal-accounts.ts
import type { BetterAuthPlugin } from "better-auth";

interface TemporalAccountOptions {
  competitionId: string;
  expiresAt: Date;
}

export const temporalAccountsPlugin = () => {
  return {
    id: "temporal-accounts",
    schema: {
      user: {
        fields: {
          isTemporal: {
            type: "boolean",
            default: false,
          },
          competitionId: {
            type: "string",
            required: false,
          },
          expiresAt: {
            type: "date",
            required: false,
          },
        },
      },
    },
    endpoints: {
      createTemporalAccount: createAuthEndpoint(
        "/temporal-accounts/create",
        {
          method: "POST",
        },
        async (ctx) => {
          const { username, password, competitionId, expiresAt } = ctx.body;
          
          // Create temporal account
          const user = await ctx.internalAdapter.createUser({
            email: `${username}@temporal.refbook.local`,
            username,
            password,
            isTemporal: true,
            competitionId,
            expiresAt,
          });

          return ctx.json({ success: true, user });
        }
      ),
    },
  } satisfies BetterAuthPlugin;
};
```

### Temporal Account Usage
```typescript
// Create temporal account (admin only)
async function createTemporalAccount(data: {
  username: string;
  password: string;
  competitionId: string;
  expiresAt: Date;
}) {
  const result = await authClient.api.temporalAccounts.create(data);
  return result;
}

// Temporal account login (same as regular login)
async function loginTemporalAccount(username: string, password: string) {
  const result = await authClient.signIn.email({
    email: `${username}@temporal.refbook.local`,
    password,
  });
  return result;
}
```

## Security Considerations

### Password Security
- **Hashing**: Passwords hashed using bcrypt
- **Strength requirements**: Minimum password strength
- **No plaintext storage**: Never store passwords in plaintext
- **Secure transmission**: Always use HTTPS

### Session Security
- **HttpOnly cookies**: Prevent XSS attacks
- **Secure cookies**: Only sent over HTTPS
- **SameSite**: CSRF protection
- **Short expiration**: Reasonable session expiration

### Rate Limiting
- **Login attempts**: Limit login attempts
- **Registration**: Limit registration attempts
- **Password reset**: Limit password reset requests

## Testing Strategy

### Unit Tests
- Registration flow tests
- Login flow tests
- Session management tests
- Password reset tests

### Integration Tests
- Better Auth integration tests
- Database adapter tests
- OAuth flow tests (post-MVP)
- Temporal account tests (post-MVP)

### E2E Tests
- Complete registration flow
- Complete login flow
- Password reset flow
- Session management flow

## Database Schema

### Better Auth Tables
Better Auth manages its own tables:
- `users`: User accounts
- `sessions`: User sessions
- `accounts`: Linked accounts (OAuth)
- `verification_tokens`: Email verification tokens

### Custom User Fields
Additional fields added to users table:
- `username`: Unique username
- `isTemporal`: Boolean for temporal accounts (post-MVP)
- `competitionId`: Associated competition (post-MVP)
- `expiresAt`: Account expiration (post-MVP)

## Environment Variables

### Required Variables
```env
# Better Auth
BETTER_AUTH_URL=http://localhost:3000/api/auth
BETTER_AUTH_SECRET=your-secret-key

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/refbook

# OAuth (post-MVP)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

## Troubleshooting

### Common Issues
- **Session not persisting**: Check cookie configuration
- **Login failing**: Check database connection
- **OAuth not working**: Verify OAuth credentials
- **Temporal accounts failing**: Check plugin configuration

### Debug Mode
```typescript
// Enable debug mode
export const auth = betterAuth({
  // ... configuration
  debug: true, // Enable detailed logging
});
```

## Future Enhancements

### Post-MVP Features
- **Two-factor authentication**: 2FA for enhanced security
- **Email verification**: Email verification for registration
- **Social login**: Additional OAuth providers
- **Account recovery**: Enhanced account recovery options
- **Session management**: Advanced session management UI
- **Audit logging**: Authentication event logging
- **Device management**: Manage trusted devices
