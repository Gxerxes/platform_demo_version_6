import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { PalettePlatformConfig } from '@palette/platform-config';
import { useEventBus } from '@palette/platform-event';
import { ApiClient } from './ApiClient';

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
      new ApiClient({
        ...config.api,
        metadata: config.metadata,
        eventBus,
      }),
    [config.api, config.metadata, eventBus],
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
