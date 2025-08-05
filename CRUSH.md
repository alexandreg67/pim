# CRUSH.md

This file provides guidance for agentic coding assistants working with this repository.

## Project Overview

This is a modern Product Information Management (PIM) system built with a microservices architecture using TypeScript, React, Node.js, GraphQL, and PostgreSQL.

## Build/Lint/Test Commands

### Root Level Commands

- `npm run dev` - Start all services in development mode
- `npm run dev:build` - Build and start all services (recommended for first run)
- `npm run lint` - Run linting for client and services
- `npm run format` - Format all files

### Service-Specific Commands

#### Client (React/Vite)

- `cd client && npm run dev` - Start development server
- `cd client && npm run build` - Build for production
- `cd client && npm run lint` - ESLint check
- `cd client && npm run codegen` - Generate GraphQL types
- Run single test: `cd client && npm test -- -t "test name"`

#### Auth Service

- `cd services/auth-service && npm run dev` - Start development server
- `cd services/auth-service && npm run test` - Run all tests
- `cd services/auth-service && npm run test:unit` - Run unit tests only
- `cd services/auth-service && npm run test:watch` - Run tests in watch mode
- Run single test: `cd services/auth-service && npm test -- src/__tests__/unit/services/auth.service.test.ts -t "test name"`

#### GraphQL Service

- `cd services/graphql-service && npm run dev` - Start development server
- `cd services/graphql-service && npm run test` - Run Jest tests
- Run single test: `cd services/graphql-service && npm test -- src/resolvers/UserResolver.test.ts -t "test name"`

## Code Style Guidelines

### General

- Use TypeScript strictly (strict: true in tsconfig)
- Follow existing patterns in the codebase
- Use functional components with React hooks
- Use TypeORM entities for database models
- Prefer async/await over callbacks

### Imports

- Use absolute imports when possible
- Group imports: node_modules first, then local imports
- Use index.ts files for clean exports
- No unused imports

### Naming Conventions

- PascalCase for components, classes, and types
- camelCase for variables, functions, and methods
- UPPER_SNAKE_CASE for constants
- Interfaces prefixed with "I" (e.g., IUser)
- Files named with PascalCase for components, camelCase otherwise

### Types

- Define interfaces for props and state
- Use TypeScript generics when appropriate
- Prefer type aliases for unions and primitives
- Use enums for fixed sets of values

### Error Handling

- Use try/catch blocks for async operations
- Create custom error classes for specific error types
- Log errors appropriately with winston in services
- Return proper HTTP status codes in Express routes

### Testing

- Unit tests for services and utilities
- Integration tests for API endpoints
- E2E tests for critical user flows
- Use descriptive test names that explain the behavior
