import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import type { PaletteAppConfig } from '@palette/platform-config';
import type { PalettePlatformConfig } from '@palette/platform-config';
import type { NavItem } from '@palette/platform-navigation';
import { NavigationProvider } from '@palette/platform-navigation';
import { PermissionProvider } from '@palette/platform-security';
import { PalettePlatformProvider } from '@palette/platform-provider';
import type { ReactNode } from 'react';

export const mockAppConfig: PaletteAppConfig = {
  appName: 'Palette Storybook',
  version: '0.4.0',
  theme: { mode: 'light', primaryColor: '#1565c0' },
};

export const mockPlatformConfig: PalettePlatformConfig = {
  api: { baseURL: '/api', timeout: 30000 },
};

export const mockNavigation: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', path: '/', icon: <DashboardIcon /> },
  { id: 'settings', label: 'Settings', path: '/settings', icon: <SettingsIcon /> },
];

export const mockPermissions = ['dashboard:view', 'settings:view', 'admin:view'];

export function withNavigation(Story: () => ReactNode) {
  return (
    <NavigationProvider items={mockNavigation}>
      <Story />
    </NavigationProvider>
  );
}

export function withPermissions(permissions: string[] = mockPermissions) {
  return function Decorator(Story: () => ReactNode) {
    return (
      <PermissionProvider permissions={permissions}>
        <Story />
      </PermissionProvider>
    );
  };
}

export function withPlatform(Story: () => ReactNode) {
  return (
    <PalettePlatformProvider config={mockPlatformConfig} permissions={mockPermissions}>
      <Story />
    </PalettePlatformProvider>
  );
}
