import { Alert, Chip, Stack, Typography } from '@mui/material';
import { ContentCard, PageTitle, PLATFORM_SDK_VERSION, useAuth } from '@palette/platform-sdk';

export function DashboardPage() {
  const { user, session, isAuthenticated } = useAuth();

  return (
    <>
      <PageTitle
        title="Dashboard"
        subtitle="Palette Enterprise Platform — Phase 5 UI + BFF Integration"
      />

      <Stack spacing={3}>
        <ContentCard>
          <Typography variant="h6" gutterBottom>
            Platform Status
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip label={`@palette/platform-sdk v${PLATFORM_SDK_VERSION}`} color="primary" />
            <Chip label="Phase 5 — BFF Integrated" color="success" />
            <Chip
              label={isAuthenticated ? 'Authenticated via BFF' : 'Not authenticated'}
              color={isAuthenticated ? 'success' : 'warning'}
            />
          </Stack>
        </ContentCard>

        {user && (
          <ContentCard>
            <Typography variant="h6" gutterBottom>
              Current User (from BFF)
            </Typography>
            <Typography variant="body2">ID: {user.userId}</Typography>
            <Typography variant="body2">Name: {user.displayName}</Typography>
            <Typography variant="body2">Email: {user.email}</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Permissions: {user.permissions.join(', ')}
            </Typography>
            {session?.expiresAt && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Session expires at: {new Date(session.expiresAt).toLocaleString()}
              </Alert>
            )}
          </ContentCard>
        )}

        <ContentCard>
          <Typography variant="h6" gutterBottom>
            Phase 5 Deliverables
          </Typography>
          <Stack component="ul" spacing={1} sx={{ pl: 2, m: 0 }}>
            <Typography component="li" variant="body2">
              AuthProvider — BFF authentication state management
            </Typography>
            <Typography component="li" variant="body2">
              Permissions synced from BFF /api/auth/user
            </Typography>
            <Typography component="li" variant="body2">
              AuthGuard — route protection with login redirect
            </Typography>
            <Typography component="li" variant="body2">
              UserMenu — header user info and logout
            </Typography>
            <Typography component="li" variant="body2">
              Session expiration handling with auto-redirect
            </Typography>
            <Typography component="li" variant="body2">
              API calls through BFF proxy with session cookies
            </Typography>
          </Stack>
        </ContentCard>
      </Stack>
    </>
  );
}
