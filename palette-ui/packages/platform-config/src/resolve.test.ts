import { describe, expect, it } from 'vitest';
import { defaultPlatformConfig } from './defaults';
import { resolvePlatformConfig } from './resolve';

describe('resolvePlatformConfig', () => {
  it('applies platform defaults', () => {
    const resolved = resolvePlatformConfig(defaultPlatformConfig, undefined, {
      api: { baseUrl: '/palette/api/v1' },
    });

    expect(resolved.api.baseUrl).toBe('/palette/api/v1');
    expect(resolved.api.timeout).toBe(30_000);
    expect(resolved.api.withCredentials).toBe(true);
    expect(resolved.query?.staleTime).toBe(30_000);
  });

  it('merges nested api config without losing defaults', () => {
    const resolved = resolvePlatformConfig(defaultPlatformConfig, undefined, {
      api: {
        baseUrl: '/api',
        timeout: 10_000,
      },
    });

    expect(resolved.api).toEqual({
      baseUrl: '/api',
      timeout: 10_000,
      withCredentials: true,
    });
  });

  it('merges headers without mutating inputs', () => {
    const defaults = {
      ...defaultPlatformConfig,
      api: {
        baseUrl: '/api',
        headers: { 'X-Platform': 'palette' },
      },
    };
    const application = {
      api: {
        baseUrl: '/api',
        headers: { 'X-App': 'trading' },
      },
    };

    const resolved = resolvePlatformConfig(defaults, undefined, application);

    expect(resolved.api.headers).toEqual({
      'X-Platform': 'palette',
      'X-App': 'trading',
    });
    expect(defaults.api.headers).toEqual({ 'X-Platform': 'palette' });
    expect(application.api.headers).toEqual({ 'X-App': 'trading' });
  });

  it('applies runtime then application priority', () => {
    const resolved = resolvePlatformConfig(
      defaultPlatformConfig,
      { query: { retry: 2 } },
      { query: { retry: 0 } },
    );

    expect(resolved.query?.retry).toBe(0);
  });
});
