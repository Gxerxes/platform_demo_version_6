import { FormControlLabel, Stack, Switch, TextField, Typography } from '@mui/material';
import { ContentCard, PageTitle } from '@palette/ui-common';

export function SettingsPage() {
  return (
    <>
      <PageTitle title="Settings" subtitle="Application configuration" />

      <ContentCard>
        <Stack spacing={3} maxWidth={480}>
          <TextField label="Application Name" defaultValue="Palette Showcase" fullWidth />
          <TextField label="API Base URL" defaultValue="/api" fullWidth />
          <FormControlLabel control={<Switch defaultChecked />} label="Enable notifications" />
          <Typography variant="caption" color="text.secondary">
            Settings are for demonstration only in Phase 1.
          </Typography>
        </Stack>
      </ContentCard>
    </>
  );
}
