import { Box } from '@mui/material';
import type { PaletteAppConfig } from '@palette/platform-config';
import type { NavItem } from '@palette/platform-navigation';
import type { ReactNode } from 'react';
import { AppBreadcrumb } from './AppBreadcrumb';
import { AppHeader } from './AppHeader';
import { AppSidebar } from './AppSidebar';
import { PageContent } from './PageContent';

export interface MainLayoutProps {
  config: PaletteAppConfig;
  navigation: NavItem[];
  children: ReactNode;
  headerActions?: ReactNode;
}

export function MainLayout({ config, navigation, children, headerActions }: MainLayoutProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppHeader config={config} headerActions={headerActions} />
      <Box sx={{ display: 'flex', flex: 1 }}>
        <AppSidebar navigation={navigation} />
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
          <AppBreadcrumb navigation={navigation} />
          <PageContent>{children}</PageContent>
        </Box>
      </Box>
    </Box>
  );
}
