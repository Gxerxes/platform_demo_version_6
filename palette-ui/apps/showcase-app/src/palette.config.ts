import type { PaletteAppConfig, PalettePlatformConfig } from '@palette/platform-sdk';

export const paletteConfig: PaletteAppConfig = {
  appName: 'Palette Showcase',
  version: '0.3.0',
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
};
