import { QueryClient } from '@tanstack/react-query';
import { defaultQueryConfig, type PaletteQueryConfig } from '@palette/platform-config';

export function createQueryClient(config?: PaletteQueryConfig): QueryClient {
  const queryConfig = {
    ...defaultQueryConfig,
    ...config,
  };

  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: queryConfig.staleTime,
        gcTime: queryConfig.gcTime,
        retry: queryConfig.retry,
        refetchOnWindowFocus: queryConfig.refetchOnWindowFocus,
        refetchOnReconnect: queryConfig.refetchOnReconnect,
      },
    },
  });
}
