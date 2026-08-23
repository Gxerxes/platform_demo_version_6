import { Alert, Chip, Stack, Typography } from '@mui/material';
import { ContentCard, PageTitle, useAuth } from '@palette/platform-sdk';

export function DashboardPage() {
  const { user, isAuthenticated } = useAuth();

  return (
    <>
      <PageTitle
        title="Dashboard"
        subtitle="Welcome to Settlement App — built on Palette Platform"
      />

      <Stack spacing={3}>
        <ContentCard>
          <Typography variant="h6" gutterBottom>
            Getting Started
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            This application was scaffolded with <code>create-palette-app</code>. Palette
            provides Shell, Authentication, Navigation, Permissions, and API Client out of the
            box.
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip
              label={isAuthenticated ? `Signed in as ${user?.displayName}` : 'Not authenticated'}
              color={isAuthenticated ? 'success' : 'warning'}
            />
            <Chip label="Palette SDK" color="primary" variant="outlined" />
          </Stack>
        </ContentCard>

        {user && (
          <ContentCard>
            <Typography variant="h6" gutterBottom>
              Your Permissions
            </Typography>
            <Typography variant="body2">{user.permissions.join(', ')}</Typography>
          </ContentCard>
        )}

        <Alert severity="info">
          Add business pages under <code>src/pages/</code> and API modules under{' '}
          <code>src/features/</code>. See the Trading App reference implementation for a complete
          example.
        </Alert>
      </Stack>
    </>
  );
}
