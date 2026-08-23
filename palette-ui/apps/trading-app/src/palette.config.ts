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
    baseUrl: '/api',
    timeout: 30000,
  },
  auth: {
    enabled: true,
  },
};
