import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { PalettePlatformConfig } from '@palette/platform-config';
import { PaletteEvents, useEventBus } from '@palette/platform-event';
import { createApiClient } from '../client/createApiClient';
import type { ApiClient } from '../client/ApiClient';

const ApiClientContext = createContext<ApiClient | null>(null);

export interface ApiClientProviderProps {
  config: PalettePlatformConfig;
  children: ReactNode;
}

export function ApiClientProvider({ config, children }: ApiClientProviderProps) {
  const eventBus = useEventBus();

  const client = useMemo(
    () =>
      createApiClient({
        baseURL: config.api.baseURL,
        timeout: config.api.timeout,
        withCredentials: config.api.withCredentials,
        headers: config.api.headers,
        metadata: config.metadata,
        auth: { enabled: config.auth?.enabled ?? true },
        hooks: {
          beforeRequest: (ctx) => {
            eventBus.emit(PaletteEvents.API_REQUEST, {
              method: ctx.method,
              url: ctx.url,
            });
          },
          afterResponse: (ctx) => {
            eventBus.emit(PaletteEvents.API_RESPONSE, {
              method: ctx.method,
              url: ctx.url,
              status: ctx.status,
            });
          },
          onError: (error) => {
            if (error.status === 401) {
              eventBus.emit(PaletteEvents.AUTH_EXPIRED);
            }
            eventBus.emit(PaletteEvents.ERROR, error);
          },
        },
      }),
    [config.api, config.auth?.enabled, config.metadata, eventBus],
  );

  return <ApiClientContext.Provider value={client}>{children}</ApiClientContext.Provider>;
}

export function useApiClient(): ApiClient {
  const context = useContext(ApiClientContext);
  if (!context) {
    throw new Error('useApiClient must be used within ApiClientProvider');
  }
  return context;
}
