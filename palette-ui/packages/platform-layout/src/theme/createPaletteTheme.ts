import { createTheme, type Theme } from '@mui/material/styles';
import type { PaletteThemeConfig } from '@palette/platform-config';

const DEFAULT_PRIMARY = '#1565c0';

export function createPaletteTheme(themeConfig?: PaletteThemeConfig): Theme {
  const mode = themeConfig?.mode ?? 'light';
  const primaryColor = themeConfig?.primaryColor ?? DEFAULT_PRIMARY;

  return createTheme({
    palette: {
      mode,
      primary: {
        main: primaryColor,
      },
      background: {
        default: mode === 'light' ? '#f5f7fa' : '#121212',
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      },
    },
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      h4: { fontWeight: 600 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            borderBottom: '1px solid',
            borderColor: mode === 'light' ? '#e2e8f0' : '#333',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: '1px solid',
            borderColor: mode === 'light' ? '#e2e8f0' : '#333',
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            margin: '2px 8px',
          },
        },
      },
    },
  });
}
