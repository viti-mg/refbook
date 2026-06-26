# RefBook - Referee App Documentation

## Overview

RefBook is a comprehensive referee application for web, iOS, and Android platforms. It enables referees to manage competitions, display cards, log actions, and collaborate in real-time with offline-first capabilities.

## Documentation Structure

- **[UBIQUITOUS_LANGUAGE](./UBIQUITOUS_LANGUAGE.md)** - Domain-driven ubiquitous language glossary with canonical terminology
- **[overview](./overview/)** - Project overview, goals, and MVP scope
- **[architecture](./architecture/)** - System architecture, tech stack, and design decisions
- **[data-model](./data-model/)** - Database schema, data models, and relationships
- **[features](./features/)** - Feature specifications and user stories
- **[implementation](./implementation/)** - Implementation guides and technical details
- **[roadmap](./roadmap/)** - Development roadmap and future plans

## Quick Start

This documentation serves as a blueprint for building the RefBook application. It covers all major architectural decisions, technology choices, and implementation approaches established during the initial planning phase.

## Key Technologies

- **Framework**: TanStack Start (web), React Native + Expo (mobile)
- **State Management**: TanStack Query, TanStack Form
- **Database**: Drizzle ORM with Postgres (server), SQLite (mobile)
- **Authentication**: Better Auth with custom temporal accounts plugin
- **API Server**: tRPC for shared API layer
- **UI**: shadcn/ui with Base UI
- **Build Tool**: Turborepo (monorepo)
- **Testing**: TDD approach with Vitest

## MVP Scope

The initial MVP focuses on solo refereeing with:
- Web-only platform
- Simple authentication (email/username/password) - implemented after core features
- Competition management based on JSON template files
- Card and disqualification logging
- Fullscreen card display
- Action history view
- **Online-only** (offline support deferred to post-MVP)
- **Appeals system deferred** to post-MVP

**Note:** The MVP is intentionally simplified to validate core functionality. The full project includes offline-first sync, collaboration, mobile apps, advanced authentication, and comprehensive template systems as outlined in the roadmap.

## Development Philosophy

- **Pragmatic Testing**: Focus on integration tests for critical paths
- **TypeScript-first**: Maximum type safety across the stack
- **Future-Proof Architecture**: Full monorepo structure from the start for easy expansion
- **Template-driven**: Configurable for different sports and use cases (JSON files in MVP)
- **Incremental Development**: Build features one at a time with working functionality at each stage
- **Real-time ready**: Architecture supports future collaboration features

## Contact & Support

For questions about this documentation or implementation details, refer to the specific section in the documentation structure above.
