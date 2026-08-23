import { jsx as _jsx } from "react/jsx-runtime";
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import { NavigationProvider } from '@palette/platform-navigation';
import { PermissionProvider } from '@palette/platform-security';
import { PalettePlatformProvider } from '@palette/platform-provider';
export const mockAppConfig = {
    appName: 'Palette Storybook',
    version: '0.4.0',
    theme: { mode: 'light', primaryColor: '#1565c0' },
};
export const mockPlatformConfig = {
    api: { baseUrl: '/api', timeout: 30000 },
};
export const mockNavigation = [
    { id: 'dashboard', label: 'Dashboard', path: '/', icon: _jsx(DashboardIcon, {}) },
    { id: 'settings', label: 'Settings', path: '/settings', icon: _jsx(SettingsIcon, {}) },
];
export const mockPermissions = ['dashboard:view', 'settings:view', 'admin:view'];
export function withNavigation(Story) {
    return (_jsx(NavigationProvider, { items: mockNavigation, children: _jsx(Story, {}) }));
}
export function withPermissions(permissions = mockPermissions) {
    return function Decorator(Story) {
        return (_jsx(PermissionProvider, { permissions: permissions, children: _jsx(Story, {}) }));
    };
}
export function withPlatform(Story) {
    return (_jsx(PalettePlatformProvider, { config: mockPlatformConfig, permissions: mockPermissions, children: _jsx(Story, {}) }));
}
//# sourceMappingURL=decorators.js.map