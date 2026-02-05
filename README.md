# Tanstack Start + Spring Boot Demo

This repository is a working demo of a full-stack application:

- Tanstack Start + React Query
- Orval (OpenAPI code generator for TypeScript)
- Spring Boot + OpenAPI

## Roadmap

- [ ] Liquibase + PostgreSQL
- [ ] Cookie authentication: Either same-site or cross-site cookies (with proxy server on client)
- [ ] Socket + STOMP support

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
- CSS @scope + Tailwind

Spring Boot:

- OpenAPI: API documentation and contract
- Security: Basic auth, CSRF protection for SPA, and CORS configuration

## Structure

`openapi-server`: Spring Boot application

- `src/main/java/com/tudope/openapi_server`: Java source code
- `src/main/resources/application.properties`: Application configuration
- `pom.xml`: Maven build file + dependencies

---

`tanstack-start-client-app`: Tanstack Start application

- `public`: Static assets
- `src/api/axios.ts`: Override Axios instance
- `src/orval`: Generated API client code thanks to Orval
- `src/providers/CsrfProvider.tsx`: CSRF token provider making sure the app has initialized CSRF token
- `src/routes/__root.tsx`: Root route of the app
- `src/routes/index.tsx`: Main application route
- `src/router.tsx`: Application router configuration
- `orval.config.ts`: Orval configuration file to generate API client from OpenAPI spec

## Issues

- Tanstack Start currently has an issue with CSS Module flash of unstyled content (FOUC)
  - They are actively working on a fix directly in Vite
  - Right now, I'm practicing a workaround using CSS native directive `@scope` together with naming convention to avoid CSS styling conflicts

---

- For CSS file to not complain about "Unknown at rule" when using Tailwind directives in VSCode:
  - Install `Tailwind CSS IntelliSense` extension in VSCode
  - Add file association in VSCode settings -> `"css": "tailwindcss"`
