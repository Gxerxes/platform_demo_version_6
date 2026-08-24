import type { PaletteApiConfig, PalettePlatformConfig, PaletteQueryConfig } from './platform';

export const defaultApiConfig: Required<Pick<PaletteApiConfig, 'timeout' | 'withCredentials'>> = {
  timeout: 30_000,
  withCredentials: true,
};

export const defaultQueryConfig: Required<PaletteQueryConfig> = {
  staleTime: 30_000,
  gcTime: 5 * 60_000,
  retry: 1,
  refetchOnWindowFocus: false,
  refetchOnReconnect: true,
};

export const defaultPlatformConfig: PalettePlatformConfig = {
  api: {
    baseURL: '/api',
    ...defaultApiConfig,
  },
  query: {
    ...defaultQueryConfig,
  },
};
