import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import type { PaletteAppConfig } from '@palette/platform-config';
import { useNavigation } from '@palette/platform-navigation';
import { LAYOUT_CONSTANTS } from '../constants';

export interface AppHeaderProps {
  config: PaletteAppConfig;
}

export function AppHeader({ config }: AppHeaderProps) {
  const { toggleSidebar } = useNavigation();

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{
        height: LAYOUT_CONSTANTS.HEADER_HEIGHT,
        bgcolor: 'background.paper',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ minHeight: LAYOUT_CONSTANTS.HEADER_HEIGHT }}>
        <IconButton edge="start" onClick={toggleSidebar} aria-label="toggle sidebar">
          <MenuIcon />
        </IconButton>

        {config.logo && <Box sx={{ ml: 1, display: 'flex', alignItems: 'center' }}>{config.logo}</Box>}

        <Typography variant="h6" noWrap sx={{ ml: config.logo ? 1 : 2, fontWeight: 600 }}>
          {config.appName}
        </Typography>

        {config.version && (
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1, mt: 0.5 }}>
            v{config.version}
          </Typography>
        )}

        <Box sx={{ flexGrow: 1 }} />

        <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: 14 }}>
          PT
        </Avatar>
      </Toolbar>
    </AppBar>
  );
}
