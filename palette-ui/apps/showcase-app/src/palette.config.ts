import type { PaletteAppConfig, PalettePlatformConfig } from '@palette/platform-sdk';

export const paletteConfig: PaletteAppConfig = {
  appName: 'Palette Showcase',
  version: '0.5.0',
  theme: {
    mode: 'light',
    primaryColor: '#1565c0',
  },
};

export const platformConfig: PalettePlatformConfig = {
  api: {
    baseURL: '/api',
    timeout: 30000,
  },
  auth: {
    enabled: true,
  },
};
