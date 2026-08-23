import { Button, Chip, Stack, Typography } from '@mui/material';
import { ContentCard, PageTitle } from '@palette/ui-common';
import { PLATFORM_LAYOUT_VERSION } from '@palette/platform-layout';
import { PLATFORM_SHELL_VERSION } from '@palette/platform-shell';
import { UI_COMMON_VERSION } from '@palette/ui-common';

export function DashboardPage() {
  return (
    <>
      <PageTitle
        title="Dashboard"
        subtitle="Palette Enterprise Platform — Phase 1 UI Core"
      />

      <Stack spacing={3}>
        <ContentCard>
          <Typography variant="h6" gutterBottom>
            Platform Status
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip label={`@palette/platform-shell v${PLATFORM_SHELL_VERSION}`} color="primary" />
            <Chip label={`@palette/platform-layout v${PLATFORM_LAYOUT_VERSION}`} />
            <Chip label={`@palette/ui-common v${UI_COMMON_VERSION}`} />
          </Stack>
        </ContentCard>

        <ContentCard>
          <Typography variant="h6" gutterBottom>
            Phase 1 Deliverables
          </Typography>
          <Stack component="ul" spacing={1} sx={{ pl: 2, m: 0 }}>
            <Typography component="li" variant="body2">
              Application Shell with Header, Sidebar, Breadcrumb
            </Typography>
            <Typography component="li" variant="body2">
              MUI Theme system
            </Typography>
            <Typography component="li" variant="body2">
              Configurable navigation
            </Typography>
            <Typography component="li" variant="body2">
              React Router integration
            </Typography>
            <Typography component="li" variant="body2">
              Basic UI components (PageTitle, ContentCard)
            </Typography>
          </Stack>
        </ContentCard>

        <ContentCard>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="contained">Primary Action</Button>
            <Button variant="outlined">Secondary Action</Button>
          </Stack>
        </ContentCard>
      </Stack>
    </>
  );
}
