import type { PaletteAppConfig, PalettePlatformConfig } from '@palette/platform-sdk';

export const paletteConfig: PaletteAppConfig = {
  appName: 'Settlement App',
  version: '0.7.0',
  theme: {
    mode: 'light',
    primaryColor: '#1565c0',
  },
};

export const platformConfig: PalettePlatformConfig = {
  api: {
    baseUrl: '/api',
    timeout: 30000,
  },
  auth: {
    enabled: true,
  },
};
