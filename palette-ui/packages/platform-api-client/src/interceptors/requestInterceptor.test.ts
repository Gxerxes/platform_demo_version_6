import { describe, expect, it, vi } from 'vitest';
import type { InternalAxiosRequestConfig } from 'axios';
import { AxiosHeaders } from 'axios';
import {
  createAuthInterceptor,
  createRequestIdInterceptor,
} from './requestInterceptor';
import { mergeConfig } from '../config/mergeConfig';

describe('requestInterceptor', () => {
  it('adds request id when not supplied by consumer', () => {
    const config = mergeConfig({ requestId: { enabled: true, headerName: 'X-Request-ID' } });
    const interceptor = createRequestIdInterceptor(config);
    const requestConfig = {
      headers: new AxiosHeaders(),
    } as InternalAxiosRequestConfig;

    interceptor(requestConfig);

    expect(requestConfig.headers.get('X-Request-ID')).toBeTruthy();
  });

  it('does not overwrite existing request id', () => {
    const config = mergeConfig({ requestId: { enabled: true, headerName: 'X-Request-ID' } });
    const interceptor = createRequestIdInterceptor(config);
    const requestConfig = {
      headers: new AxiosHeaders({ 'X-Request-ID': 'existing-id' }),
    } as InternalAxiosRequestConfig;

    interceptor(requestConfig);

    expect(requestConfig.headers.get('X-Request-ID')).toBe('existing-id');
  });

  it('attaches bearer token when auth is enabled', async () => {
    const getAccessToken = vi.fn().mockResolvedValue('secret-token');
    const config = mergeConfig({
      auth: { enabled: true, getAccessToken },
    });
    const interceptor = createAuthInterceptor(config);
    const requestConfig = {
      headers: new AxiosHeaders(),
    } as InternalAxiosRequestConfig;

    await interceptor(requestConfig);

    expect(getAccessToken).toHaveBeenCalled();
    expect(requestConfig.headers.get('Authorization')).toBe('Bearer secret-token');
  });

  it('respects existing Authorization header', async () => {
    const getAccessToken = vi.fn().mockResolvedValue('secret-token');
    const config = mergeConfig({
      auth: { enabled: true, getAccessToken },
    });
    const interceptor = createAuthInterceptor(config);
    const requestConfig = {
      headers: new AxiosHeaders({ Authorization: 'Bearer custom-token' }),
    } as InternalAxiosRequestConfig;

    await interceptor(requestConfig);

    expect(getAccessToken).not.toHaveBeenCalled();
    expect(requestConfig.headers.get('Authorization')).toBe('Bearer custom-token');
  });
});
