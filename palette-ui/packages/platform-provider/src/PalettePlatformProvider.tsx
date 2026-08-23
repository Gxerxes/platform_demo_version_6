import { useEffect, type ReactNode } from 'react';
import type { PalettePlatformConfig } from '@palette/platform-config';
import { ApiClientProvider } from '@palette/platform-api-client';
import { EventBusProvider, PaletteEvents, useEventBus } from '@palette/platform-event';
import { PermissionProvider, type Permission } from '@palette/platform-security';
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
      notification.showWarning('Session expired. Please login again.');
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

export function PalettePlatformProvider({
  config,
  permissions,
  children,
}: PalettePlatformProviderProps) {
  return (
    <EventBusProvider>
      <NotificationProvider>
        <PlatformProviders config={config} permissions={permissions}>
          {children}
        </PlatformProviders>
      </NotificationProvider>
    </EventBusProvider>
  );
}
