import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {
  Collapse,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';
import type { NavItem } from '@palette/platform-navigation';
import { findActiveNavItem, useNavigation } from '@palette/platform-navigation';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LAYOUT_CONSTANTS } from '../constants';

export interface AppSidebarProps {
  navigation: NavItem[];
}

export function AppSidebar({ navigation }: AppSidebarProps) {
  const { sidebarCollapsed } = useNavigation();
  const width = sidebarCollapsed
    ? LAYOUT_CONSTANTS.SIDEBAR_COLLAPSED_WIDTH
    : LAYOUT_CONSTANTS.SIDEBAR_WIDTH;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width,
          boxSizing: 'border-box',
          top: LAYOUT_CONSTANTS.HEADER_HEIGHT,
          height: `calc(100% - ${LAYOUT_CONSTANTS.HEADER_HEIGHT}px)`,
          overflowX: 'hidden',
          transition: (theme) =>
            theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
        },
      }}
    >
      <List component="nav" sx={{ pt: 1 }}>
        {navigation
          .filter((item) => !item.hidden)
          .map((item) => (
            <SidebarNavItem key={item.id} item={item} collapsed={sidebarCollapsed} depth={0} />
          ))}
      </List>
    </Drawer>
  );
}

interface SidebarNavItemProps {
  item: NavItem;
  collapsed: boolean;
  depth: number;
}

function SidebarNavItem({ item, collapsed, depth }: SidebarNavItemProps) {
  const location = useLocation();
  const activeItem = findActiveNavItem([item], location.pathname);
  const isActive = Boolean(activeItem);
  const hasChildren = Boolean(item.children?.length);
  const [open, setOpen] = useState(isActive);

  if (hasChildren) {
    const button = (
      <ListItemButton
        onClick={() => setOpen((prev) => !prev)}
        sx={{ pl: collapsed ? 1.5 : 2 + depth * 2, justifyContent: collapsed ? 'center' : 'flex-start' }}
        selected={isActive}
      >
        {item.icon && (
          <ListItemIcon sx={{ minWidth: collapsed ? 0 : 40, justifyContent: 'center' }}>
            {item.icon}
          </ListItemIcon>
        )}
        {!collapsed && (
          <>
            <ListItemText primary={item.label} />
            {open ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
          </>
        )}
      </ListItemButton>
    );

    return (
      <>
        {collapsed ? <Tooltip title={item.label} placement="right">{button}</Tooltip> : button}
        {!collapsed && (
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children
                ?.filter((child) => !child.hidden)
                .map((child) => (
                  <SidebarNavItem key={child.id} item={child} collapsed={collapsed} depth={depth + 1} />
                ))}
            </List>
          </Collapse>
        )}
      </>
    );
  }

  const linkButton = (
    <ListItemButton
      component={item.path ? Link : 'div'}
      to={item.path ?? '#'}
      selected={isActive}
      sx={{ pl: collapsed ? 1.5 : 2 + depth * 2, justifyContent: collapsed ? 'center' : 'flex-start' }}
    >
      {item.icon && (
        <ListItemIcon sx={{ minWidth: collapsed ? 0 : 40, justifyContent: 'center' }}>
          {item.icon}
        </ListItemIcon>
      )}
      {!collapsed && <ListItemText primary={item.label} />}
    </ListItemButton>
  );

  return collapsed ? (
    <Tooltip title={item.label} placement="right">
      {linkButton}
    </Tooltip>
  ) : (
    linkButton
  );
}
