import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { QueryClientProvider as TanStackQueryClientProvider } from '@tanstack/react-query';
import type { PalettePlatformConfig } from '@palette/platform-config';
import { createQueryClient } from '../createQueryClient';

const PlatformQueryClientContext = createContext<ReturnType<typeof createQueryClient> | null>(
  null,
);

export interface PlatformQueryClientProviderProps {
  config: PalettePlatformConfig;
  children: ReactNode;
}

export function PlatformQueryClientProvider({
  config,
  children,
}: PlatformQueryClientProviderProps) {
  const queryClient = useMemo(() => createQueryClient(config.query), [config.query]);

  return (
    <PlatformQueryClientContext.Provider value={queryClient}>
      <TanStackQueryClientProvider client={queryClient}>{children}</TanStackQueryClientProvider>
    </PlatformQueryClientContext.Provider>
  );
}

export function usePlatformQueryClient(): ReturnType<typeof createQueryClient> {
  const context = useContext(PlatformQueryClientContext);
  if (!context) {
    throw new Error('usePlatformQueryClient must be used within PlatformQueryClientProvider');
  }
  return context;
}
