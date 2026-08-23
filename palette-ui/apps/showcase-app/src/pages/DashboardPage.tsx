import { Chip, Stack, Typography } from '@mui/material';
import { ContentCard, PageTitle, PLATFORM_SDK_VERSION } from '@palette/platform-sdk';

export function DashboardPage() {
  return (
    <>
      <PageTitle
        title="Dashboard"
        subtitle="Palette Enterprise Platform — Phase 2 UI Platform SDK"
      />

      <Stack spacing={3}>
        <ContentCard>
          <Typography variant="h6" gutterBottom>
            Platform Status
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip label={`@palette/platform-sdk v${PLATFORM_SDK_VERSION}`} color="primary" />
            <Chip label="Phase 2 Complete" color="success" />
          </Stack>
        </ContentCard>

        <ContentCard>
          <Typography variant="h6" gutterBottom>
            Phase 2 Deliverables
          </Typography>
          <Stack component="ul" spacing={1} sx={{ pl: 2, m: 0 }}>
            <Typography component="li" variant="body2">
              PalettePlatformProvider — unified platform context
            </Typography>
            <Typography component="li" variant="body2">
              Permission system with PermissionGuard and navigation filtering
            </Typography>
            <Typography component="li" variant="body2">
              ApiClient with error handling and event integration
            </Typography>
            <Typography component="li" variant="body2">
              EventBus for application-wide communication
            </Typography>
            <Typography component="li" variant="body2">
              Notification system (Snackbar)
            </Typography>
            <Typography component="li" variant="body2">
              ErrorBoundary and global error handling
            </Typography>
            <Typography component="li" variant="body2">
              PaletteApp — single entry point for business applications
            </Typography>
          </Stack>
        </ContentCard>
      </Stack>
    </>
  );
}
