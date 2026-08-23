# Changelog

All notable changes to the Palette Platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

### Added

- Enterprise BFF platform foundations
  - API versioning: `/palette/api/v1/**` (legacy `/api/**` preserved)
  - Request context: `X-Request-Id`, `X-Correlation-Id`, `X-Trace-Id` propagation
  - Standard error model with `requestId` field
  - `@PreAuthorize` permission checks via `AuthorizationService`
  - Optional JWT Bearer auth for machine/third-party consumers
  - Rate limiting (configurable, in-memory for MVP)
  - Audit logging (login, logout, auth failures, rate limits)
  - Downstream proxy resilience (timeouts, GET retry)
  - Redis session support (`palette.session.store=redis`)
  - Production config validator (fail-fast on prod profile)
  - Security headers filter
  - Graceful shutdown, liveness/readiness probes
  - Dockerfile for container deployment
  - Documentation: `docs/bff-enterprise-architecture.md`

- BFF OpenAPI / Swagger UI (`springdoc-openapi`)
  - Swagger UI: `/swagger-ui.html`
  - OpenAPI JSON: `/v3/api-docs`
  - API groups: Authentication, Demo Business API
  - Session cookie security scheme documentation

## [0.7.0] - 2026-08-23

### Added

- Phase 7: App Scaffolding (`create-palette-app`)
  - `pnpm create-app <name>` — scaffold new business apps in monorepo
  - `pnpm create palette-app <name>` — standard create command (after publish)
  - Default template: PaletteApp, auth, navigation, Dashboard + Settings
  - Auto port detection from existing apps (starts at 3002)
  - Monorepo mode (`workspace:*` + Vite aliases) and `--standalone` mode
  - Documentation: `docs/scaffold-guide.md`

### Fixed

- `createAuthApi` — undefined optional path overrides no longer break login redirect

## [0.6.0] - 2026-08-23

### Added

- Phase 6: Business Application Example (`apps/trading-app`)
  - Reference Implementation for Post-Trade trading workflows
  - Pages: Dashboard, Trades, New Trade (Form), Settlements, Reports, Admin
  - Feature-based API layer (`features/trades/api.ts`)
  - Permission-guarded navigation and UI (`trades:view`, `trades:create`, etc.)
  - `pnpm dev:trading` script (port 3001)
  - BFF mock APIs: `/api/dashboard/summary`, `POST /api/trades`, `/api/settlements`, `/api/reports/daily`
  - Documentation: `apps/trading-app/README.md`, `docs/example-app-guide.md`

## [0.5.0] - 2026-08-23

### Added

- Phase 5: UI + BFF Integration
  - `AuthProvider` / `useAuth` — BFF authentication state management
  - `AuthGuard` — route protection with sign-in prompt
  - `UserMenu` — header user info and logout
  - `AuthPermissionProvider` — permissions synced from BFF `/api/auth/user`
  - Session expiration auto-redirect to BFF login
  - `palette.config.ts` auth.enabled for BFF integration
  - TablePage loads live data via BFF `GET /api/trades`
  - Fixed Vite `/api` proxy to preserve path prefix

## [0.4.0] - 2026-08-23

### Added

- Phase 4: BFF MVP (`palette-bff`)
  - Spring Boot 3.4 + Spring Security OAuth2/OIDC
  - Auth API: login, logout, user, session, status
  - Token management with automatic refresh (OIDC mode)
  - API Proxy with Bearer token forwarding
  - Mock authentication profile for local development
  - Demo `/api/trades` endpoint in mock mode
  - Standardized error responses and request logging
  - Health check via Spring Actuator

### Added

- Phase 3: Storybook & Documentation
  - Storybook 8 with Vite builder and monorepo package aliases
  - Component stories: PageTitle, ContentCard, AppHeader, AppBreadcrumb, MainLayout, PermissionGuard, PaletteShell, PaletteApp
  - Developer Portal MDX docs: Introduction, Getting Started, Best Practices, Do & Don't, Migration Guide, API Reference
  - `pnpm storybook` and `pnpm storybook:build` scripts
  - CI pipeline builds Storybook static site

## [0.3.0] - 2026-08-23

### Added

- Phase 2: UI Platform SDK
  - `@palette/platform-provider` — PalettePlatformProvider, Notification, ErrorBoundary
  - `@palette/platform-api-client` — ApiClient with interceptors and error handling
  - `@palette/platform-event` — EventBus for application-wide communication
  - `@palette/platform-security` — Permission system, PermissionGuard, nav filtering
  - `@palette/platform-sdk` — unified SDK entry with `PaletteApp` component
  - `usePlatform`, `useApiClient`, `useEventBus`, `useNotification`, `usePermission` hooks
  - Showcase SDK Demo and Admin permission pages

## [0.2.0] - 2026-08-23

### Added

- Phase 1: UI Core
  - `@palette/platform-shell` — `<PaletteShell>` application container
  - `@palette/platform-layout` — Header, Sidebar, Breadcrumb, MainLayout, Theme
  - `@palette/platform-navigation` — NavItem types, NavigationProvider, breadcrumb utils
  - `@palette/platform-config` — PaletteAppConfig types
  - `@palette/ui-common` — PageTitle, ContentCard components
  - MUI theme system with configurable primary color and light/dark mode
  - React Router integration in showcase-app
  - Showcase pages: Dashboard, Table, Settings

## [0.1.0] - 2026-08-23

### Added

- Phase 0: Project Foundation
  - pnpm Monorepo workspace with 10 packages + showcase-app
  - TypeScript strict mode configuration
  - Vite build tooling for showcase-app
  - ESLint + Prettier code quality tooling
  - Vitest test runner setup
  - GitLab CI/CD pipeline (lint, build, test)
  - Enterprise standards documentation (branching, commits, versioning)
  - Development guide and README
