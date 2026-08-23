import { Button, Stack, Typography } from '@mui/material';
import {
  ContentCard,
  PageTitle,
  PermissionGuard,
  PLATFORM_SDK_VERSION,
  useApiClient,
  useEventBus,
  useNotification,
  usePermission,
  usePlatform,
  PaletteEvents,
} from '@palette/platform-sdk';
import { paletteConfig, platformConfig } from '../palette.config';

export function SdkDemoPage() {
  const platform = usePlatform(platformConfig);
  const api = useApiClient();
  const events = useEventBus();
  const notification = useNotification();
  const permission = usePermission();

  const handleNotification = (severity: 'success' | 'error' | 'warning' | 'info') => {
    notification.showNotification({
      message: `This is a ${severity} notification`,
      severity,
    });
  };

  const handleApiCall = async () => {
    try {
      await api.get('/trades');
      notification.showSuccess('API call completed');
    } catch {
      notification.showError('API call failed (expected in demo without backend)');
    }
  };

  const handleEmitEvent = () => {
    events.emit(PaletteEvents.NOTIFICATION, { message: 'Custom event emitted' });
    notification.showInfo('Event emitted: palette:notification');
  };

  return (
    <>
      <PageTitle
        title="SDK Demo"
        subtitle={`@palette/platform-sdk v${PLATFORM_SDK_VERSION}`}
      />

      <Stack spacing={3}>
        <ContentCard>
          <Typography variant="h6" gutterBottom>
            usePlatform
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            API Base URL: {platform.config.api.baseUrl}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            App Name: {paletteConfig.appName}
          </Typography>
        </ContentCard>

        <ContentCard>
          <Typography variant="h6" gutterBottom>
            useNotification
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Button size="small" variant="contained" onClick={() => handleNotification('success')}>
              Success
            </Button>
            <Button size="small" variant="contained" color="error" onClick={() => handleNotification('error')}>
              Error
            </Button>
            <Button size="small" variant="contained" color="warning" onClick={() => handleNotification('warning')}>
              Warning
            </Button>
            <Button size="small" variant="outlined" onClick={() => handleNotification('info')}>
              Info
            </Button>
          </Stack>
        </ContentCard>

        <ContentCard>
          <Typography variant="h6" gutterBottom>
            useApiClient
          </Typography>
          <Button variant="contained" onClick={handleApiCall}>
            Call GET /api/trades
          </Button>
        </ContentCard>

        <ContentCard>
          <Typography variant="h6" gutterBottom>
            useEventBus
          </Typography>
          <Button variant="outlined" onClick={handleEmitEvent}>
            Emit palette:notification event
          </Button>
        </ContentCard>

        <ContentCard>
          <Typography variant="h6" gutterBottom>
            usePermission
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Current permissions: {permission.permissions.join(', ')}
          </Typography>
          <PermissionGuard permission="admin:view" fallback={
            <Typography variant="body2" color="error">Admin section hidden (no permission)</Typography>
          }>
            <Typography variant="body2" color="success.main">
              Admin section visible (admin:view granted)
            </Typography>
          </PermissionGuard>
        </ContentCard>
      </Stack>
    </>
  );
}
