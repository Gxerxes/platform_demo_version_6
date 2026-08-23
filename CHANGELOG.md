# Changelog

All notable changes to the Palette Platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

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
