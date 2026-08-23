export type {
  PaletteApiConfig,
  PaletteAppMetadata,
  PaletteAuthConfig,
  PalettePlatformConfig,
  PaletteQueryConfig,
} from './platform';
export type { PaletteAppConfig, PaletteThemeConfig, ThemeMode } from './types';

export { defaultApiConfig, defaultPlatformConfig, defaultQueryConfig } from './defaults';
export { resolvePlatformConfig } from './resolve';

export const PLATFORM_CONFIG_VERSION = '0.6.0';
