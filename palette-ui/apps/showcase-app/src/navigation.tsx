import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExtensionIcon from '@mui/icons-material/Extension';
import SdkIcon from '@mui/icons-material/IntegrationInstructions';
import SettingsIcon from '@mui/icons-material/Settings';
import TableChartIcon from '@mui/icons-material/TableChart';
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
    id: 'sdk',
    label: 'SDK Demo',
    path: '/sdk',
    icon: <SdkIcon />,
    permission: 'components:view',
  },
  {
    id: 'components',
    label: 'Components',
    icon: <ExtensionIcon />,
    permission: 'components:view',
    children: [
      {
        id: 'components-table',
        label: 'Table',
        path: '/components/table',
        icon: <TableChartIcon />,
        permission: 'table:view',
      },
    ],
  },
  {
    id: 'admin',
    label: 'Admin',
    path: '/admin',
    icon: <AdminPanelSettingsIcon />,
    permission: 'admin:view',
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: <SettingsIcon />,
    permission: 'settings:view',
  },
];
