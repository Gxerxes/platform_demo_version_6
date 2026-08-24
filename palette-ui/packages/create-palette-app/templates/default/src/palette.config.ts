import type { PaletteAppConfig, PalettePlatformConfig } from '@palette/platform-sdk';

export const paletteConfig: PaletteAppConfig = {
  appName: '__APP_NAME__',
  version: '__VERSION__',
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
    staleTime: 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  },
  auth: {
    enabled: true,
  },
  metadata: {
    applicationId: '__APP_NAME__',
    clientVersion: '__VERSION__',
  },
};
