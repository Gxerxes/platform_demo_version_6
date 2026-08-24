import type { PaletteAppConfig, PalettePlatformConfig } from '@palette/platform-sdk';

export const paletteConfig: PaletteAppConfig = {
  appName: 'Palette Trading',
  version: '0.6.0',
  theme: {
    mode: 'light',
    primaryColor: '#2e7d32',
  },
};

export const platformConfig: PalettePlatformConfig = {
  api: {
    baseURL: '/api',
    timeout: 30_000,
    withCredentials: true,
  },
  query: {
    staleTime: 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  },
  auth: {
    enabled: true,
  },
  metadata: {
    applicationId: 'trading-app',
    clientVersion: '0.6.0',
  },
};
