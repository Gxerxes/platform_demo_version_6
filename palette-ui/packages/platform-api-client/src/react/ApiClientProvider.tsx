import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { PalettePlatformConfig } from '@palette/platform-config';
import { useEventBus } from '@palette/platform-event';
import { createApiClient } from '../client/createApiClient';
import type { ApiClient } from '../client/ApiClient';

const ApiClientContext = createContext<ApiClient | null>(null);

export interface ApiClientProviderProps {
  /** Resolved platform configuration from PalettePlatformProvider */
  config: PalettePlatformConfig;
  children: ReactNode;
}

export function ApiClientProvider({ config, children }: ApiClientProviderProps) {
  const eventBus = useEventBus();

  const client = useMemo(
    () =>
      createApiClient({
        baseUrl: config.api.baseUrl,
        timeout: config.api.timeout,
        withCredentials: config.api.withCredentials,
        headers: config.api.headers,
        metadata: config.metadata,
        auth: {
          enabled: config.auth?.enabled ?? true,
        },
        eventBus,
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
