import { useCallback, useEffect, useMemo, type ReactNode } from 'react';
import {
  defaultPlatformConfig,
  resolvePlatformConfig,
  type PalettePlatformConfig,
} from '@palette/platform-config';
import { ApiClientProvider, PlatformQueryClientProvider } from '@palette/platform-api-client';
import { EventBusProvider, PaletteEvents, useEventBus } from '@palette/platform-event';
import {
  AuthPermissionProvider,
  AuthProvider,
  PermissionProvider,
  type Permission,
} from '@palette/platform-security';
import { ErrorBoundary } from './ErrorBoundary';
import { NotificationProvider, useNotification } from './NotificationProvider';

export interface PalettePlatformProviderProps {
  config: PalettePlatformConfig;
  permissions?: Permission[];
  children: ReactNode;
}

function GlobalErrorHandler({ children }: { children: ReactNode }) {
  const notification = useNotification();
  const eventBus = useEventBus();

  useEffect(() => {
    const unsubscribeError = eventBus.on(PaletteEvents.ERROR, (error: unknown) => {
      if (error instanceof Error) {
        notification.showError(error.message);
      }
    });

    const unsubscribeAuth = eventBus.on(PaletteEvents.AUTH_EXPIRED, () => {
      notification.showWarning('Session expired. Please sign in again.');
    });

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason instanceof Error) {
        notification.showError(event.reason.message);
      }
    };

    window.addEventListener('unhandledrejection', onUnhandledRejection);

    return () => {
      unsubscribeError();
      unsubscribeAuth();
      window.removeEventListener('unhandledrejection', onUnhandledRejection);
    };
  }, [eventBus, notification]);

  return <>{children}</>;
}

function PlatformProviders({
  config,
  permissions = [],
  children,
}: PalettePlatformProviderProps) {
  const notification = useNotification();

  return (
    <PermissionProvider permissions={permissions}>
      <ApiClientProvider config={config}>
        <ErrorBoundary notification={notification}>
          <GlobalErrorHandler>{children}</GlobalErrorHandler>
        </ErrorBoundary>
      </ApiClientProvider>
    </PermissionProvider>
  );
}

function AuthPlatformProviders({
  config,
  permissions = [],
  children,
}: PalettePlatformProviderProps) {
  const notification = useNotification();

  const handleSessionExpired = useCallback(() => {
    const loginPath = config.auth?.loginPath ?? '/auth/login';
    const baseUrl = config.api.baseUrl.replace(/\/$/, '');
    window.location.href = `${baseUrl}${loginPath.startsWith('/') ? loginPath : `/${loginPath}`}`;
  }, [config]);

  return (
    <AuthProvider config={config} onSessionExpired={handleSessionExpired}>
      <AuthPermissionProvider fallbackPermissions={permissions}>
        <ApiClientProvider config={config}>
          <ErrorBoundary notification={notification}>
            <GlobalErrorHandler>{children}</GlobalErrorHandler>
          </ErrorBoundary>
        </ApiClientProvider>
      </AuthPermissionProvider>
    </AuthProvider>
  );
}

export function PalettePlatformProvider({
  config,
  permissions,
  children,
}: PalettePlatformProviderProps) {
  const authEnabled = config.auth?.enabled ?? false;
  const resolvedConfig = useMemo(
    () => resolvePlatformConfig(defaultPlatformConfig, undefined, config),
    [config],
  );

  return (
    <EventBusProvider>
      <NotificationProvider>
        <PlatformQueryClientProvider config={resolvedConfig}>
          {authEnabled ? (
            <AuthPlatformProviders config={resolvedConfig} permissions={permissions}>
              {children}
            </AuthPlatformProviders>
          ) : (
            <PlatformProviders config={resolvedConfig} permissions={permissions}>
              {children}
            </PlatformProviders>
          )}
        </PlatformQueryClientProvider>
      </NotificationProvider>
    </EventBusProvider>
  );
}
