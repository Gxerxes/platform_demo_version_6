import { useMemo, type ReactNode } from 'react';
import type { PaletteAppConfig, PalettePlatformConfig } from '@palette/platform-config';
import { filterNavigationByPermission, type Permission } from '@palette/platform-security';
import type { NavItem } from '@palette/platform-navigation';
import { PalettePlatformProvider } from '@palette/platform-provider';
import { PaletteShell } from '@palette/platform-shell';

export interface PaletteAppProps {
  config: PaletteAppConfig;
  platformConfig: PalettePlatformConfig;
  navigation: NavItem[];
  permissions?: Permission[];
  children: ReactNode;
  defaultSidebarCollapsed?: boolean;
}

export function PaletteApp({
  config,
  platformConfig,
  navigation,
  permissions = [],
  children,
  defaultSidebarCollapsed,
}: PaletteAppProps) {
  const filteredNavigation = useMemo(
    () => filterNavigationByPermission(navigation, (p) => permissions.includes(p)),
    [navigation, permissions],
  );

  return (
    <PalettePlatformProvider config={platformConfig} permissions={permissions}>
      <PaletteShell
        config={config}
        navigation={filteredNavigation}
        defaultSidebarCollapsed={defaultSidebarCollapsed}
      >
        {children}
      </PaletteShell>
    </PalettePlatformProvider>
  );
}
