import DashboardIcon from '@mui/icons-material/Dashboard';
import ExtensionIcon from '@mui/icons-material/Extension';
import SettingsIcon from '@mui/icons-material/Settings';
import TableChartIcon from '@mui/icons-material/TableChart';
import type { NavItem } from '@palette/platform-navigation';

export const navigation: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/',
    icon: <DashboardIcon />,
  },
  {
    id: 'components',
    label: 'Components',
    icon: <ExtensionIcon />,
    children: [
      {
        id: 'components-table',
        label: 'Table',
        path: '/components/table',
        icon: <TableChartIcon />,
      },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: <SettingsIcon />,
  },
];
