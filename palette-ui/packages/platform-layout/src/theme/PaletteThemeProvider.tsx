import { CssBaseline, ThemeProvider } from '@mui/material';
import { useMemo, type ReactNode } from 'react';
import type { PaletteThemeConfig } from '@palette/platform-config';
import { createPaletteTheme } from './createPaletteTheme';

export interface PaletteThemeProviderProps {
  themeConfig?: PaletteThemeConfig;
  children: ReactNode;
}

export function PaletteThemeProvider({ themeConfig, children }: PaletteThemeProviderProps) {
  const theme = useMemo(() => createPaletteTheme(themeConfig), [themeConfig]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
