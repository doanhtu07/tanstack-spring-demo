# Tanstack Start + Spring Boot Demo

This repository is a working demo of a full-stack application:

- Tanstack Start + React Query
- Orval (OpenAPI code generator for TypeScript)
- Spring Boot + OpenAPI

## Roadmap

- [x] Complex translation system
- [x] Liquibase + PostgreSQL
- [ ] Memory optimization and profiling for Spring Boot application
- [ ] Cookie authentication: Either same-site or cross-site cookies (with proxy server on client)
- [ ] Handle accessibility
- [ ] Real-time support
  1. Way 1: Pure Socket + STOMP support
  2. Way 2: ElectricSQL sync engine or other similar open-source
  3. Way 3: Convex

## Running the application

Client (Tanstack Start):

```bash
cd tanstack-start-client-app
pnpm install
pnpm run dev
```

Server (Spring Boot):

- I prefer using IntelliJ to run the server
- But you can also use VSCode to run

## Features

Tanstack Start:

- React Query: Data fetching and caching
- Orval: Type-safe API client generation from OpenAPI spec
- MobX: State management for UI state
- CSS modules + Tailwind
- Theme provider with system theme support and FOUC prevention
- Translation support with react-i18next
- Test ID naming ([See doc](./docs/tanstack/test-ids.md))

Spring Boot:

- OpenAPI: API documentation and contract
- Security: Basic auth, CSRF protection for SPA, and CORS configuration
- Liquibase: Database migrations ([See doc](./docs/spring/liquibase.md))
- Testing: Unit tests with Surefire and integration tests with Failsafe (Bonus: Testcontainers for running PostgreSQL Docker containers during tests) ([See doc](./docs/spring/testing.md))
- Spring Audit: Auditing entity with @CreatedBy createdAt, @LastModifiedBy updatedAt, etc. ([See doc](./docs/spring/audit.md))

## Structure

`openapi-server`: Spring Boot application

- `src/main/java/com/tudope/openapi_server`: Java source code
- `src/main/resources/application.properties`: Application configuration
- `pom.xml`: Maven build file + dependencies

---

`tanstack-start-client-app`: Tanstack Start application

- `public`: Static assets
- `src/api/axios.ts`: Override Axios instance
- `src/components`: Pure React components without any data
- `src/orval`: Generated API client code thanks to Orval
- `src/providers/csrf-provider.tsx`: CSRF token provider making sure the app has initialized CSRF token
- `src/providers/store-provider.tsx`: MobX store provider
- `src/providers/theme-provider.tsx`: Theme provider to manage light/dark/system theme and prevent FOUC
- `src/routes/__root.tsx`: Root route of the app
- `src/routes/index.tsx`: Home route
- `src/stores`: MobX stores for UI state management
- `src/styles`: Global style + route-level styles
- `src/utils`: Utility functions for class names, tailwind, etc.
- `src/router.tsx`: Application router configuration
- `orval.config.ts`: Orval configuration file to generate API client from OpenAPI spec

## Issues

- For CSS file to not complain about "Unknown at rule" when using Tailwind directives in VSCode:
  - Install `Tailwind CSS IntelliSense` extension in VSCode
  - Add file association in VSCode settings -> `"css": "tailwindcss"`

- For IntelliJ TypeScript support to function properly, make sure you are not marking `node_modules` as "Excluded"
  - `node_modules` needs to be automatically marked by IntelliJ as "library root"
