import { MainLayout, PaletteThemeProvider } from '@palette/platform-layout';
import type { PaletteAppConfig } from '@palette/platform-config';
import { NavigationProvider, type NavItem } from '@palette/platform-navigation';
import type { ReactNode } from 'react';

export interface PaletteShellProps {
  config: PaletteAppConfig;
  navigation: NavItem[];
  children: ReactNode;
  defaultSidebarCollapsed?: boolean;
}

export function PaletteShell({
  config,
  navigation,
  children,
  defaultSidebarCollapsed = false,
}: PaletteShellProps) {
  return (
    <PaletteThemeProvider themeConfig={config.theme}>
      <NavigationProvider items={navigation} defaultCollapsed={defaultSidebarCollapsed}>
        <MainLayout config={config} navigation={navigation}>
          {children}
        </MainLayout>
      </NavigationProvider>
    </PaletteThemeProvider>
  );
}
