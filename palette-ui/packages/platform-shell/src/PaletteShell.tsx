import { MainLayout, PaletteThemeProvider } from '@palette/platform-layout';
import type { PaletteAppConfig } from '@palette/platform-config';
import { NavigationProvider, type NavItem } from '@palette/platform-navigation';
import { UserMenu } from '@palette/platform-security';
import type { ReactNode } from 'react';

export interface PaletteShellProps {
  config: PaletteAppConfig;
  navigation: NavItem[];
  children: ReactNode;
  defaultSidebarCollapsed?: boolean;
  showUserMenu?: boolean;
}

export function PaletteShell({
  config,
  navigation,
  children,
  defaultSidebarCollapsed = false,
  showUserMenu = false,
}: PaletteShellProps) {
  return (
    <PaletteThemeProvider themeConfig={config.theme}>
      <NavigationProvider items={navigation} defaultCollapsed={defaultSidebarCollapsed}>
        <MainLayout
          config={config}
          navigation={navigation}
          headerActions={showUserMenu ? <UserMenu /> : undefined}
        >
          {children}
        </MainLayout>
      </NavigationProvider>
    </PaletteThemeProvider>
  );
}
