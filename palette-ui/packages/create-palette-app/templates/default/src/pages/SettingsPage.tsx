import { Typography } from '@mui/material';
import { ContentCard, PageTitle } from '@palette/platform-sdk';

export function SettingsPage() {
  return (
    <>
      <PageTitle title="Settings" subtitle="Application settings placeholder" />

      <ContentCard>
        <Typography variant="body2" color="text.secondary">
          Replace this page with your business-specific settings.
        </Typography>
      </ContentCard>
    </>
  );
}
