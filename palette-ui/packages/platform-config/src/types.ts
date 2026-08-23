import type { ReactNode } from 'react';

export type ThemeMode = 'light' | 'dark';

export interface PaletteThemeConfig {
  mode?: ThemeMode;
  primaryColor?: string;
}

export interface PaletteAppConfig {
  appName: string;
  logo?: ReactNode;
  version?: string;
  theme?: PaletteThemeConfig;
}
