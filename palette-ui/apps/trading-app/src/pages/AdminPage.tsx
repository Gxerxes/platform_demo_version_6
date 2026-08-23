import { Alert, Typography } from '@mui/material';
import { ContentCard, PageTitle, PermissionGuard } from '@palette/platform-sdk';

export function AdminPage() {
  return (
    <PermissionGuard
      permission="admin:view"
      fallback={
        <Alert severity="warning">
          Admin area requires the <code>admin:view</code> permission.
        </Alert>
      }
    >
      <PageTitle
        title="Admin"
        subtitle="Protected area — demonstrates PermissionGuard for business routes"
      />

      <ContentCard>
        <Typography variant="body1" gutterBottom>
          This page is only visible to users with the <code>admin:view</code> permission.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          In production, admin functions would include user management, role assignment, and
          system configuration. Navigation items are also filtered by permission via Palette Shell.
        </Typography>
      </ContentCard>
    </PermissionGuard>
  );
}
