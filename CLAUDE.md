# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a modern Product Information Management (PIM) system built with a microservices architecture. The platform provides centralized product management, user authentication, asset handling, and email services.

## Development Commands

### Root Level Commands

- `npm run dev` - Start all services in development mode
- `npm run dev:build` - Build and start all services (recommended for first run)
- `npm run dev:down` - Stop all development services
- `npm run dev:down:volumes` - Stop services and remove volumes
- `npm run lint` - Run linting for client and services
- `npm run format` - Format all TypeScript, JavaScript, JSON, and Markdown files

### Service-Specific Commands

#### Client (React/Vite)

- `cd client && npm run dev` - Start development server
- `cd client && npm run build` - Build for production
- `cd client && npm run lint` - ESLint check
- `cd client && npm run codegen` - Generate GraphQL types

#### GraphQL Service (Main API)

- `cd services/graphql-service && npm run dev` - Start development server
- `cd services/graphql-service && npm run build` - Build TypeScript
- `cd services/graphql-service && npm run test` - Run Jest tests
- `cd services/graphql-service && npm run generate:entities` - Generate TypeORM entities

#### Auth Service

- `cd services/auth-service && npm run dev` - Start development server
- `cd services/auth-service && npm run test` - Run all tests
- `cd services/auth-service && npm run test:unit` - Run unit tests only
- `cd services/auth-service && npm run test:integration` - Run integration tests
- `cd services/auth-service && npm run test:e2e` - Run end-to-end tests

## Architecture

### Microservices Structure

- **Client**: React + Vite frontend with Material-UI
- **GraphQL Service**: Main API using Apollo Server and TypeORM
- **Auth Service**: JWT-based authentication with Express
- **Mail Service**: Email notifications using Nodemailer
- **Upload Service**: File upload and asset management
- **Nginx**: Reverse proxy and static asset serving
- **PostgreSQL**: Primary database with full-text search
- **Redis**: Caching layer for GraphQL service

### Key Technologies

- **Frontend**: React 18, Material-UI v5, Apollo Client, Redux Toolkit
- **Backend**: Node.js, TypeScript, GraphQL, TypeORM, Express
- **Database**: PostgreSQL 15 with UUID primary keys and trigram indexing
- **Caching**: Redis with configurable TTL
- **Containerization**: Docker with development volume mounting

## Database Architecture

The PostgreSQL schema uses UUID primary keys throughout and includes:

- Full-text search capabilities with trigram indexing
- Soft delete pattern with `DeleteDateColumn`
- Database migrations in `storage/postgres/migrations/`
- Seed data for categories, tags, actions, and users

## Development Workflow

1. **First Time Setup**: Run `npm run dev:build` to build all containers
2. **Daily Development**: Use `npm run dev` for faster startup
3. **Database Access**: PostgreSQL exposed on port 5435 for external tools
4. **Frontend Access**: http://localhost:8000
5. **API Access**: http://localhost:8000/api (GraphQL endpoint)

## Testing Strategy

- **Auth Service**: Comprehensive test suite with unit, integration, and e2e tests
- **GraphQL Service**: Jest configuration ready for testing
- **Client**: Playwright setup for e2e testing (tests/e2e directory)

## Code Patterns

### GraphQL Resolvers

- Use TypeGraphQL decorators (`@Resolver`, `@Query`, `@Mutation`)
- Implement authorization with `@Authorized` decorator
- Cache frequently accessed data using Redis
- Follow pagination pattern with `PaginatedResponse` types

### Entity Relationships

- Products have many-to-many relationships with Categories and Tags
- Soft delete implemented via TypeORM's `@DeleteDateColumn`
- History tracking for all product modifications
- Brand relationships with products and logo management

### Authentication Flow

- JWT tokens with separate access/refresh token pattern
- Role-based access control (SysAdmin/Admin/Collaborator)
- Password reset functionality with email verification
- Rate limiting on authentication endpoints

## File Structure Notes

- `client/src/generated/` - Auto-generated GraphQL types (do not edit manually)
- `services/*/dist/` - Compiled TypeScript output (gitignored)
- `storage/assets/` - Static assets served by Nginx
- `storage/postgres/init/` - Database initialization scripts
- `deploy/dev/` - Development Docker Compose configuration

## Common Development Tasks

When adding new GraphQL functionality:

1. Define entities in `services/graphql-service/src/entities/`
2. Create resolvers in `services/graphql-service/src/resolvers/`
3. Run `cd client && npm run codegen` to update frontend types
4. Implement frontend components using generated types

When modifying database schema:

1. Create migration files in `storage/postgres/migrations/`
2. Update TypeORM entities accordingly
3. Restart containers to apply changes
