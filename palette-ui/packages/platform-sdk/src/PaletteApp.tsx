import { useMemo, type ReactNode } from 'react';
import type { PaletteAppConfig, PalettePlatformConfig } from '@palette/platform-config';
import {
  AuthGuard,
  filterNavigationByPermission,
  useAuth,
  usePermission,
  type Permission,
} from '@palette/platform-security';
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

function AuthenticatedApp({
  config,
  navigation,
  children,
  defaultSidebarCollapsed,
}: Omit<PaletteAppProps, 'permissions' | 'platformConfig'>) {
  const { isLoading } = useAuth();
  const { hasPermission } = usePermission();

  const filteredNavigation = useMemo(() => {
    if (isLoading) return navigation;
    return filterNavigationByPermission(navigation, hasPermission);
  }, [navigation, hasPermission, isLoading]);

  return (
    <PaletteShell
      config={config}
      navigation={filteredNavigation}
      defaultSidebarCollapsed={defaultSidebarCollapsed}
      showUserMenu
    >
      <AuthGuard>{children}</AuthGuard>
    </PaletteShell>
  );
}

function StandardApp({
  config,
  navigation,
  permissions = [],
  children,
  defaultSidebarCollapsed,
}: Omit<PaletteAppProps, 'platformConfig'>) {
  const filteredNavigation = useMemo(
    () => filterNavigationByPermission(navigation, (p) => permissions.includes(p)),
    [navigation, permissions],
  );

  return (
    <PaletteShell
      config={config}
      navigation={filteredNavigation}
      defaultSidebarCollapsed={defaultSidebarCollapsed}
    >
      {children}
    </PaletteShell>
  );
}

export function PaletteApp({
  config,
  platformConfig,
  navigation,
  permissions,
  children,
  defaultSidebarCollapsed,
}: PaletteAppProps) {
  const authEnabled = platformConfig.auth?.enabled ?? false;

  return (
    <PalettePlatformProvider config={platformConfig} permissions={permissions}>
      {authEnabled ? (
        <AuthenticatedApp
          config={config}
          navigation={navigation}
          defaultSidebarCollapsed={defaultSidebarCollapsed}
        >
          {children}
        </AuthenticatedApp>
      ) : (
        <StandardApp
          config={config}
          navigation={navigation}
          permissions={permissions}
          defaultSidebarCollapsed={defaultSidebarCollapsed}
        >
          {children}
        </StandardApp>
      )}
    </PalettePlatformProvider>
  );
}
