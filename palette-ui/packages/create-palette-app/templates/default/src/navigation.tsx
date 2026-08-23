import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import type { NavItem } from '@palette/platform-sdk';

export const navigation: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/',
    icon: <DashboardIcon />,
    permission: 'dashboard:view',
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: <SettingsIcon />,
    permission: 'settings:view',
  },
];
