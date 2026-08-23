# Changelog

All notable changes to the Palette Platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

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
