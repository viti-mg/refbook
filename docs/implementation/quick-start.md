# Quick Start Guide

## Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- Git
- PostgreSQL (for local development)

## Initial Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd refbook
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/refbook

# Better Auth
BETTER_AUTH_URL=http://localhost:3000/api/auth
BETTER_AUTH_SECRET=your-secret-key-here

# API
API_URL=http://localhost:3001
```

### 4. Set Up Database
```bash
# Create database
createdb refbook

# Run migrations
npm run db:migrate

# Seed database (optional)
npm run db:seed
```

## Development

### Start All Applications
```bash
npm run dev
```

This will start:
- Referee application: http://localhost:3000
- API server: http://localhost:3001
- Database: localhost:5432

### Start Specific Application
```bash
# Referee application only
npm run dev --filter=@apps/app

# API server only
npm run dev --filter=@apps/api-server

# Mobile app
npm run dev --filter=@apps/mobile
```

## Building

### Build All Packages
```bash
npm run build
```

### Build Specific Package
```bash
npm run build --filter=@packages/api
```

## Testing

### Run All Tests
```bash
npm run test
```

### Run Tests in Watch Mode
```bash
npm run test --watch
```

### Run Specific Package Tests
```bash
npm run test --filter=@packages/db
```

## Linting

### Lint All Packages
```bash
npm run lint
```

### Auto-fix Linting Issues
```bash
npm run lint --fix
```

## Type Checking

### Check All Packages
```bash
npm run type-check
```

## Database Operations

### Generate Migration
```bash
npm run db:generate
```

### Run Migration
```bash
npm run db:migrate
```

### Push Schema Changes (Development)
```bash
npm run db:push
```

### Open Database Studio
```bash
npm run db:studio
```

## Useful Commands

### Clean All Build Artifacts
```bash
npm run clean
```

### Update Dependencies
```bash
npm update
```

### Check for Security Vulnerabilities
```bash
npm audit
```

## Project Structure

```
refbook/
├── apps/
│   ├── web/           # Marketing website (Vite + React)
│   ├── app/           # Referee application (TanStack Start)
│   ├── mobile/        # React Native + Expo app
│   └── api-server/    # tRPC + WebSocket server
├── packages/
│   ├── api/           # Shared tRPC router
│   ├── db/            # Drizzle ORM schema
│   ├── auth/          # Better Auth configuration
│   ├── shared-types/  # Shared TypeScript types
│   └── sync-engine/   # Offline sync logic
└── docs/              # Documentation
```

## Development Workflow

### 1. Create Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes
- Edit code in appropriate package/app
- Run tests: `npm run test`
- Run linting: `npm run lint`
- Type check: `npm run type-check`

### 3. Test Changes
```bash
npm run dev
```

### 4. Commit Changes
```bash
git add .
git commit -m "feat: add your feature"
```

### 5. Push and Create PR
```bash
git push origin feature/your-feature-name
```

## Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
pg_isready

# Check database exists
psql -l

# Recreate database
dropdb refbook && createdb refbook
npm run db:migrate
```

### Dependency Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

### Port Already in Use
```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Build Errors
```bash
# Clear Turborepo cache
rm -rf .turbo

# Rebuild
npm run build --force
```

## Learning Resources

### Internal Documentation
- [Project Overview](../01-overview/project-overview.md)
- [System Architecture](../02-architecture/system-architecture.md)
- [Tech Stack](../02-architecture/tech-stack.md)
- [MVP Schema](../03-data-model/mvp-schema.md)

### External Resources
- [TanStack Start Docs](https://tanstack.com/start/latest)
- [React Native Docs](https://reactnative.dev/)
- [Better Auth Docs](https://better-auth.com/)
- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Turborepo Docs](https://turbo.build/repo/docs)

## Getting Help

If you encounter issues:
1. Check the documentation in `docs/`
2. Search existing GitHub issues
3. Create a new issue with detailed information
4. Contact the development team

## Next Steps

After completing the quick start:
1. Explore the codebase structure
2. Read the feature documentation
3. Set up your development environment
4. Start with a small feature or bug fix
5. Follow the development workflow

Happy coding! 🚀
