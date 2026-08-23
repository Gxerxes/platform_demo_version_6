import { useApiClient } from '@palette/platform-api-client';
import type { PalettePlatformConfig } from '@palette/platform-config';
import { useEventBus } from '@palette/platform-event';
import { usePermission } from '@palette/platform-security';
import { useNotification } from './NotificationProvider';

export interface PlatformContextValue {
  config: PalettePlatformConfig;
  api: ReturnType<typeof useApiClient>;
  events: ReturnType<typeof useEventBus>;
  permission: ReturnType<typeof usePermission>;
  notification: ReturnType<typeof useNotification>;
}

export function usePlatform(config: PalettePlatformConfig): PlatformContextValue {
  return {
    config,
    api: useApiClient(),
    events: useEventBus(),
    permission: usePermission(),
    notification: useNotification(),
  };
}
