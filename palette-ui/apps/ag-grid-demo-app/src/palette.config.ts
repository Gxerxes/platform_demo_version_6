import type { PaletteAppConfig, PalettePlatformConfig } from '@palette/platform-sdk';

export const paletteConfig: PaletteAppConfig = {
  appName: 'AG Grid Demo',
  version: '1.0.0',
  theme: {
    mode: 'light',
    primaryColor: '#1565c0',
  },
};

export const platformConfig: PalettePlatformConfig = {
  api: {
    baseURL: '/api',
    timeout: 30_000,
    withCredentials: true,
  },
  query: {
    staleTime: 0,
    retry: 1,
    refetchOnWindowFocus: false,
  },
  auth: {
    enabled: true,
  },
  metadata: {
    applicationId: 'ag-grid-demo-app',
    clientVersion: '1.0.0',
  },
};
