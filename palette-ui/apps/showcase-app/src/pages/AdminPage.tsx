import { Typography } from '@mui/material';
import { ContentCard, PageTitle, PermissionGuard } from '@palette/platform-sdk';

export function AdminPage() {
  return (
    <PermissionGuard
      permission="admin:view"
      fallback={
        <ContentCard>
          <Typography color="error">You do not have permission to view this page.</Typography>
        </ContentCard>
      }
    >
      <PageTitle title="Admin" subtitle="Protected by PermissionGuard (admin:view)" />
      <ContentCard>
        <Typography>
          This page is only visible to users with the <strong>admin:view</strong> permission.
        </Typography>
      </ContentCard>
    </PermissionGuard>
  );
}
