import { Breadcrumbs, Link as MuiLink, Typography } from '@mui/material';
import { buildBreadcrumbs, type NavItem } from '@palette/platform-navigation';
import { Link, useLocation } from 'react-router-dom';

export interface AppBreadcrumbProps {
  navigation: NavItem[];
}

export function AppBreadcrumb({ navigation }: AppBreadcrumbProps) {
  const location = useLocation();
  const crumbs = buildBreadcrumbs(navigation, location.pathname);

  if (crumbs.length <= 1) {
    return null;
  }

  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      sx={{ px: 3, py: 1.5, bgcolor: 'background.paper' }}
    >
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;

        if (isLast || !crumb.path) {
          return (
            <Typography key={`${crumb.label}-${index}`} color="text.primary" fontSize={14}>
              {crumb.label}
            </Typography>
          );
        }

        return (
          <MuiLink
            key={`${crumb.label}-${index}`}
            component={Link}
            to={crumb.path}
            underline="hover"
            color="inherit"
            fontSize={14}
          >
            {crumb.label}
          </MuiLink>
        );
      })}
    </Breadcrumbs>
  );
}
