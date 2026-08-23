// ── Application Shell ──────────────────────────────────────────
export { PaletteShell } from '@palette/platform-shell';
export type { PaletteShellProps } from '@palette/platform-shell';

// ── Platform Provider ────────────────────────────────────────
export {
  ErrorBoundary,
  NotificationProvider,
  PalettePlatformProvider,
  useNotification,
  usePlatform,
} from '@palette/platform-provider';
export type {
  ErrorBoundaryProps,
  NotificationContextValue,
  NotificationOptions,
  NotificationProviderProps,
  NotificationSeverity,
  PalettePlatformProviderProps,
  PlatformContextValue,
} from '@palette/platform-provider';

// ── Configuration ────────────────────────────────────────────
export type {
  PaletteApiConfig,
  PaletteAppConfig,
  PalettePlatformConfig,
  PaletteThemeConfig,
  ThemeMode,
} from '@palette/platform-config';

// ── Navigation ───────────────────────────────────────────────
export {
  NavigationProvider,
  buildBreadcrumbs,
  findActiveNavItem,
  useNavigation,
} from '@palette/platform-navigation';
export type {
  BreadcrumbItem,
  NavItem,
  NavigationContextValue,
  NavigationProviderProps,
} from '@palette/platform-navigation';

// ── Layout ───────────────────────────────────────────────────
export {
  AppBreadcrumb,
  AppHeader,
  AppSidebar,
  LAYOUT_CONSTANTS,
  MainLayout,
  PageContent,
  PaletteThemeProvider,
  createPaletteTheme,
} from '@palette/platform-layout';
export type {
  AppBreadcrumbProps,
  AppHeaderProps,
  AppSidebarProps,
  MainLayoutProps,
  PageContentProps,
  PaletteThemeProviderProps,
} from '@palette/platform-layout';

// ── Security / Permission ────────────────────────────────────
export {
  PermissionGuard,
  PermissionProvider,
  createPermissionChecker,
  filterNavigationByPermission,
  usePermission,
} from '@palette/platform-security';
export type {
  Permission,
  PermissionContextValue,
  PermissionGuardProps,
  PermissionProviderProps,
} from '@palette/platform-security';

// ── API Client ───────────────────────────────────────────────
export {
  ApiClient,
  ApiClientProvider,
  ApiError,
  isPaletteError,
  normalizeError,
  useApiClient,
} from '@palette/platform-api-client';
export type {
  ApiClientConfig,
  ApiClientProviderProps,
  HttpMethod,
  PaletteError,
  RequestOptions,
} from '@palette/platform-api-client';

// ── Event Bus ────────────────────────────────────────────────
export {
  EventBus,
  EventBusProvider,
  PaletteEvents,
  globalEventBus,
  useEventBus,
} from '@palette/platform-event';
export type { EventBusProviderProps, PaletteEventName } from '@palette/platform-event';

// ── UI Common ────────────────────────────────────────────────
export { ContentCard, PageTitle } from '@palette/ui-common';
export type { ContentCardProps, PageTitleProps } from '@palette/ui-common';

// ── SDK Entry ────────────────────────────────────────────────
export { PaletteApp } from './PaletteApp';
export type { PaletteAppProps } from './PaletteApp';

export const PLATFORM_SDK_VERSION = '0.3.0';
