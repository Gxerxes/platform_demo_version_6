import { describe, expect, it } from 'vitest';
import { DEFAULT_API_CLIENT_CONFIG } from './ApiClientDefaults';
import { mergeConfig } from './mergeConfig';

describe('mergeConfig', () => {
  it('applies platform defaults', () => {
    const resolved = mergeConfig();
    expect(resolved.timeout).toBe(DEFAULT_API_CLIENT_CONFIG.timeout);
    expect(resolved.withCredentials).toBe(true);
    expect(resolved.retry.enabled).toBe(false);
    expect(resolved.requestId.enabled).toBe(true);
  });

  it('merges consumer overrides without mutating input', () => {
    const input = {
      baseURL: '/api',
      timeout: 15_000,
      headers: { 'X-App': 'trading' },
      retry: { enabled: true, retries: 2 },
    };

    const resolved = mergeConfig(input);

    expect(resolved.baseURL).toBe('/api');
    expect(resolved.timeout).toBe(15_000);
    expect(resolved.headers['X-App']).toBe('trading');
    expect(resolved.retry.retries).toBe(2);
    expect(input.headers).toEqual({ 'X-App': 'trading' });
  });

  it('supports legacy baseUrl alias', () => {
    const resolved = mergeConfig({ baseUrl: '/palette/api/' });
    expect(resolved.baseURL).toBe('/palette/api');
  });

  it('deep merges nested auth and requestId config', () => {
    const resolved = mergeConfig({
      auth: { enabled: false },
      requestId: { headerName: 'X-Correlation-ID' },
    });

    expect(resolved.auth.enabled).toBe(false);
    expect(resolved.requestId.headerName).toBe('X-Correlation-ID');
    expect(resolved.requestId.enabled).toBe(true);
  });
});
