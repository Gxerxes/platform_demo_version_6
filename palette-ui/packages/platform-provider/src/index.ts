export { ErrorBoundary } from './ErrorBoundary';
export type { ErrorBoundaryProps } from './ErrorBoundary';
export { NotificationProvider, useNotification } from './NotificationProvider';
export type {
  NotificationContextValue,
  NotificationOptions,
  NotificationProviderProps,
  NotificationSeverity,
} from './NotificationProvider';
export { PalettePlatformProvider } from './PalettePlatformProvider';
export type { PalettePlatformProviderProps } from './PalettePlatformProvider';
export { usePlatform } from './usePlatform';
export type { PlatformContextValue } from './usePlatform';

export const PLATFORM_PROVIDER_VERSION = '0.3.0';
