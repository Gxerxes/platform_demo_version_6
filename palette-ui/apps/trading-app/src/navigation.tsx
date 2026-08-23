import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PaymentsIcon from '@mui/icons-material/Payments';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
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
    id: 'trades',
    label: 'Trades',
    icon: <SwapHorizIcon />,
    permission: 'trades:view',
    children: [
      {
        id: 'trades-list',
        label: 'Trade List',
        path: '/trades',
        icon: <SwapHorizIcon />,
        permission: 'trades:view',
      },
      {
        id: 'trades-new',
        label: 'New Trade',
        path: '/trades/new',
        icon: <SwapHorizIcon />,
        permission: 'trades:create',
      },
    ],
  },
  {
    id: 'settlements',
    label: 'Settlements',
    path: '/settlements',
    icon: <PaymentsIcon />,
    permission: 'settlements:view',
  },
  {
    id: 'reports',
    label: 'Reports',
    path: '/reports',
    icon: <AssessmentIcon />,
    permission: 'reports:view',
  },
  {
    id: 'admin',
    label: 'Admin',
    path: '/admin',
    icon: <AdminPanelSettingsIcon />,
    permission: 'admin:view',
  },
];
